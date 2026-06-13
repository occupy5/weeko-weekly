#!/usr/bin/env python3
"""Generate SRT subtitles using ElevenLabs forced alignment API for precise timestamps."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Optional

from elevenlabs import ElevenLabs

from tts_config import AUDIO_DIR_NAME, METADATA_FILENAME
from tts import parse_script, find_current_episode, get_audio_dir


def format_srt_time(seconds: float) -> str:
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = round((seconds - int(seconds)) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def preprocess_for_alignment(text: str) -> str:
    text = re.sub(r"^\s*>.*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\*(.+?)\*", r"\1", text)
    text = re.sub(r"`(.+?)`", r"\1", text)
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"—+", ", ", text)
    text = re.sub(r"^\s*$", "", text, flags=re.MULTILINE)
    lines = text.strip().split("\n")
    lines = [line.strip() for line in lines if line.strip()]
    return " ".join(lines)


def visual_len(text: str) -> int:
    length = 0
    for ch in text:
        if '\u4e00' <= ch <= '\u9fff' or ch in '，。！？、：；「」':
            length += 2
        elif ch == ' ' or ch in '\n\t':
            pass
        else:
            length += 1
    return length


def group_words_into_chunks(
    words: list,
    min_visual: int = 12,
    max_visual: int = 40,
) -> list[dict]:
    strong_break = set("。！？")
    weak_break = set("，、：；")

    def is_punct(w):
        return w.text in {" ", "\n"} | strong_break | weak_break or w.text.startswith("。") or w.text.startswith("！") or w.text.startswith("？")

    chunks = []
    current_words = []

    for word in words:
        current_words.append(word)
        joined = "".join(w.text for w in current_words).replace("\n", " ")
        joined = re.sub(r"\s+", " ", joined).strip()
        vlen = visual_len(joined)

        if word.text in strong_break and vlen >= min_visual:
            chunks.append(current_words)
            current_words = []
        elif vlen > max_visual:
            best_break = -1
            break_vlen = 0
            for i in range(len(current_words)):
                candidate = "".join(w.text for w in current_words[: i + 1]).replace("\n", " ")
                candidate = re.sub(r"\s+", " ", candidate).strip()
                candidate_vlen = visual_len(candidate)
                if current_words[i].text in weak_break and candidate_vlen >= min_visual // 2:
                    if best_break == -1 or candidate_vlen > break_vlen:
                        best_break = i
                        break_vlen = candidate_vlen
            if best_break >= 0:
                chunks.append(current_words[: best_break + 1])
                current_words = current_words[best_break + 1 :]
            else:
                chunks.append(current_words)
                current_words = []

    if current_words:
        joined = "".join(w.text for w in current_words).replace("\n", " ")
        joined = re.sub(r"\s+", " ", joined).strip()
        if not joined:
            pass
        elif visual_len(joined) < min_visual // 2 and chunks:
            chunks[-1].extend(current_words)
        else:
            chunks.append(current_words)

    result = []
    for chunk_words in chunks:
        text = "".join(w.text for w in chunk_words).replace("\n", " ")
        text = re.sub(r"\s+", " ", text).strip()
        if not text:
            continue
        start = chunk_words[0].start
        end = chunk_words[-1].end
        result.append({"text": text, "start": start, "end": end})

    cleaned = []
    for item in result:
        if not cleaned:
            cleaned.append(item)
            continue
        if item["text"][0] in "。！？；" and visual_len(cleaned[-1]["text"]) < max_visual:
            cleaned[-1]["text"] += item["text"]
            cleaned[-1]["end"] = item["end"]
        else:
            cleaned.append(item)

    return cleaned


def find_active_file(audio_dir: Path, base_filename: str) -> Optional[str]:
    best_version = 0
    best_file = None

    for f in audio_dir.iterdir():
        if f.name == f"{base_filename}.mp3":
            return f.name
        match = re.match(
            rf"^{re.escape(base_filename)}-v(\d+)\.mp3$", f.name
        )
        if match:
            v = int(match.group(1))
            if v > best_version:
                best_version = v
                best_file = f.name

    return best_file


def generate_srt(
    client: ElevenLabs,
    audio_dir: Path,
    script_path: Path,
    episode: str,
    output_path: Path,
    max_chars: int = 18,
    gap: float = 0.3,
) -> None:
    sections = parse_script(script_path)

    srt_entries = []
    global_index = 1
    time_offset = 0.0

    for section in sections:
        active_file = find_active_file(audio_dir, section.base_filename)
        if not active_file:
            print(f"  [{section.id}] No audio for {section.base_filename}, skipping")
            continue

        audio_path = audio_dir / active_file
        if not audio_path.exists():
            print(f"  [{section.id}] Not found: {active_file}, skipping")
            continue

        subtitle_text = preprocess_for_alignment(section.text)

        print(f"  [{section.id}] {section.title} - Aligning {active_file}...")

        try:
            with open(audio_path, "rb") as f:
                audio_data = f.read()
            alignment = client.forced_alignment.create(
                file=("audio.mp3", audio_data, "audio/mpeg"),
                text=subtitle_text,
            )
        except Exception as e:
            print(f"  [{section.id}] Alignment failed: {e}, skipping")
            continue

        chunks = group_words_into_chunks(alignment.words, max_visual=max_chars)

        for chunk in chunks:
            start_time = chunk["start"] + time_offset
            end_time = chunk["end"] + time_offset

            srt_entries.append(
                f"{global_index}\n"
                f"{format_srt_time(start_time)} --> {format_srt_time(end_time)}\n"
                f"{chunk['text']}\n"
            )
            global_index += 1

        last_end = chunks[-1]["end"] if chunks else 0
        time_offset += last_end + gap

        print(f"  [{section.id}] {len(chunks)} entries (last_end={last_end:.2f}s)")

    srt_content = "\n".join(srt_entries)
    output_path.write_text(srt_content, encoding="utf-8")
    print(f"\nSRT saved to {output_path} ({global_index - 1} entries)")


def main():
    project_root = Path(__file__).parent.parent

    ap = argparse.ArgumentParser(description="Generate SRT subtitles via forced alignment")
    ap.add_argument("--episode", "-e", help="Episode name")
    ap.add_argument("--output", "-o", help="Output SRT file path")
    ap.add_argument("--max-chars", type=int, default=40, help="Max visual width per subtitle (CJK=2, ASCII=1)")
    ap.add_argument("--gap", type=float, default=0.3, help="Gap between sections (seconds)")

    args = ap.parse_args()

    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        print("Error: ELEVENLABS_API_KEY required")
        sys.exit(1)

    client = ElevenLabs(api_key=api_key)

    episode = args.episode or find_current_episode(project_root)
    script_path = project_root / "weekly" / episode / "script.md"
    audio_dir = get_audio_dir(project_root, episode)

    if not script_path.exists():
        print(f"Error: Script not found: {script_path}")
        sys.exit(1)

    output_path = Path(args.output) if args.output else audio_dir / f"{episode}.srt"

    print(f"Episode: {episode}")
    print(f"Script:  {script_path}")
    print(f"Output:  {output_path}\n")

    generate_srt(
        client=client,
        audio_dir=audio_dir,
        script_path=script_path,
        episode=episode,
        output_path=output_path,
        max_chars=args.max_chars,
        gap=args.gap,
    )


if __name__ == "__main__":
    main()
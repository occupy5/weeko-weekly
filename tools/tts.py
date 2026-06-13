#!/usr/bin/env python3
"""Weeko TTS Tool - Convert narration scripts to audio using ElevenLabs."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from elevenlabs import ElevenLabs, VoiceSettings

from tts_config import (
    AUDIO_DIR_NAME,
    CHINESE_NUM_MAP,
    DEFAULT_LANGUAGE_CODE,
    DEFAULT_MODEL_ID,
    DEFAULT_OUTPUT_FORMAT,
    DEFAULT_SPEED,
    DEFAULT_VOICE_ID,
    DEFAULT_VOICE_NAME,
    DEFAULT_VOICE_SETTINGS,
    METADATA_FILENAME,
    SECTION_FILENAME_TEMPLATE,
)


@dataclass
class Section:
    id: str
    title: str
    text: str
    estimated_duration: int = 0
    base_filename: str = ""


def chinese_num_to_id(num_str: str) -> str:
    if num_str in CHINESE_NUM_MAP:
        return CHINESE_NUM_MAP[num_str]
    result = ""
    if "十" in num_str:
        parts = num_str.replace("十", "").split()
        if num_str == "十":
            return "10"
        if num_str.startswith("十"):
            return f"1{CHINESE_NUM_MAP.get(num_str[1:], '0')}"
        ten_part = CHINESE_NUM_MAP.get(num_str[0], "1")
        one_part = CHINESE_NUM_MAP.get(num_str[-1], "0") if len(num_str) > 1 else "0"
        return f"{ten_part}{one_part}" if one_part != "0" else ten_part
    return CHINESE_NUM_MAP.get(num_str, num_str.zfill(2))


def parse_duration(duration_str: str) -> int:
    match = re.search(r"约\s*([\d.]+)\s*分钟", duration_str)
    if match:
        return int(float(match.group(1)) * 60)
    match = re.search(r"([\d.]+)\s*分", duration_str)
    if match:
        minutes = float(match.group(1))
        seconds_match = re.search(r"(\d+)\s*秒", duration_str)
        seconds = int(seconds_match.group(1)) if seconds_match else 0
        return int(minutes * 60) + seconds
    return 0


def extract_section_info(header: str) -> tuple[str, str, int]:
    header = re.sub(r"^##\s+", "", header)
    header = re.sub(r"^###\s+", "", header)

    bracket_match = re.match(r"^【(.+?)】", header)
    if bracket_match:
        content = bracket_match.group(1)
        num_match = re.search(r"第([零一二三四五六七八九十]+)部分", content)
        if num_match:
            section_id = chinese_num_to_id(num_match.group(1))
        else:
            section_id = ""
        title = re.sub(r"^第[零一二三四五六七八九十]+部分[：:]?", "", content).strip()
        title = re.sub(r"（[^）]+）", "", title).strip()
        if not title:
            title = content
            title = re.sub(r"（[^）]+）", "", title).strip()
        duration = parse_duration(header)
        return section_id, title, duration

    chinese_match = re.match(r"^([一二三四五六七八九十]+)、(.+)", header)
    if chinese_match:
        section_id = chinese_num_to_id(chinese_match.group(1))
        title = chinese_match.group(2)
        title = re.sub(r"（[^）]+）", "", title).strip()
        duration = parse_duration(header)
        return section_id, title, duration

    title = re.sub(r"（[^）]+）", "", header).strip()
    duration = parse_duration(header)
    return "00", title, duration


def preprocess_text(text: str) -> str:
    text = re.sub(r"^\s*>.*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\*(.+?)\*", r"\1", text)
    text = re.sub(r"`(.+?)`", r"\1", text)
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"—+", "", text)
    text = re.sub(r"^\s*$", "", text, flags=re.MULTILINE)
    lines = text.strip().split("\n")
    lines = [line.strip() for line in lines if line.strip()]
    return "\n".join(lines)


def parse_script(filepath: Path) -> list[Section]:
    content = filepath.read_text(encoding="utf-8")

    content = re.sub(r"^---\s*$", "", content, flags=re.MULTILINE)

    parts = re.split(r"\n(?=## )", content)

    raw_sections = []
    for part in parts:
        part = part.strip()
        if not part:
            continue

        lines = part.split("\n")
        header_line = None
        body_lines = []

        for line in lines:
            stripped = line.strip()
            if stripped.startswith("## ") and header_line is None:
                header_line = stripped
            elif stripped.startswith("# "):
                continue
            else:
                body_lines.append(line)

        body_text = preprocess_text("\n".join(body_lines))
        if not body_text:
            continue

        if header_line:
            extracted_id, title, duration = extract_section_info(header_line)
        else:
            extracted_id = ""
            title = ""
            duration = 0

        raw_sections.append((extracted_id, title, body_text, duration))

    sections = []
    for idx, (extracted_id, title, text, duration) in enumerate(raw_sections, start=1):
        section_id = str(idx).zfill(2)
        base_filename = SECTION_FILENAME_TEMPLATE.format(
            id=section_id,
            title=title if title else f"section-{section_id}",
        )
        sections.append(
            Section(
                id=section_id,
                title=title,
                text=text,
                estimated_duration=duration,
                base_filename=base_filename,
            )
        )

    return sections


def find_current_episode(project_root: Path) -> str:
    slides_md = project_root / "slides.md"
    if slides_md.exists():
        content = slides_md.read_text(encoding="utf-8")
        match = re.search(r"src:\s*./weekly/(.+?)/slides\.md", content)
        if match:
            return match.group(1)
    weekly_dir = project_root / "weekly"
    if weekly_dir.exists():
        dirs = sorted(
            [
                d.name
                for d in weekly_dir.iterdir()
                if d.is_dir() and not d.name.startswith("_")
            ]
        )
        if dirs:
            return dirs[-1]
    raise ValueError("Cannot find current episode. Use --episode to specify.")


def get_audio_dir(project_root: Path, episode: str) -> Path:
    return project_root / "weekly" / episode / AUDIO_DIR_NAME


def get_existing_versions(audio_dir: Path, base_filename: str) -> list[int]:
    if not audio_dir.exists():
        return []

    existing_versions = []
    v_pattern = re.compile(rf"^{re.escape(base_filename)}-v(\d+)\.mp3$")
    old_pattern = f"{base_filename}.mp3"

    for f in audio_dir.iterdir():
        if f.name == old_pattern:
            existing_versions.append(1)
            continue
        match = v_pattern.match(f.name)
        if match:
            existing_versions.append(int(match.group(1)))

    return sorted(existing_versions)


def get_next_version(audio_dir: Path, base_filename: str) -> int:
    versions = get_existing_versions(audio_dir, base_filename)
    if not versions:
        return 1
    return max(versions) + 1


def get_active_file(audio_dir: Path, base_filename: str) -> Optional[str]:
    versions = get_existing_versions(audio_dir, base_filename)
    if not versions:
        return None
    latest = max(versions)
    if latest == 1 and f"{base_filename}.mp3" in [f.name for f in audio_dir.iterdir()]:
        return f"{base_filename}.mp3"
    return f"{base_filename}-v{latest}.mp3"


def convert_section(
    client: ElevenLabs,
    section: Section,
    voice_id: str,
    model_id: str,
    language_code: str,
    output_format: str,
    voice_settings: dict,
    previous_text: Optional[str] = None,
    next_text: Optional[str] = None,
) -> bytes:
    kwargs = {
        "text": section.text,
        "voice_id": voice_id,
        "model_id": model_id,
        "output_format": output_format,
    }

    if language_code:
        kwargs["language_code"] = language_code

    if voice_settings:
        kwargs["voice_settings"] = VoiceSettings(
            stability=voice_settings.get("stability", 0.5),
            similarity_boost=voice_settings.get("similarity_boost", 0.75),
            style=voice_settings.get("style", 0.3),
            speed=voice_settings.get("speed", DEFAULT_SPEED),
            use_speaker_boost=voice_settings.get("use_speaker_boost", True),
        )

    if previous_text:
        kwargs["previous_text"] = previous_text
    if next_text:
        kwargs["next_text"] = next_text

    audio = client.text_to_speech.convert(**kwargs)
    result = b""
    for chunk in audio:
        result += chunk
    return result


def list_voices(client: ElevenLabs) -> None:
    voices = client.voices.get_all()
    for voice in voices.voices:
        labels = voice.labels or {}
        accent = labels.get("accent", "")
        gender = labels.get("gender", "")
        desc = labels.get("description", "")
        use_case = labels.get("use_case", "")
        print(
            f"{voice.voice_id}: {voice.name} ({gender}, {accent}) - {desc} [{use_case}]"
        )


def dry_run(sections: list[Section], audio_dir: Path) -> None:
    print(f"Found {len(sections)} sections:\n")
    for section in sections:
        duration_str = (
            f"~{section.estimated_duration // 60}min"
            if section.estimated_duration
            else "?"
        )
        existing = get_existing_versions(audio_dir, section.base_filename)
        next_ver = get_next_version(audio_dir, section.base_filename)
        if next_ver == 1:
            next_file = f"{section.base_filename}-v1.mp3"
        else:
            next_file = f"{section.base_filename}-v{next_ver}.mp3"

        existing_str = (
            ", ".join([f"v{v}" if v > 1 else "v1 (old format)" for v in existing])
            if existing
            else "none"
        )

        print(f"  [{section.id}] {section.title} ({duration_str})")
        print(f"       Existing: {existing_str} | Next: v{next_ver}")
        print(f"       Next file: {next_file}")
        print(f"       Characters: {len(section.text)}")
        preview = section.text[:80] + "..." if len(section.text) > 80 else section.text
        print(f"       Preview: {preview}")
        print()
    total_chars = sum(len(s.text) for s in sections)
    total_dur = sum(s.estimated_duration for s in sections)
    print(f"Total: {total_chars} characters, estimated {total_dur // 60} minutes")


def build_metadata(
    sections: list[Section],
    audio_dir: Path,
    episode: str,
    voice_id: str,
    voice_name: str,
    model_id: str,
    language_code: str,
    output_format: str,
    voice_settings: dict,
) -> dict:
    section_entries = []
    for s in sections:
        versions = get_existing_versions(audio_dir, s.base_filename)
        active_file = get_active_file(audio_dir, s.base_filename)
        version_labels = [f"v{v}" for v in versions]

        section_entries.append(
            {
                "id": s.id,
                "title": s.title,
                "base_filename": s.base_filename,
                "versions": version_labels,
                "active_version": version_labels[-1] if version_labels else None,
                "active_file": active_file,
                "characters": len(s.text),
                "estimated_duration": s.estimated_duration,
            }
        )

    return {
        "episode": episode,
        "model_id": model_id,
        "voice_id": voice_id,
        "voice_name": voice_name,
        "language_code": language_code,
        "output_format": output_format,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_characters": sum(len(s.text) for s in sections),
        "voice_settings": voice_settings,
        "sections": section_entries,
    }


def convert_all(
    client: ElevenLabs,
    sections: list[Section],
    audio_dir: Path,
    episode: str,
    voice_id: str,
    voice_name: str,
    model_id: str,
    language_code: str,
    output_format: str,
    voice_settings: dict,
) -> None:
    audio_dir.mkdir(parents=True, exist_ok=True)

    for i, section in enumerate(sections):
        next_ver = get_next_version(audio_dir, section.base_filename)
        filename = f"{section.base_filename}-v{next_ver}.mp3"
        filepath = audio_dir / filename

        previous_text = sections[i - 1].text if i > 0 else None
        next_text = sections[i + 1].text if i < len(sections) - 1 else None

        print(
            f"  [{section.id}] {section.title} - Converting v{next_ver} ({len(section.text)} chars)..."
        )
        audio_data = convert_section(
            client=client,
            section=section,
            voice_id=voice_id,
            model_id=model_id,
            language_code=language_code,
            output_format=output_format,
            voice_settings=voice_settings,
            previous_text=previous_text,
            next_text=next_text,
        )

        filepath.write_bytes(audio_data)
        print(f"  [{section.id}] {section.title} - Saved to {filepath}")

    metadata = build_metadata(
        sections=sections,
        audio_dir=audio_dir,
        episode=episode,
        voice_id=voice_id,
        voice_name=voice_name,
        model_id=model_id,
        language_code=language_code,
        output_format=output_format,
        voice_settings=voice_settings,
    )

    metadata_path = audio_dir / METADATA_FILENAME
    metadata_path.write_text(
        json.dumps(metadata, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"\nMetadata saved to {metadata_path}")


def merge_audio(audio_dir: Path, episode: str) -> Path:
    metadata_path = audio_dir / METADATA_FILENAME
    if not metadata_path.exists():
        raise ValueError(f"No {METADATA_FILENAME} found in {audio_dir}")

    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    sections = metadata["sections"]

    concat_file = audio_dir / "concat_list.txt"
    with open(concat_file, "w", encoding="utf-8") as f:
        for section in sections:
            active_file = section.get("active_file")
            if not active_file:
                raise ValueError(
                    f"Section {section['id']} '{section['title']}' has no active audio file"
                )
            filepath = audio_dir / active_file
            if not filepath.exists():
                raise FileNotFoundError(f"Active file not found: {filepath}")
            f.write(f"file '{filepath.name}'\n")

    output_path = audio_dir / f"{episode}-full.mp3"

    import subprocess

    result = subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(concat_file),
            "-c",
            "copy",
            str(output_path),
        ],
        capture_output=True,
        text=True,
        cwd=str(audio_dir),
    )

    if result.returncode != 0:
        print(f"ffmpeg error: {result.stderr}")
        raise RuntimeError("ffmpeg merge failed")

    concat_file.unlink()
    print(f"Merged audio saved to {output_path}")
    return output_path


def main():
    project_root = Path(__file__).parent.parent

    parser = argparse.ArgumentParser(
        description="Weeko TTS - Convert narration scripts to audio",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 tools/tts.py                        # Convert current episode
  python3 tools/tts.py --episode 03-open-agents  # Specify episode
  python3 tools/tts.py --dry-run               # Preview sections without converting
  python3 tools/tts.py --list-voices           # List available voices
  python3 tools/tts.py --sections 01,03,05     # Convert specific sections only
  python3 tools/tts.py --merge                 # Merge all sections into one file
        """,
    )

    parser.add_argument("--episode", "-e", help="Episode name (e.g., 03-open-agents)")
    parser.add_argument(
        "--voice",
        "-v",
        default=DEFAULT_VOICE_ID,
        help=f"Voice ID (default: {DEFAULT_VOICE_ID} / {DEFAULT_VOICE_NAME})",
    )
    parser.add_argument(
        "--model",
        "-m",
        default=DEFAULT_MODEL_ID,
        help=f"Model ID (default: {DEFAULT_MODEL_ID})",
    )
    parser.add_argument(
        "--language",
        "-l",
        default=DEFAULT_LANGUAGE_CODE,
        help=f"Language code (default: {DEFAULT_LANGUAGE_CODE})",
    )
    parser.add_argument(
        "--format",
        "-f",
        default=DEFAULT_OUTPUT_FORMAT,
        help=f"Output format (default: {DEFAULT_OUTPUT_FORMAT})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview parsed sections without calling API",
    )
    parser.add_argument(
        "--list-voices", action="store_true", help="List all available voices"
    )
    parser.add_argument(
        "--sections",
        "-s",
        help="Comma-separated section IDs to convert (e.g., 01,03,05)",
    )
    parser.add_argument(
        "--merge",
        action="store_true",
        help="Merge all section audio files into one (requires ffmpeg)",
    )
    parser.add_argument(
        "--stability", type=float, help="Voice stability (0-1, default: 1)"
    )
    parser.add_argument(
        "--similarity-boost",
        type=float,
        help="Voice similarity boost (0-1, default: 0.65)",
    )
    parser.add_argument(
        "--style", type=float, help="Voice style exaggeration (0-1, default: 0)"
    )
    parser.add_argument(
        "--speed", type=float, help="Voice speed (0.25-4.0, default: 1.2)"
    )

    args = parser.parse_args()

    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key and not args.dry_run:
        print("Error: ELEVENLABS_API_KEY environment variable is required")
        print("Set it with: export ELEVENLABS_API_KEY=your-api-key")
        sys.exit(1)

    client = ElevenLabs(api_key=api_key) if api_key else None

    if args.list_voices:
        if not client:
            print("Error: ELEVENLABS_API_KEY required for --list-voices")
            sys.exit(1)
        list_voices(client)
        return

    episode = args.episode or find_current_episode(project_root)
    script_path = project_root / "weekly" / episode / "script.md"

    if not script_path.exists():
        print(f"Error: Script file not found: {script_path}")
        sys.exit(1)

    print(f"Episode: {episode}")
    print(f"Script:  {script_path}")

    sections = parse_script(script_path)

    if args.sections:
        selected_ids = set(args.sections.split(","))
        sections = [s for s in sections if s.id in selected_ids]
        if not sections:
            print(f"Error: No sections found with IDs: {args.sections}")
            sys.exit(1)

    voice_settings = dict(DEFAULT_VOICE_SETTINGS)
    if args.stability is not None:
        voice_settings["stability"] = args.stability
    if args.similarity_boost is not None:
        voice_settings["similarity_boost"] = args.similarity_boost
    if args.style is not None:
        voice_settings["style"] = args.style
    if args.speed is not None:
        voice_settings["speed"] = args.speed

    audio_dir = get_audio_dir(project_root, episode)

    if args.dry_run:
        dry_run(sections, audio_dir)
        return

    print(f"\nConverting {len(sections)} sections...")
    print(f"Voice: {args.voice}, Model: {args.model}, Language: {args.language}")

    voice_name = args.voice
    if client:
        try:
            voice_obj = client.voices.get(args.voice)
            voice_name = voice_obj.name
        except Exception:
            voice_name = args.voice

    convert_all(
        client=client,
        sections=sections,
        audio_dir=audio_dir,
        episode=episode,
        voice_id=args.voice,
        voice_name=voice_name,
        model_id=args.model,
        language_code=args.language,
        output_format=args.format,
        voice_settings=voice_settings,
    )

    if args.merge:
        merge_audio(audio_dir, episode)


if __name__ == "__main__":
    main()

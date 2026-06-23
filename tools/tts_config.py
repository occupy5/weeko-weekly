DEFAULT_VOICE_ID = "MNwNcuqILoUHnUG7B9kO"
DEFAULT_VOICE_NAME = "Neil Chuang"

DEFAULT_MODEL_ID = "eleven_multilingual_v2"
DEFAULT_LANGUAGE_CODE = "zh"

DEFAULT_OUTPUT_FORMAT = "mp3_44100_128"

DEFAULT_VOICE_SETTINGS = {
    "stability": 1,
    "similarity_boost": 0.6,
    "style": 0.8,
    "speed": 1,
    "use_speaker_boost": True,
}

DEFAULT_SPEED = 1

AUDIO_DIR_NAME = "audio"

SECTION_FILENAME_TEMPLATE = "{id}-{title}"

METADATA_FILENAME = "metadata.json"

SECTION_ID_PATTERN = r"^(?:第?([零一二三四五六七八九十]+)[部分]|【第?([零一二三四五六七八九十]+)[部分：:])|([一二三四五六七八九十]+)、)"

CHINESE_NUM_MAP = {
    "零": "00",
    "一": "01",
    "二": "02",
    "三": "03",
    "四": "04",
    "五": "05",
    "六": "06",
    "七": "07",
    "八": "08",
    "九": "09",
    "十": "10",
}

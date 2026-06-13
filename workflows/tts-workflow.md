# TTS 音频生成工作流程

将口播脚本（`script.md`）转换为音频文件，使用 ElevenLabs API。

## 前置条件

1. **ElevenLabs API 密钥**: 设置 `ELEVENLABS_API_KEY` 环境变量
2. **Python SDK**: `pip install elevenlabs`（或 `python3 -m pip install elevenlabs`）
3. **ffmpeg**（可选）: `--merge` 合并分段、视频音频重封装时需要

## 工作流程

### 1. 预览分段信息

转换前预览脚本分段情况：

```bash
python3 tools/tts.py --dry-run
```

显示分段 ID、标题、已有版本号和字符数，不调用 API。

### 2. 转换为音频

```bash
python3 tools/tts.py
```

逐段转换，每次生成新版本文件：

```
01-开场-v1.mp3    ← 第一次生成
01-开场-v2.mp3    ← 第二次生成（可对比不同参数）
01-开场-v3.mp3    ← 第三次生成
```

所有版本保留供对比，不覆盖旧文件。

### 3. 转换指定分段

仅转换特定分段：

```bash
python3 tools/tts.py --sections 01,03,05
```

其他分段的已有文件不受影响。

### 4. 合并为完整音频

所有分段均有活动版本后，合并为一个完整文件：

```bash
python3 tools/tts.py --merge
```

需安装 ffmpeg，生成 `{episode}-full.mp3`。合并使用每个分段的最新版本（版本号最大）。

### 5. 选择语音

列出可用语音：

```bash
python3 tools/tts.py --list-voices
```

使用其他语音：

```bash
python3 tools/tts.py --voice EXAVITQu4vr4xnSDxMaL  # Sarah
```

## 版本系统

### 命名规则

- 文件格式: `{id}-{标题}-v{N}.mp3`
- 版本号自动递增（基于 `audio/` 目录中已有文件）
- 最新版本（N 最大）为活动版本

### 旧格式兼容

无版本后缀的旧文件（如 `01-开场.mp3`）视为 v1，下次生成将产生 `01-开场-v2.mp3`。

### 版本对比与清理

所有版本保留，可直接对比：

```
audio/
  01-开场-v1.mp3     ← 默认参数
  01-开场-v2.mp3     ← --speed 1.1
  01-开场-v3.mp3     ← 不同语音
```

选择最佳版本后用 `--merge` 合并。无需的版本直接从 `audio/` 目录删除，工具自动检测剩余版本并正确递增。

## 默认配置

| 参数 | 值 | 说明 |
|------|-----|------|
| 模型 | `eleven_multilingual_v2` | 多语言模型 |
| 语音 | Neil Chuang (`auoHciLZJwKTwYUoRTYz`) | 中文男声 |
| 语言 | `zh` | 中文 |
| 输出格式 | MP3 44.1kHz 128kbps | 音频格式 |
| Stability | 1 | 稳定性 |
| Similarity boost | 0.3 | 语音相似度 |
| Style | 0.8 | 表达风格 |
| Speaker boost | True | 语音增强 |
| Speed | 1.2 | 语速倍率 |

所有参数可通过 CLI 标志覆盖，详见 `python3 tools/tts.py --help`。

## 脚本解析

工具按 `## ` 标题分段解析 `script.md`，支持以下格式：

- **中文序号**: `## 一、开场（约 1 分钟）`
- **括号格式**: `## 【开场】（约 1.5 分钟）` 或 `## 【第一部分：问题背景】`

`##` 标题之间的内容（含 `###` 子标题和 `---` 分隔符）归入同一分段。

Markdown 格式（加粗、斜体、行内代码、引用）会被清除，生成纯口播文本。

## 请求拼接

每段 TTS 请求包含 `previous_text` 和 `next_text` 参数，引用相邻分段内容，帮助模型在分段边界处保持一致的语气和节奏。

## 视频流程交接

生成视频时，音频是时间线的主时钟：

1. 确认 `script.md` 每个 `##` 分段都有对应 MP3。
2. 按脚本顺序合并音频，生成 `video/{project}/assets/audio/full-sections.mp3`。
3. 在 HyperFrames 时间线中以合并音频总时长作为 `data-duration`。
4. 渲染 MP4 后，建议用该完整音频重新封装最终视频，避免中途无声或音轨时长异常。

完整流程见 `workflows/video-generation.md`。

## 输出结构

```
weekly/{episode}/
  audio/
    01-开场-v1.mp3
    01-开场-v2.mp3
    02-什么是OpenAgents-v1.mp3
    ...
    metadata.json
```

`audio/*.mp3`、`audio/*.srt` 和 `audio/metadata.json` 默认由 `.gitignore` 忽略。需要复现视频时，应保留脚本和时间线配置；音频可按需重新生成。

### metadata.json 格式

```json
{
  "episode": "03-open-agents",
  "sections": [
    {
      "id": "01",
      "title": "开场",
      "base_filename": "01-开场",
      "versions": ["v1", "v2"],
      "active_version": "v2",
      "active_file": "01-开场-v2.mp3",
      "characters": 203,
      "estimated_duration": 60
    }
  ]
}
```

`active_file` 始终指向最新版本，`--merge` 使用此字段选择文件。

## 成本追踪

`metadata.json` 包含总字符数。每次转换单独计费，同一分段生成 3 个版本则消耗 3 倍字符数。

## 故障排除

| 问题 | 原因 | 解决方法 |
|------|------|---------|
| 401 错误 | API 密钥无效或缺失 | 检查 `ELEVENLABS_API_KEY` |
| 422 错误 | voice_id 或 model_id 无效 | 用 `--list-voices` 验证 |
| 429 错误 | 速率限制超出 | 等待后重试，或用 `--sections` 逐段转换 |
| ffmpeg 未找到 | 未安装 ffmpeg | 安装 ffmpeg 或直接使用分段音频文件 |
| SOCKS 代理错误 | 代理环境变量干扰 | 取消代理: `unset ALL_PROXY HTTPS_PROXY HTTP_PROXY` |

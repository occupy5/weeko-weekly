# 视频生成工作流程

本文档描述从 `slides.md`、`script.md` 和分段音频生成完整视频的流程。当前方案使用 Slidev 导出静态画面状态，再用 [HyperFrames](https://github.com/heygen-com/hyperframes) 编排成 MP4。

## 概要

**目的**: 将一期周报从 Markdown 内容闭环生成可发布视频。

**输入**:
- `weekly/{episode}/slides.md`
- `weekly/{episode}/script.md`
- `weekly/{episode}/audio/*.mp3`

**输出**:
- `weekly/{episode}/video/{project}/renders/*.mp4`

**原则**:
1. **音频主导**: 以 `script.md` 的分段和音频时长决定画面时间线。
2. **点击状态完整**: Slidev 的 `<v-click>` / `<v-clicks>` 必须导出每个 click state，不能只导出最终页面。
3. **无字幕默认**: 当前视频流程默认不渲染底部字幕。字幕应作为后续独立层处理。
4. **可复现渲染**: 完整长视频优先使用单 worker 和软件浏览器渲染，减少长时间线分段捕获差异。
5. **点击锚点精确**: 有 SRT 时必须优先用字幕时间点或口播关键词作为 slide/click 状态切换锚点，不能只按脚本分段平均分配。
6. **画面连续覆盖**: 全屏 PNG clip 之间不要留时间空隙；相邻状态用短重叠并递增 track 覆盖，避免播放时闪出背景。
7. **生成物不入库**: slide-state PNG、临时音频、snapshot、render 输出由 `.gitignore` 忽略。

## 目录约定

每期视频相关文件建议放在：

```text
weekly/{episode}/video/
  hyperframes/
    hyperframes.json
    package.json
    index.html
    timeline.full.json
    assets/
      audio/      # 生成的合并音频，忽略
      slides/     # 导出的 slide-state PNG，忽略
    snapshots/    # HyperFrames 抽帧，忽略
    renders/      # MP4 输出，忽略
```

`index.html`、`timeline.*.json`、`hyperframes.json` 和局部 `package.json` 是流程配置，建议保留。`assets/`、`snapshots/` 和 `renders/` 是生成物，默认忽略。

## Step 1: 准备音频

先按 `workflows/tts-workflow.md` 生成所有分段音频。完整视频需要每个脚本分段都有可用 MP3。

检查音频时长：

```bash
for f in weekly/{episode}/audio/*.mp3; do
  ffprobe -v error -show_entries format=duration \
    -of default=noprint_wrappers=1:nokey=1 "$f"
done
```

按脚本顺序合并为完整旁白：

```bash
ffmpeg -y \
  -i weekly/{episode}/audio/01-xxx-v1.mp3 \
  -i weekly/{episode}/audio/02-xxx-v1.mp3 \
  -filter_complex '[0:a][1:a]concat=n=2:v=0:a=1[a]' \
  -map '[a]' -c:a libmp3lame -b:a 128k \
  weekly/{episode}/video/hyperframes/assets/audio/full-sections.mp3
```

实际期数通常有更多分段，`concat=n=` 和输入数量必须一致。

## Step 2: 导出 Slidev 画面状态

使用根项目脚本导出每一页和每个点击状态：

```bash
bun run export:states -- \
  --range 1-22 \
  --out weekly/{episode}/video/hyperframes/assets/slides \
  --clean
```

参数说明：

| 参数 | 说明 |
|------|------|
| `--range` | 导出页码范围，如 `1-8` 或 `1-22` |
| `--out` | 输出目录 |
| `--clean` | 导出前清空旧文件，避免遗留状态混入 |
| `--width` / `--height` | 默认 `1920x1080` |
| `--wait` | 页面加载后额外等待毫秒数，默认 `300` |

导出文件命名为：

```text
001-00.png  # 第 1 页，click 0
003-01.png  # 第 3 页，第 1 次点击后的状态
```

`manifest.json` 会记录每个 state 的 slide、click、URL 和导出时间。

## Step 3: 生成 HyperFrames 时间线

`index.html` 负责把导出的 PNG 和旁白音频放到时间线上。每个 `<img>` 是一个 timed clip：

```html
<img
  id="slide-012-00"
  class="clip slide-frame"
  data-start="346.16"
  data-duration="2.4"
  data-track-index="1"
  src="./assets/slides/012-00.png"
  alt=""
/>
```

音频 clip：

```html
<audio
  id="narration"
  class="clip"
  data-start="0"
  data-duration="640.13"
  data-track-index="20"
  data-volume="1"
  src="./assets/audio/full-sections.mp3"
></audio>
```

时间线分配规则：

1. 每个脚本分段对应一组幻灯片。
2. 章节分隔页通常停留 `2-3s`。
3. 正文页按口播文本顺序分配给 click states。
4. 多项列表的 click states 应逐项出现，避免所有内容提前显示。
5. 有 SRT 时，按字幕起始时间建立状态锚点，例如 `003-01` 对应“它是一个完全在浏览器中运行...”的起始秒数。没有 SRT 时，至少按 `script.md` 中的句子和音频试听结果手工标出锚点。
6. 不要用“每段平均切分”的方式处理包含多个 `<v-click>` 的页面。平均切分会让画面内容和口播提前或滞后，尤其是列表、流程图、对比卡片。
7. 如果一页的 DOM click 顺序和口播顺序不一致，先修 `slides.md`，不要在视频时间线上硬凑。可使用显式 click 序号：

```md
<v-click at="1">
  <div>第一步内容</div>
</v-click>

<v-click at="2">
  <div>第二步内容</div>
</v-click>
```

8. 全屏 slide-state PNG 之间必须连续覆盖。不要把前一个 clip 缩短 `0.01s` 来规避重叠，这会在播放器里露出背景，表现为“闪一下”。推荐做法是让下一个 clip 比上一个 clip 结束前提前 `0.08-0.15s` 出现，并使用递增的 `data-track-index` 让新画面覆盖旧画面：

```html
<img
  id="slide-007-05"
  class="clip slide-frame"
  data-start="263.662"
  data-duration="16.5"
  data-track-index="23"
  src="./assets/slides/007-05.png"
  alt=""
/>
<img
  id="slide-007-06"
  class="clip slide-frame"
  data-start="280.042"
  data-duration="10.501"
  data-track-index="24"
  src="./assets/slides/007-06.png"
  alt=""
/>
```

上例中 `007-05` 的结束时间是 `280.162`，比 `007-06` 的开始时间晚 `0.12s`。因为 `007-06` 在更高 track 上，所以切换时直接覆盖，不会出现空帧。

建议同步维护 `timeline.full.json`，记录每段脚本对应的 slide states，方便后续微调。

推荐额外维护一个生成脚本，例如 `video/hyperframes/build-timeline.mjs`，把每个 state 的锚点、重叠时长和 track 规则固化下来。这样之后只需要更新锚点数组，再重新生成 `timeline.full.json` 和 `index.html`。

## Step 4: 抽帧验证

正式渲染前先抽关键帧：

```bash
npx hyperframes snapshot weekly/{episode}/video/hyperframes \
  --at 5,62,155,221,347,420,500,600,635 \
  --describe false
```

重点检查：

- 画面是否满屏，没有黑边或裁切。
- `<v-click>` 内容是否按口播节奏出现。
- 每个 click 切换点前后 `0.2s` 都没有空白、黑帧或背景闪烁。
- 底部是否没有误放字幕层。
- 章节切换是否没有空帧。

对 click 密集页，抽帧时间应覆盖每个 state 的锚点，而不是只抽每个章节的开头。可以直接从 `timeline.full.json` 取 `clips[].start`，抽关键点：

```bash
npx --yes hyperframes@0.6.38 snapshot weekly/{episode}/video/hyperframes \
  --at 43.6,69,111,158,209,236.5,240.6,263.8,280.2,292.9,307.5 \
  --describe false
```

## Step 5: 渲染完整视频

完整长视频推荐使用确定性渲染命令：

```bash
npx --yes hyperframes@0.6.38 render . \
  -o renders/weeko-{episode}-full.mp4 \
  --fps 30 \
  --quality draft \
  --workers 1 \
  --no-browser-gpu
```

原因：

- 多 worker 长视频渲染可能出现分段捕获高度漂移，导致底部露出 composition 背景。
- `--workers 1` 速度较慢，但时间线更稳定。
- `--no-browser-gpu` 避免不同机器 GPU/Chrome 行为差异。

局部 HyperFrames 项目可以在 `package.json` 中封装：

```json
{
  "scripts": {
    "render:full": "npx --yes hyperframes@0.6.38 render . -o renders/weeko-07-full.mp4 --fps 30 --quality draft --workers 1 --no-browser-gpu"
  }
}
```

## Step 6: 音频重封装

渲染后建议用原始完整旁白重新封装音轨，避免音频中途丢失或时长异常：

```bash
ffmpeg -y \
  -i renders/weeko-{episode}-full.mp4 \
  -i assets/audio/full-sections.mp3 \
  -map 0:v:0 -map 1:a:0 \
  -c:v copy \
  -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -shortest -movflags +faststart \
  renders/weeko-{episode}-full.fixed.mp4
```

确认无误后再覆盖最终文件。

## Step 7: 最终验证

检查视频和音频时长：

```bash
ffprobe -v error \
  -show_entries stream=index,codec_type,codec_name,width,height,r_frame_rate,duration \
  -show_entries format=duration,size \
  -of json renders/weeko-{episode}-full.mp4
```

检查末尾仍有声音：

```bash
ffmpeg -hide_banner \
  -ss 610 -t 25 \
  -i renders/weeko-{episode}-full.mp4 \
  -af volumedetect \
  -f null -
```

抽末尾画面：

```bash
ffmpeg -y \
  -ss 635 \
  -i renders/weeko-{episode}-full.mp4 \
  -frames:v 1 \
  renders/check-frames/t635-full-closing.png
```

检查是否存在黑帧或明显空帧：

```bash
ffmpeg -hide_banner \
  -i renders/weeko-{episode}-full.fixed.mp4 \
  -vf blackdetect=d=0.02:pic_th=0.98 \
  -an -f null -
```

## 常见问题

### 底部出现黑色区域

原因通常不是 Slidev PNG，而是 HyperFrames 最终长视频 render 时某个 worker 捕获画布高度漂移，露出根背景。

修复：

1. `html`、`body`、`#root` 的背景色使用幻灯片底色，而不是黑色。
2. `.slide-frame` 强制满铺：

```css
.slide-frame {
  position: absolute;
  inset: 0;
  width: 1920px;
  height: 1080px;
  max-width: none;
  max-height: none;
  display: block;
  object-fit: cover;
}
```

3. 完整渲染使用 `--workers 1 --no-browser-gpu`。

### 20 秒后没有声音

用原始合并音频重新封装最终 MP4，不直接依赖 HyperFrames 生成的音轨。

### click 动画没有跟上音频

必须导出每个 Slidev click state，并在 HyperFrames 时间线里按口播内容分配。不要只截图最终页，也不要只按 slide 页码切画面。

修复步骤：

1. 检查 `assets/slides/manifest.json`，确认每页导出了 `000-00` 到 `000-N` 的所有 click state。
2. 对照 SRT 或口播脚本，给每个 state 标出起始时间。优先使用 SRT 的起始秒数。
3. 如果 state 顺序和口播顺序不一致，回到 `slides.md` 修 DOM 顺序或使用 `<v-click at="N">` 显式指定顺序。
4. 重新导出 slide states，再重新生成 `timeline.full.json` 和 `index.html`。
5. 抽每个 click 锚点附近的帧，确认画面和口播一致。

典型问题是流程页里“补充说明卡片”在 DOM 中位于流程步骤之前，导致 click 1 先显示说明卡，而口播先讲步骤。此时应把步骤设为 `at="1"...at="5"`，说明卡设为更后的 click，例如 `at="6"`。

### 播放时画面闪一下

常见原因是相邻全屏 PNG clip 之间有短时间空隙，播放器在空隙里显示了 `body` / `#root` 背景。过去用“把前一个 clip 缩短 `0.01s`”来避免同 track overlap，会增加这个风险。

修复步骤：

1. 确保所有 `.slide-frame` 都是 `position: absolute; inset: 0; width: 1920px; height: 1080px; object-fit: cover;`。
2. 相邻 PNG clip 使用 `0.08-0.15s` 短重叠。
3. 每个新 clip 使用更高的 `data-track-index`，让新状态覆盖旧状态。
4. 不要在全屏 slide-state clip 之间留下正向 gap。
5. 渲染前用 `hyperframes snapshot` 抽切换点前后，渲染后用 `blackdetect` 检查黑帧。

### 字幕不需要

不要把 SRT 或字幕 div 放入 `index.html`。字幕应作为独立可选层，不应进入默认视频流程。

## 参考

- `workflows/slide-generation.md`
- `workflows/script-generation.md`
- `workflows/tts-workflow.md`
- `workflows/visual-debug.md`
- `tools/export-slide-states.ts`

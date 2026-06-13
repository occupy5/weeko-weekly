# 视觉调试工作流程

使用浏览器调试 Slidev 幻灯片的布局、样式、显示问题，以及视频生成前后的关键帧问题。

## 前置条件

1. Slidev 开发服务器已启动（`bun run dev`，默认 `http://localhost:3030/`）
2. chrome-devtools-mcp、Playwright 或 HyperFrames snapshot 可用

## 基本流程

### 1. 打开页面

```javascript
mcp__chrome-devtools__new_page({ url: "http://localhost:3030/" })

mcp__chrome-devtools__list_pages()
mcp__chrome-devtools__select_page({ pageIdx: 0 })
```

### 2. 确认显示状态

优先使用快照（轻量、包含 DOM 结构和元素 UID），必要时再截图：

```javascript
mcp__chrome-devtools__take_snapshot()
mcp__chrome-devtools__take_screenshot()
mcp__chrome-devtools__take_screenshot({ fullPage: true })
```

### 3. 执行调试脚本

通过 `evaluate_script` 获取元素样式、位置、视口信息：

```javascript
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    const element = document.querySelector('.target');
    if (!element) return { found: false };

    const computed = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return {
      found: true,
      styles: {
        position: computed.position,
        display: computed.display,
        width: computed.width,
        height: computed.height,
      },
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    };
  }`
})
```

### 4. 刷新页面

修改代码后刷新以确认效果：

```javascript
mcp__chrome-devtools__navigate_page({ type: "reload" })
```

## 工具对照

| 工具 | 用途 | 优先级 |
|------|------|--------|
| `take_snapshot` | DOM 结构、元素存在确认 | 高 |
| `take_screenshot` | 视觉外观确认 | 中 |
| `evaluate_script` | 样式、位置、计算属性 | 高 |
| `list_console_messages` | JavaScript 错误确认 | 中 |
| `list_network_requests` | 资源加载确认 | 低 |
| `navigate_page` | 刷新页面 | 高 |

## 调试模式

### 视频关键帧异常

视频流程中优先区分三类问题：

| 现象 | 优先检查 |
|------|----------|
| Slidev 页面本身错位 | 开发服务器或 `bun run export:states` 输出 |
| HyperFrames 预览正常但 MP4 异常 | `npx hyperframes snapshot` 与最终 MP4 抽帧对比 |
| 音频不同步 | `timeline.*.json`、合并音频时长、每个 click state 的 `data-start` |

常用命令：

```bash
npx hyperframes snapshot weekly/{episode}/video/hyperframes \
  --at 347,420,500 \
  --describe false

ffmpeg -y \
  -ss 347 \
  -i weekly/{episode}/video/hyperframes/renders/weeko-{episode}-full.mp4 \
  -frames:v 1 \
  weekly/{episode}/video/hyperframes/renders/check-frames/t347.png
```

如果 snapshot 满屏但 MP4 抽帧底部出现黑条，通常是 HyperFrames 长视频多 worker 捕获高度漂移。修复见 `workflows/video-generation.md` 中的“底部出现黑色区域”。

### v-click 状态遗漏

Slidev 中 `<v-click>` 和 `<v-clicks>` 不会自动变成多张普通幻灯片。视频流程必须导出每个 click state：

```bash
bun run export:states -- \
  --range 1-22 \
  --out weekly/{episode}/video/hyperframes/assets/slides \
  --clean
```

检查 `manifest.json` 中每页的 `clicksTotal`，确认时间线中使用了对应的 `003-01.png`、`020-06.png` 等状态文件。

### 元素不显示

1. `take_snapshot` 确认元素是否存在于 DOM
2. `evaluate_script` 获取 `getBoundingClientRect()` 判断是否在视口外
3. 检查父元素 `overflow: hidden` 设置
4. 检查 `position: absolute` 是否导致位置偏移

常见原因：元素 top 值大于视口高度（在屏幕外）。

### 布局异常

1. `take_screenshot` 视觉确认
2. `evaluate_script` 检查父元素与子元素的宽高关系
3. 确认 Flexbox/Grid 属性是否正确
4. 确认 `height`、`min-height` 设置

常见原因：`min-height: 100vh` 导致内容溢出。

### 样式未生效

1. `take_snapshot` 确认元素类名是否正确
2. `evaluate_script` 检查 `getComputedStyle()` 返回值
3. `list_console_messages` 确认是否有 CSS 加载失败错误
4. 检查 scoped 样式穿透和优先级问题

### 动画确认

1. 拍摄初始状态截图
2. 触发交互（`click` 或 `hover`）
3. 拍摄变化后截图对比

## Slidev 布局注意事项

- 幻灯片尺寸固定（约 960×700px）
- 常使用 `overflow: hidden`
- 避免 `min-height: 100vh`，改用 `height: 100%`
- 优先 Flexbox/Grid 布局，慎用 `position: absolute`

## 高效信息收集模板

一次性获取元素样式、位置、父元素和视口信息：

```javascript
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    const element = document.querySelector('.target');
    if (!element) return {
      found: false,
      available: Array.from(document.querySelectorAll('[class*="target"]'))
        .map(el => el.className)
    };

    const computed = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const parent = element.parentElement;
    const parentComputed = parent ? getComputedStyle(parent) : null;

    return {
      found: true,
      styles: {
        position: computed.position,
        display: computed.display,
        width: computed.width,
        height: computed.height,
        margin: computed.margin,
        padding: computed.padding,
      },
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      parent: parentComputed ? {
        display: parentComputed.display,
        overflow: parentComputed.overflow,
        height: parentComputed.height,
      } : null,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      isVisible: rect.top >= 0 && rect.top < window.innerHeight,
    };
  }`
})
```

## 实例：社交链接图标不显示

1. `take_screenshot()` → 图标不可见
2. `take_snapshot()` → DOM 中链接元素存在
3. `evaluate_script()` 获取位置 → `top: 1125px`，视口仅 `896px`，元素在屏幕外
4. `evaluate_script()` 检查父元素 → `min-height: 100vh` 导致内容溢出
5. 修复：`min-height: 100vh` → `height: 100%`，改用 Flexbox + `margin-top: auto`
6. `navigate_page({ type: "reload" })` → `take_screenshot()` → 图标显示正常

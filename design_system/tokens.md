# 设计令牌

本文档定义模板整体使用的设计令牌（设计基本要素）。

## 颜色调色板

### oklch Color Space

本模板采用 **oklch color space**。oklch 是感知均匀的颜色空间，具有以下优点：

- 人眼视觉均匀的颜色变化
- 渐变自然美观

### 主要颜色

#### Primary Colors（暖褐色调）

```css
--color-primary: oklch(0.55 0.08 55);        /* Warm Brown（#8A6B55） */
--color-primary-light: oklch(0.65 0.06 60); /* Light Brown */
--color-secondary: oklch(0.48 0.08 50);     /* Deep Brown（#785945） */
--color-accent: oklch(0.62 0.10 45);        /* Caramel accent */
```

**使用示例**: 按钮、链接、强调元素、渐变标题

#### Text Colors

```css
--color-text: oklch(0.25 0.03 50);           /* 正文文本 */
--color-text-muted: oklch(0.45 0.04 55);     /* 补充文本 */
```

**使用示例**:
- `--color-text`: 标题、正文
- `--color-text-muted`: 说明文字、元信息

#### Background Colors

```css
--color-bg: oklch(0.95 0.02 70);            /* Warm Cream（#FDF8F5） */
--color-bg-soft: oklch(0.92 0.03 65);       /* Soft Cream */
--color-bg-warm: oklch(0.88 0.04 60);       /* Warm Tone */
```

**使用示例**:
- `--color-bg`: 幻灯片基本背景
- `--color-bg-soft`: 卡片、代码块背景
- `--color-bg-warm`: 强调卡片背景

#### Code Colors

```css
--color-code-bg: oklch(0.35 0.05 50);       /* 内联代码背景 */
--color-code-text: oklch(0.75 0.06 45);     /* 内联代码文本 */
```

#### Interactive States

```css
--color-focus: oklch(0.55 0.08 55);         /* 焦点指示器 */
--color-hover: oklch(0.48 0.08 50);         /* 悬停状态 */
```

#### Diff Block Colors

```css
--diff-remove-bg-start: oklch(0.55 0.15 25 / 0.12);  /* 删除行背景渐变起点 */
--diff-remove-bg-end: oklch(0.55 0.15 25 / 0.04);    /* 删除行背景渐变终点 */
--diff-remove-border: oklch(0.55 0.15 25);           /* 删除行边框 */
--diff-add-bg-start: oklch(0.55 0.12 140 / 0.12);    /* 新增行背景渐变起点 */
--diff-add-bg-end: oklch(0.55 0.12 140 / 0.04);      /* 新增行背景渐变终点 */
--diff-add-border: oklch(0.55 0.12 140);             /* 新增行边框 */
```

#### Shiki Code Block Colors

```css
--shiki-shadow: oklch(0.1 0.02 50 / 0.35);       /* 代码块阴影（浅色模式） */
--shiki-line-number: oklch(0.5 0.04 55);         /* 行号颜色（浅色模式） */
```

#### Failure Case Colors

```css
--failure-bg: oklch(0.97 0.01 70);            /* FailureCaseCard 背景 */
--failure-border: oklch(0.88 0.02 65);        /* FailureCaseCard 边框 */
--failure-content-text: oklch(0.42 0.03 50);  /* FailureCaseCard 内容文本 */
--failure-highlight: oklch(0.55 0.12 25);     /* FailureCaseCard 高亮文本 */
--failure-chat-bg: oklch(0.99 0.01 70);       /* FailureCaseCard 聊天气泡背景 */
--failure-chat-border: oklch(0.70 0.06 25);   /* FailureCaseCard 聊天气泡边框 */
```

#### Structure Display Colors

```css
--structure-bg: oklch(0.97 0.02 70);           /* 结构展示背景 */
--structure-border: oklch(0.88 0.02 70);       /* 结构展示边框 */
--structure-scrollbar-thumb: oklch(0.65 0.05 55); /* 滚动条滑块 */
--structure-file-text: oklch(0.30 0.05 55);    /* 文件名文本 */
```

### 渐变

#### 背景渐变（所有幻灯片通用）

从上方中央横向展开的暖棕色渐变。自动应用于所有幻灯片。

```css
background:
  radial-gradient(ellipse 120% 35% at 50% 0%, oklch(0.65 0.08 55 / 0.20) 0%, oklch(0.65 0.08 55 / 0.08) 35%, transparent 60%),
  linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-soft) 100%);
```

**特征**:
- 起点: 上边中央 (`at 50% 0%`)
- 形状: 横宽纵浅椭圆 (`120% 35%`)
- 中间色平滑过渡 (`35%` 点)
- 温暖 Brown tone (`hue: 55)

#### 渐变标题

```css
.gradient-heading {
  color: var(--color-primary);
}
```

**使用位置**: 渐变标题、强调元素（注意: 实际为主色着色，非渐变背景）

## 字体排印

### Font Family Variables（针对中文优化）

本模板使用 CSS 变量管理字体，针对中英文混排场景优化：

```css
/* 标题字体 - 现代中文字体，字形清晰 */
--font-heading: "PingFang SC", "Hiragino Sans GB",
                 "Noto Sans SC", "Source Han Sans SC",
                 "Microsoft YaHei",
                 system-ui, -apple-system, sans-serif;

/* 正文字体 - 平衡中英文显示 */
--font-body: "PingFang SC", "Hiragino Sans GB",
             "Noto Sans SC", "Source Han Sans SC",
             "Microsoft YaHei",
             "Segoe UI", "Roboto", "Helvetica Neue", Arial,
             sans-serif;

/* 代码字体 */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

/* Emoji 字体 */
--font-emoji: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji";
```

**注意**: 这些变量需要在 `style.css` `:root` 中声明才能生效。请确保使用 `var(--font-heading)` 等引用而非直接写 `font-family`。

**字体选择理由**:
- **PingFang SC**: macOS/iOS 系统中文字体，字形紧凑现代，适合标题
- **Hiragino Sans GB**: macOS 中文备选，字形优雅
- **Noto Sans SC**: Google 开源中文字体，跨平台一致性
- **Source Han Sans SC**: Adobe 思源黑体，与 Noto Sans SC 同源
- **Microsoft YaHei**: Windows 默认中文字体，兼容性好

**字体优化设置**:
```css
font-feature-settings: "liga", "calt", "kern";
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-locale: "zh-CN";
  font-language-override: "ZH";
```

### 字体大小

| 元素 | 大小 (clamp) | 用途 |
|------|-------------|------|
| h1 | `clamp(1.8rem, 4vw, 2.8rem)` | 主标题 |
| h2 | `clamp(1.4rem, 3.2vw, 2rem)` | 副标题 |
| h3 | `clamp(1.2rem, 2.6vw, 1.6rem)` | 小标题 |
| p, li | `clamp(1rem, 1.8vw, 1.15rem)` | 正文 |

**clamp 优点**: 响应式适配，根据屏幕大小自动调整

### 中文字体特点

#### 标题字体
- **字重**: 使用 `700` (Bold)，增强视觉层次
- **行高**: `1.25` - 中文标题比西文需要稍大行高

```css
h1 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.25;
}
```

#### 正文字体
- **字重**: `400` (Regular) 或 `500` (Medium)
- **行高**: `1.8` - 中文阅读需要较大行高防止拥挤
- **字体**: 使用 `--font-body`，平衡中英文

```css
p {
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.8;
}
```

### 字体粗细层级

| 粗细 | 值 | 用途 |
|-----|---|------|
| Bold | 700 | h1, h2 标题 |
| Semi Bold | 600 | h3 标题、步进数字 |
| Medium | 500 | 导航、标签 |
| Regular | 400 | 正文 |

## 间距

### Margin/Padding 尺度

使用 Tailwind CSS 标准尺度：

| 类 | 值 | 用途 |
|---|---|------|
| `mt-4` | 1rem | 小边距 |
| `mt-8` | 2rem | 中边距 |
| `mt-12` | 3rem | 大边距 |
| `mt-16` | 4rem | 较大边距 |
| `mt-20` | 5rem | 特大边距 |

### 标准内边距

幻灯片整体内边距标准化为 **3%（水平）/ 7%（垂直）**。

```css
.slidev-layout {
  padding: 7% 3%; /* 垂直7%, 水平3% */
}
```

### 常用间距模式

```md
<!-- 标题与副标题之间 -->
<div class="mt-8">副标题</div>

<!-- 章节之间 -->
<div class="mt-12">下一个章节</div>

<!-- 封面标题位置调整 -->
<div class="mt-20">标题</div>
```

## 效果

### 阴影

#### 图片阴影
```css
box-shadow: 0 4px 12px -1px oklch(0.3 0.04 50 / 0.2);
```

#### 文字阴影（带动画）
```css
@keyframes text-shadow-pulse {
  0%, 100% {
    text-shadow: 0 0 12px color-mix(in srgb, var(--color-primary) 25%, transparent);
  }
  50% {
    text-shadow: 0 0 24px color-mix(in srgb, var(--color-primary) 40%, transparent);
  }
}
```

### 圆角

| 用途 | 值 |
|------|---|
| 小（代码块） | `4px` |
| 中（卡片） | `8px` |
| 大（图片） | `12px` |
| 表格 | `12px` |
| 幻灯片整体 | `20px` |

## 动画

### 过渡

```css
transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);  /* v-click */
transition: all 0.3s ease;  /* 标准 */
transition: color 0.25s ease;  /* 链接 */
```

### v-click 动画

```css
.slidev-vclick-before {
  opacity: 0;
  transform: translateY(12px);
}

.slidev-vclick-after {
  opacity: 1;
  transform: translateY(0);
}
```

### Text Shine（文字闪光效果）

渐变流动动画效果。

```css
.text-shine {
  animation: text-shine 3s ease-out infinite;
}
```

**使用示例**:
```html
<h1 class="text-shine">闪耀标题</h1>
```

## 新功能

### 表格样式

```css
table {
  border-radius: 12px;
  box-shadow: 0 2px 8px -1px oklch(0.3 0.04 50 / 0.15);
}

thead {
  background: linear-gradient(135deg,
    oklch(0.52 0.08 50) 0%,
    oklch(0.56 0.07 55) 100%
  );
}

tbody tr:hover {
  background: color-mix(in oklch, var(--color-primary) 10%, var(--color-bg));
}
```

### 链接样式

```css
a {
  color: var(--color-primary);
  font-weight: 600;
  transition: color 0.25s ease;
}

a:hover {
  color: var(--color-secondary);
  text-decoration: underline;
}
```

### Highlight Callout

```css
.highlight-box {
  background: linear-gradient(135deg,
    color-mix(in oklch, var(--color-primary) 15%, var(--color-bg)) 0%,
    color-mix(in oklch, var(--color-accent) 10%, var(--color-bg-soft)) 100%
  );
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border-left: 4px solid var(--color-primary);
}
```

### Featured Card

```css
.featured-card {
  background: linear-gradient(135deg,
    var(--color-secondary) 0%,
    var(--featured-card-end) 100%
  );
  color: var(--color-bg);
  border-radius: 16px;
  box-shadow: 0 6px 16px -2px var(--featured-card-shadow);
}
```

## 使用方法

### 使用 CSS 变量

```css
.my-element {
  font-family: var(--font-heading);
  color: var(--color-text);
  background: var(--color-bg);
}
```

### 使用 Tailwind 类

```html
<div class="mt-8">
  内容
</div>
```

## 字体变量最佳实践

### 标题元素

```css
/* 标题建议使用 var(--font-heading) 以保持一致性 */
h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 700;
}
```

### 正文元素

```css
/* 正文建议使用 var(--font-body) 以保持一致性 */
p, li, td {
  font-family: var(--font-body);
  line-height: 1.8;
}
```

### 代码元素

```css
/* 代码使用 var(--font-mono) */
code, pre {
  font-family: var(--font-mono);
}
```

## 动物森友会主题配色

### 激活方式

在入口或当前周报文件顶部添加一次默认 class：

```md
---
defaults:
  class: animal-crossing
---
```

### 核心配色（Island / 青绿色调）

```css
--color-primary: oklch(0.56 0.10 175);        /* 青绿色 #19c8b9（动森标志性绿色） */
--color-primary-light: oklch(0.63 0.08 180);   /* 浅青绿 #3dd4c6 */
--color-secondary: oklch(0.42 0.10 170);       /* 深青绿 #11a89b */
--color-accent: oklch(0.75 0.16 90);           /* 暖黄色 #f7cd67 */
```

### 文字与背景

```css
--color-text: oklch(0.35 0.07 55);            /* 温暖棕色 #794f27 */
--color-text-muted: oklch(0.55 0.04 70);      /* 柔卡其色 #9f927d */
--color-bg: oklch(0.96 0.01 80);              /* 温暖奶油 #f8f8f0 */
--color-bg-soft: oklch(0.93 0.02 75);         /* 稍暗奶油 #f0e8d8 */
--color-bg-warm: oklch(0.90 0.03 70);         /* 淡奶油 #f0ece2 */
```

### NookPhone 配色系统（13色）

用于 `IslandCard` 的 `color` prop 和 NookPhone 配色 utility 类：

```css
--nook-pink: oklch(0.70 0.12 350);            /* #f8a6b2 柔粉 */
--nook-purple: oklch(0.55 0.18 300);          /* #b77def 薰衣草紫 */
--nook-blue: oklch(0.58 0.14 270);            /* #889df0 珠光蓝 */
--nook-yellow: oklch(0.82 0.16 90);           /* #f7cd67 暖黄 */
--nook-orange: oklch(0.65 0.12 55);           /* #e59266 珊瑚橙 */
--nook-teal: oklch(0.65 0.10 175);            /* #82d5bb 薄荷青 */
--nook-green: oklch(0.65 0.12 140);           /* #8ac68a 清新绿 */
--nook-red: oklch(0.60 0.16 25);              /* #fc736d 珊瑚红 */
--nook-lime: oklch(0.68 0.14 120);            /* #d1da49 黄绿 */
--nook-yellow-green: oklch(0.73 0.14 110);    /* #ecdf52 明黄绿 */
--nook-brown: oklch(0.42 0.07 55);            /* #9a835a 棕褐 */
--nook-peach: oklch(0.60 0.12 35);            /* #e18c6f 蜜桃橘 */
```

### 动森字体

动森主题下自动切换为圆角字体：

```css
font-family: Nunito, 'Zen Maru Gothic', -apple-system,
             "PingFang SC", "Hiragino Sans GB", sans-serif;
```

- **Nunito**: 圆角无衬线英文字体，与动森软性风格匹配
- **Zen Maru Gothic**: 圆角日文字体，支持中日韩字符
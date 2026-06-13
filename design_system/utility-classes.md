# 实用类列表

## 布局

### 分栏布局

#### columns_h（水平分栏）

水平方向自动均分的网格布局。

```html
<div class="columns_h">
  <div>分栏1</div>
  <div>分栏2</div>
</div>
```

- 自动生成等宽分栏
- gap: 1.5rem

#### columns_v（垂直分栏）

垂直方向放置的网格布局。

```html
<div class="columns_v">
  <div>行1</div>
  <div>行2</div>
</div>
```

- 垂直方向放置元素
- gap: 1rem

---

## 对齐

### center / right / left

```html
<div class="center">居中内容</div>
<div class="right">右对齐</div>
<div class="left">左对齐</div>
```

- Flexbox 对齐 + text-align

---

## 卡片与按钮

### card

基础卡片样式。

```html
<div class="card">卡片内容</div>
```

- 背景：`var(--color-bg-soft)`，圆角 12px，左侧主色边框，阴影效果

### btn-primary / btn-secondary

按钮样式。

```html
<button class="btn-primary">主要操作</button>
<button class="btn-secondary">次要操作</button>
```

- btn-primary：主色背景，悬停变深 + 上浮
- btn-secondary：暖色背景 + 边框，悬停加深

### highlight-box

高亮提示框，左侧 4px 主色边框 + 渐变背景。

```html
<div class="highlight-box">
  重要提示内容
</div>
```

### featured-card

深色渐变卡片，适合重点展示。

```html
<div class="featured-card">
  重点展示内容
</div>
```

- 渐变深色背景，白色文字，16px 圆角，阴影

---

## 动画

### text-shine

渐变流动的文字动画。

```html
<h1 class="text-shine">闪耀标题</h1>
```

- 暖棕色渐变，3秒周期，ease-out，无限循环

### animated-shadow

文字阴影脉动动画。

```html
<h1 class="animated-shadow">强调标题</h1>
```

- 2秒周期明灭

---

## 设计元素

### gradient-heading

渐变文字效果。

```html
<span class="gradient-heading">标题</span>
```

### curved-underline

曲线下划线装饰。

```html
<span class="curved-underline">强调文字</span>
```

### emoji

表情符号优化显示。

```html
<span class="emoji">🎨</span>
```

### diff-block

代码差异对比块。

```html
<div class="diff-block">
  <pre>删除的代码</pre>
  <pre>新增的代码</pre>
</div>
```

- 第一段：红色渐变背景 + 红色边框
- 第二段：绿色渐变背景 + 绿色边框

### tech-list

技术栈列表。

```html
<div class="tech-list">
  <h3>核心框架</h3>
  <ul>
    <li><strong>Bun</strong> — 包管理器</li>
  </ul>
</div>
```

- h3 使用主色标题样式
- 列表项紧凑排列

---

## 可访问性

### touch-target

最小触摸目标尺寸（44×44px）。

```html
<button class="touch-target">按钮</button>
```

---

## 组合示例

### 闪耀居中标题

```html
<div class="center">
  <h1 class="text-shine">谢谢聆听</h1>
</div>
```

### 渐变 + 动画

```html
<h1 class="gradient-heading animated-shadow">超强调标题</h1>
```

---

## Tailwind 与自定义实用类对比

### 现有 Tailwind 类

Tailwind 实用类继续可用：`flex`、`grid`、`mt-8`、`mb-4`、`text-center`、`text-xl` 等。

### 自定义实用类（本模板独有）

| 类名 | 分类 | 说明 |
|------|------|------|
| `columns_h` / `columns_v` | 布局 | 分栏布局 |
| `center` / `right` / `left` | 对齐 | 快速对齐 |
| `text-shine` | 动画 | 文字闪光 |
| `animated-shadow` | 动画 | 动画阴影 |
| `gradient-heading` | 设计 | 渐变标题 |
| `curved-underline` | 设计 | 曲线下划线 |
| `emoji` | 设计 | 表情符号 |
| `card` | 卡片 | 基础卡片 |
| `btn-primary` / `btn-secondary` | 按钮 | 按钮样式 |
| `highlight-box` | 卡片 | 高亮提示框 |
| `featured-card` | 卡片 | 深色渐变卡片 |
| `diff-block` | 代码 | 代码差异对比 |
| `tech-list` | 列表 | 技术栈列表 |
| `touch-target` | 可访问性 | 最小触摸目标 |

---

## 动物森友会主题实用类

需通过 `defaults.class: animal-crossing` 激活。

### 效果类

| 类名 | 说明 |
|------|------|
| `press-3d` | 3D 按压效果（5px 底部阴影，悬停浮起，点击下沉） |
| `hover-lift` | 悬停浮起效果（translateY -4px） |
| `leaf-cursor` | 叶子光标 |
| `blob-shape` | 有机 blob 形状裁剪 |

### 网格布局类

| 类名 | 说明 |
|------|------|
| `cards-grid` | 自适应卡片网格（auto-fit, minmax 280px） |
| `cards-grid-2` | 2列卡片网格（1.5rem gap） |
| `cards-grid-3` | 3列卡片网格（1.25rem gap） |

640px 以下视口自动切换为单列。

### NookPhone 配色类

每个 `nook-{色名}-bg` 同时设置背景和对应前景色，`nook-{色名}-text` 仅设置文字色。

| 色名 | 背景类 | 文字类 |
|------|--------|--------|
| 粉 | `nook-pink-bg` | `nook-pink-text` |
| 紫 | `nook-purple-bg` | `nook-purple-text` |
| 蓝 | `nook-blue-bg` | `nook-blue-text` |
| 黄 | `nook-yellow-bg` | `nook-yellow-text` |
| 橙 | `nook-orange-bg` | `nook-orange-text` |
| 青 | `nook-teal-bg` | `nook-teal-text` |
| 绿 | `nook-green-bg` | `nook-green-text` |
| 红 | `nook-red-bg` | `nook-red-text` |
| 黄绿 | `nook-lime-bg` | `nook-lime-text` |
| 明黄绿 | `nook-yellow-green-bg` | `nook-yellow-green-text` |
| 棕 | `nook-brown-bg` | `nook-brown-text` |
| 桃橘 | `nook-peach-bg` | `nook-peach-text` |

---

## 参考

- [Tailwind CSS](https://tailwindcss.com/)
- [Slidev 布局](https://sli.dev/builtin/layouts)
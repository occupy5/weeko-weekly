# 幻灯片创建指南

AI 使用此模板生成幻灯片时的快速指南。

## 基本原则

1. **利用默认设置**: Slidev 默认过渡为 `slide-left`，无需重复指定
2. **优先使用组件**: 有可用组件时不写手动 HTML
3. **保持简洁**: 幻灯片代码精简
4. **忠实内容**: 仅使用提供的信息，不添加抽象表达、夸大表达、推测信息
5. **全局默认优先**: 主题 class、transition 等配置放在顶部一次，不在每页重复

## 分隔幻灯片

```vue
---
layout: center
---

<SectionDivider title="章节标题" />
```

---

## 内容幻灯片

```md
---
# 默认布局
---

# 标题

内容...
```

---

## 双栏幻灯片

```vue
<TwoColumnLayout>
  <template #left>
    # 说明
    - 要点1
    - 要点2
  </template>
  <template #right>
    ```ts
    const code = 'example'
    ```
  </template>
</TwoColumnLayout>
```

---

## 卡片网格

```vue
<CardGrid cols="2">
  <IslandCard color="teal">...</IslandCard>
  <IslandCard color="orange">...</IslandCard>
</CardGrid>

<CardGrid cols="3">
  <IslandCard type="title" color="green">...</IslandCard>
  <IslandCard type="title" color="purple">...</IslandCard>
  <IslandCard type="title" color="blue">...</IslandCard>
</CardGrid>
```

需要逐卡片动画时，在每个卡片上包裹 `<v-click>`：

```vue
<CardGrid cols="3">
<v-click>
<IslandCard type="title" color="green">...</IslandCard>
</v-click>
<v-click>
<IslandCard type="title" color="purple">...</IslandCard>
</v-click>
<v-click>
<IslandCard type="title" color="blue">...</IslandCard>
</v-click>
</CardGrid>
```

注意：不要用 `<v-clicks>` 包裹 `<CardGrid>`，因为 `<v-clicks>` 只对直接子元素生效，`<CardGrid>` 作为唯一直接子元素会导致所有卡片一次性出现。

---

## 强调卡片

```vue
<CalloutCard title="核心要点">
  关键信息描述...
</CalloutCard>
```

---

## 多列比较

```vue
<ComparisonTable
  :headers="['维度', '方案A', '方案B']"
  :rows="[
    ['License', 'Closed', 'MIT'],
    ['可部署', false, true],
  ]"
  :highlightCol="2"
/>
```

---

## 技术栈列表

```vue
<TechStackList
  title="核心框架"
  :items="[
    { name: 'Bun 1.2.14', desc: '包管理器和运行时' },
    { name: 'Next.js 16', desc: 'React 框架' },
  ]"
/>
```

---

## 结尾幻灯片

默认主题：

```vue
---
layout: center
class: text-center
---

<DefaultClosingSlide
  repoUrl="https://github.com/org/repo"
  repoName="org/repo"
/>
```

island 主题必须使用专用结尾组件，不要使用 `DefaultClosingSlide`：

```vue
---
layout: center
class: text-center
---

<IslandClosingSlide
  subtitle="关注 Weeko 周报，每周精选有价值的技术项目"
/>
```

---

## 封面幻灯片

默认主题：

```vue
<DefaultCoverSlide
  title="演示标题"
  subtitle="副标题"
  event="活动名称"
  author="作者姓名"
  :social="{ github: 'username', twitter: 'username' }"
/>
```

island 主题：

```vue
---
defaults:
  class: animal-crossing
---

<IslandCoverSlide
  title="欢迎来到岛上！"
  subtitle="本周技术分享"
  author="岛主"
/>
```

---

## 组件选择流程

```
创建幻灯片时:

1. 是封面？
   → 默认主题: DefaultCoverSlide
   → island 主题: IslandCoverSlide

2. 是章节分隔？
   → SectionDivider

3. 是卡片网格展示？
   → CardGrid + IslandCard (island) / CardGrid + .card (默认)

4. 是强调要点？
   → CalloutCard (默认) / LeafDivider + IslandCard (island)

5. 是比较对比？
   → ComparisonTable

6. 是技术栈列表？
   → TechStackList

7. 是结尾？
   → 默认主题: DefaultClosingSlide
   → island 主题: IslandClosingSlide

8. 是双栏布局？
   → TwoColumnLayout

9. 其他
   → 默认布局
```

---

## 样式类快速参考

### 设计

| 用途 | 类 | 使用示例 |
|------|------|--------|
| 渐变标题 | `gradient-heading` | `<span class="gradient-heading">标题</span>` |
| 动画阴影 | `animated-shadow` | `<span class="gradient-heading animated-shadow">标题</span>` |
| 文字闪光 | `text-shine` | `<h1 class="text-shine">标题</h1>` |
| 曲线下划线 | `curved-underline` | `<span class="curved-underline">强调</span>` |
| 表情符号 | `emoji` | `<span class="emoji">🎨</span>` |

### 卡片与布局

| 用途 | 类 | 使用示例 |
|------|------|--------|
| 基础卡片 | `card` | `<div class="card">内容</div>` |
| 高亮提示 | `highlight-box` | `<div class="highlight-box">提示</div>` |
| 深色卡片 | `featured-card` | `<div class="featured-card">重点</div>` |
| 水平分栏 | `columns_h` | `<div class="columns_h">...</div>` |
| 垂直分栏 | `columns_v` | `<div class="columns_v">...</div>` |

### 动画

| 用途 | 类 | 使用示例 |
|------|------|--------|
| 代码差异 | `diff-block` | `<div class="diff-block">...</div>` |
| 技术栈 | `tech-list` | `<div class="tech-list">...</div>` |

---

## 动物森友会主题

### 激活方式

在入口文件顶部添加一次：

```md
---
defaults:
  class: animal-crossing
---
```



### 动森样式类

| 用途 | 类 |
|------|------|
| 3D 按压 | `press-3d` |
| 悬停浮起 | `hover-lift` |
| 叶子光标 | `leaf-cursor` |
| 有机 blob | `blob-shape` |
| 2列卡片网格 | `cards-grid-2` |
| 3列卡片网格 | `cards-grid-3` |

### NookPhone 配色类

| 色名 | 背景 | 文字 |
|------|------|------|
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

## 中文字体使用

标题使用 `700` (Bold)，正文使用 `400` (Regular)。中文行高较大（标题 1.25，正文 1.8）。

```css
font-family: var(--font-heading);  /* 标题 */
font-family: var(--font-body);     /* 正文 */
font-family: var(--font-mono);     /* 代码 */
```

---

## 应避免的模式

### 每次写 transition

不需要 — Slidev 默认过渡为 `slide-left`

### 手动写复杂布局

避免手动写 `<div class="grid grid-cols-2 gap-8">`，使用 `<TwoColumnLayout>` 或 `<CardGrid>` 替代。

### 手动写封面

避免手动写 `<div class="mt-20">...` 封面 HTML，使用 `DefaultCoverSlide` / `IslandCoverSlide` 替代。

---

## 参考

- `components.md` — 完整组件目录（Props、示例、主题行为）
- `tokens.md` — 设计令牌（颜色、字体、间距）
- `layouts.md` — 布局模式
- `utility-classes.md` — 完整实用类列表

# 布局模式

Slidev 可用的主要布局模式及其使用场景。

## 标准布局列表

### 1. 默认布局

最基本的布局。不指定 layout 时使用。

```md
---
# 默认布局
---

# 标题

内容
```

**特征**:
- 左对齐，垂直居中
- padding: 7% 3%
- 适用性最高

**使用场景**: 文本说明、列表、普通内容

---

### 2. Center 布局

内容居中放置。

```md
---
layout: center
---

<SectionDivider title="章节标题" />
```

**使用场景**: 章节分隔、简单消息、结尾幻灯片

---

### 3. Two Columns 布局

将内容分为两栏。

```md
---
layout: two-cols
---

# 左侧

::right::

# 右侧
```

**组件版**: `<TwoColumnLayout>` 更灵活（可调比例、间距）

```vue
<TwoColumnLayout :leftRatio="2" :rightRatio="1">
  <template #left>左侧（2/3宽度）</template>
  <template #right>右侧（1/3宽度）</template>
</TwoColumnLayout>
```

---

### 4. Cover 布局

封面幻灯片，使用组件实现：

默认主题: `<DefaultCoverSlide>`
island 主题: `<IslandCoverSlide>`

---

## 组合布局模式

### 卡片网格布局

使用 `<CardGrid>` 组件组织卡片展示：

```vue
<CardGrid cols="2">
  <IslandCard color="green">...</IslandCard>
  <IslandCard color="orange">...</IslandCard>
</CardGrid>
```

```vue
<CardGrid cols="3">
  <IslandCard type="title" color="teal">...</IslandCard>
  <IslandCard type="title" color="orange">...</IslandCard>
  <IslandCard type="title" color="purple">...</IslandCard>
</CardGrid>
```

默认主题下使用 `.card` 样式卡片；island 主题下使用 `IslandCard`。

### 比较表格布局

使用 `<ComparisonTable>` 组件展示多方案对比：

```vue
<ComparisonTable
  :headers="['维度', '方案A', '方案B', '方案C']"
  :rows="[
    ['License', 'Closed', 'MIT', 'Apache-2.0'],
    ['可部署', false, false, true],
  ]"
  :highlightCol="3"
/>
```

---

## 背景渐变

所有幻灯片自动应用共同背景渐变（从上方中央横向展开的暖棕色渐变）。无需添加类。

island 主题下背景渐变切换为青绿色。

---

## 文字居中

```md
---
layout: center
class: text-center
---

# 居中标题
```

---

## 手动布局

不使用组件时，可用 Tailwind CSS 类布局：

```md
<div class="grid grid-cols-2 gap-8">
  <div>左侧</div>
  <div>右侧</div>
</div>
```

---

## 布局选择指南

| 用途 | 推荐方案 |
|------|---------|
| 普通内容 | 默认布局 |
| 章节分隔 | layout: center + SectionDivider |
| 卡片网格 | CardGrid + IslandCard / .card |
| 代码与说明 | TwoColumnLayout |
| 比较对比 | ComparisonTable |
| 封面 | DefaultCoverSlide / IslandCoverSlide |
| 结尾 | layout: center + DefaultClosingSlide |
| 强调要点 | CalloutCard |

---

## 过渡动画

所有布局都可以指定过渡效果，但 Slidev 默认过渡为 `slide-left`，无需重复指定。

主要过渡选项：`slide-left`（默认）、`slide-up`、`fade`、`none`

---

## Tips

1. **组件优先**: 优先使用组件，而非手动写布局 HTML
2. **间距调整**: 用 `mt-8`、`mb-12` 等 Tailwind 类
3. **图片位置**: 使用 Markdown 图片语法或 Flexbox
4. **响应式**: clamp() 字体大小自动调整
5. **一致性**: 同类型幻灯片用相同布局模式

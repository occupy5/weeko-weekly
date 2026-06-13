# 设计系统

统一创建 Slidev 演示的指南、组件与设计令牌。

## 目的

- **一致性**: 所有幻灯片遵循统一设计规范
- **效率**: 抽象重复模式，减少代码量
- **主题扩展**: 结构层组件与主题层组件分离，支持视觉变体

## 架构

本项目采用**双层架构**：

- **结构层** (`components/core/`) — 信息组织与交互逻辑（主题无关）
- **主题层** (`components/themes/`) — 视觉渲染变体（暖棕色 / 动物森友会 / 未来可扩展）
- **封面/社交** (`components/core/`) — DefaultCoverSlide、SocialLinks

结构组件提供 `variant` prop 或继承 CSS 变量切换主题风格。

## 文件构成

```
design_system/
├── README.md           # 本文件（概要）
├── tokens.md           # 设计令牌（颜色、字体、间距）
├── layouts.md          # 布局模式指南
├── components.md       # 组件目录（三层分类）
├── utility-classes.md  # 实用类列表
├── ai-guide.md         # AI 快速指南
└── examples.md         # 使用示例集
```

## 快速开始

### 封面幻灯片

```vue
<DefaultCoverSlide
  title="演示标题"
  subtitle="副标题"
  author="你的姓名"
/>
```

### 章节分隔

```vue
---
layout: center
---

<SectionDivider title="技术栈" />
```

### 卡片网格

```vue
<CardGrid cols="2">
  <IslandCard color="teal">...</IslandCard>
  <IslandCard color="pink">...</IslandCard>
</CardGrid>
```

### 双栏布局

```vue
<TwoColumnLayout>
  <template #left>左侧内容</template>
  <template #right>右侧内容</template>
</TwoColumnLayout>
```

## 使用 AI 时

AI 生成幻灯片时，请参考 [ai-guide.md](./ai-guide.md)。

## 贡献

本设计系统持续改进。创建新组件时：
1. 结构组件放入 `components/core/`
2. 主题组件放入 `components/themes/`
3. 同步更新 `components.md` 和 `ai-guide.md`
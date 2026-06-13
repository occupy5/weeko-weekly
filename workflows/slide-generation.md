# AI 幻灯片生成工作流程

本文档是 AI 读取内容 Markdown 文件并自动转换为 Slidev 格式幻灯片时的详细指南。

## 概要

**目的**: 将用户撰写的内容（source.md）转换为结构化的 Slidev 幻灯片

**原则**:
1. **现有组件优先**: 利用 `design_system/ai-guide.md` 的模式
2. **1 张幻灯片 = 1 个信息点**: 信息适当分割
3. **视觉确认**: 生成后用 chrome-devtools-mcp 确认，详见 `workflows/visual-debug.md`
4. **一致性**: 相同类型内容用相同布局
5. **仅用输入信息**: 使用 source.md 中记载的信息，不添加抽象表达、夸大表达、推测信息
6. **全局默认优先**: 主题 class、transition 等重复配置放到顶部一次，不在每页重复写
7. **视频友好**: 使用 `<v-click>` / `<v-clicks>` 时，后续视频流程会导出每个 click state；不要依赖只能实时播放的复杂动画表达关键信息
8. **样式分层**: 不得在 `slides.md` 中生成 `<style>`；页面只写内容结构和组件调用。通用视觉模式进入 `components/` 或 `styles/themes/`，不要把样式绑定到 `weekly/_current/`。

## 工作流程

### Step 1: 读取内容

```
1. 从指定文件路径读取 source.md
2. 提取前置配置（标题、作者等）
3. 分析正文结构
```

### Step 2: 结构分析

#### 提取标题层级

- H1 (`#`) → 章节分隔列表
- H2 (`##`) → 幻灯片候选列表
- H3 (`###`) → 小节列表

#### 分类内容块

将各章节内容分类为以下:
- 文本（段落）
- 列表（有序/无序）
- 代码块
- 图片
- 引用
- 表格

### Step 3: 幻灯片分割

#### 分割规则

| 条件 | 处理 |
|------|------|
| H1标题 | 新章节分隔幻灯片 |
| H2标题 | 新内容幻灯片 |
| H3标题 | 同一幻灯片内（小节） |
| 列表8项以上 | 分割为多张幻灯片 |
| 段落3个以上 | 考虑分割为多张幻灯片 |
| 代码块 | 与说明分离（双栏） |
| 图片 | 与说明分离（另张幻灯片或双栏） |

#### 7±2法则

1 张幻灯片信息量上限:
- 列表项目: 最大7项
- 段落: 2-3段落
- 代码行数: 20行以内

### Step 4: 组件选择

#### 全局默认配置

需要全局启用主题 class 时，在入口或当前周报文件顶部使用 `defaults`：

```md
---
defaults:
  class: animal-crossing
---
```

后续页面只写真正不同的配置，例如 `layout: center`。不在每张幻灯片重复写 `class: animal-crossing`。

#### 样式归属

- `slides.md` 不写 `<style>`，也不承载可复用视觉系统。
- 可交互或包含明确结构的模式抽成 `components/core/` 或 `components/themes/` 组件。
- 纯 CSS 的主题样式写入 `styles/themes/`，例如 `styles/themes/animal-island.css`。
- `weekly/_current/` 只放当前内容文件，不放样式系统文件。

#### 封面幻灯片

**条件**:
- 前置配置有标题信息
- 或第一个H1及其后续文本

**使用组件**: `DefaultCoverSlide`

```vue
<DefaultCoverSlide
  title="[从MD提取标题]"
  subtitle="[从MD提取副标题]"
  event="[活动名称]"
  author="[作者姓名]"
  :social="{ github: 'username', twitter: 'username' }"
/>
```

#### 结尾幻灯片

**默认主题**: 使用 `DefaultClosingSlide`。

**island / animal-crossing 主题**: 必须使用 `IslandClosingSlide`，不要使用 `DefaultClosingSlide`。

```vue
---
layout: center
class: text-center
---

<IslandClosingSlide
  subtitle="[结尾副标题]"
/>
```

#### 章节分隔幻灯片

**条件**: H1标题

**模板**:
```md
---
layout: center
---

# <span class="gradient-heading">[H1内容]</span>

[H1后续文本（如有）]
```

**背景**: 所有幻灯片自动应用共同背景渐变（暖棕色），无需添加类

#### 普通内容幻灯片

**条件**: H2标题 + 文本/列表

**模板**:
```md
---
# 默认布局
---

# [H2内容]

[正文]

- [列表项目]
```

#### 双栏幻灯片（代码 + 说明）

**条件**: H2标题 + 说明文本 + 代码块

**模板**:
```vue
<TwoColumnLayout>
  <template #left>

# [H2内容]

[说明文本]

  </template>
  <template #right>

\`\`\`[语言]
[代码]
\`\`\`

  </template>
</TwoColumnLayout>
```

#### 图片居中显示幻灯片

**条件**: 图片 + 说明

**模板**:
```md
---
# 如有标题放这里
---

# [标题]

[说明文本]

![图片说明（如有）]([图片路径])
```

## 详细转换规则

### 1. 前置配置转换

**输入**:
```md
---
title: 演示标题
subtitle: 副标题
author: 作者姓名
event: 活动名称
---
```

**输出**: 转换为 `DefaultCoverSlide` 的 props；如果启用 island 主题，则转换为 `IslandCoverSlide`。

### 2. H1转换

**输入**:
```md
# Introduction
```

**输出**:
```md
---
layout: center
---

# <span class="gradient-heading">Introduction</span>
```

### 3. H2转换（普通）

**输入**:
```md
## Background

近年来，Web开发复杂化...
```

**输出**:
```md
---
---

# Background

近年来，Web开发复杂化...
```

### 4. 列表转换

**输入**:
```md
## 采用的技术

- TypeScript 5.0类型检查
- Vite 4.0构建
- 插件系统功能扩展
```

**输出**（推荐简单写法）:
```md
---
---

# 采用的技术

- ✨ TypeScript 5.0类型检查
- 🚀 Vite 4.0构建
- 🔧 插件系统功能扩展
```

### 5. 代码块转换

**输入**:
```md
## 基本类型定义

TypeScript中，可以给变量和函数指定类型：

\`\`\`ts
const name: string = 'John'
const age: number = 30
\`\`\`

通过类型定义，可在编译时检测错误。
```

**输出**:
```vue
<TwoColumnLayout>
  <template #left>

# 基本类型定义

TypeScript中，可以给变量和函数指定类型：

通过类型定义，可在编译时检测错误。

  </template>
  <template #right>

\`\`\`ts
const name: string = 'John'
const age: number = 30
\`\`\`

  </template>
</TwoColumnLayout>
```

### 6. 图片转换

**输入**:
```md
## 系统架构图

![系统架构图](./images/architecture.png)
```

**输出**:
```md
---
---

# 系统架构图

![系统架构图](./images/architecture.png)
```

### 7. v-click 与视频导出

`<v-click>` 和 `<v-clicks>` 可以用于控制信息逐步出现，但它们会影响视频时间线：

```md
<v-clicks>

- 第一个要点
- 第二个要点
- 第三个要点

</v-clicks>
```

生成视频时必须用 `bun run export:states` 导出每个点击状态，并在 HyperFrames 时间线中按口播节奏排列。详见 `workflows/video-generation.md`。

## 生成时检查清单

### 必须检查

- [ ] 是否生成封面幻灯片？
- [ ] 各章节（H1）是否为章节分隔幻灯片？
- [ ] 1 张幻灯片信息量是否适当？（7±2法则）
- [ ] 代码块是否为双栏布局？
- [ ] 是否使用现有组件（DefaultCoverSlide、TwoColumnLayout、SectionDivider 等）？
- [ ] 是否未重复写默认设置（transition 等）？
- [ ] 是否准确抄录 source.md 信息？
- [ ] 是否未添加抽象表达、夸大表达、推测信息？
- [ ] 如果使用了 `<v-click>` / `<v-clicks>`，是否能被视频流程拆成清晰的 click states？

### 推荐检查

- [ ] 列表项目是否添加表情符号？
- [ ] 长文本是否适当分割？
- [ ] 图片是否有图片说明？
- [ ] 章节分隔是否使用 `gradient-heading`？

## 样式应用规则

### 标题样式

- 章节分隔（H1）: `gradient-heading`
- 普通幻灯片标题（H2）: 默认样式

### 列表样式

- 3项以下: 直接
- 4-7项: 使用 Emoji 文本前缀（如 ✨ / 🚀 / 🔧）
- 8项以上: 分割为多张幻灯片

### 代码块

- 20行以下: 双栏布局
- 20行以上: 考虑分割为多张幻灯片

## 注意事项

### 不应做的事

1. **多用手动HTML**: 确认能否使用现有组件
2. **信息塞满**: 1张幻灯片不放太多信息
3. **重复写默认设置**: `transition` 等不写
4. **未使用组件**: 手动写封面等
5. **捏造、添加信息**:
   - 添加抽象表达（现代、创新、美丽）
   - 添加夸大表达（简单、戏剧性、压倒性）
   - 添加不存在的数值或实测值
   - 推测添加 source.md 未记载的信息
   - 随意改写用户表达

### 必须做的事

1. **利用组件**: 参考 `design_system/ai-guide.md`
2. **适当分割信息**: 遵守7±2法则
3. **保持一致性**: 相同类型用相同布局
4. **视觉确认**: 生成后用 chrome-devtools-mcp 确认
5. **忠实使用输入信息**:
   - 直接使用 source.md 文本
   - 准确抄录提供信息
   - 尊重用户表达

## 参考

- `design_system/ai-guide.md`: 幻灯片模板和组件
- `design_system/components.md`: 组件详情
- `workflows/visual-debug.md`: 视觉调试方法
- `workflows/video-generation.md`: 视频生成与 click-state 导出方法

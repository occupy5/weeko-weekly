# 组件目录

本项目采用**双层架构**组织组件：

- **结构层** (`components/core/`) — 主题无关的信息组织组件
- **主题层** (`components/themes/`) — 视觉变体组件

## 目录结构

```
components/
├── core/                # 结构层组件（主题无关）
│   ├── SectionDivider.vue
│   ├── CardGrid.vue
│   ├── CalloutCard.vue
│   ├── ComparisonTable.vue
│   ├── TechStackList.vue
│   ├── DefaultClosingSlide.vue
│   ├── ProjectStructurePanel.vue
│   ├── TwoColumnLayout.vue
│   ├── DefaultCoverSlide.vue
│   └── SocialLinks.vue
└── themes/              # 主题层组件
    ├── showcase/
    │   ├── StepFeatureShowcase.vue
    │   ├── PlatformBadgeIcon.vue
    │   └── FailureCaseCard.vue
    └── island/
    │   ├── IslandCoverSlide.vue
    │   ├── IslandCard.vue
    │   ├── IslandButton.vue
    │   ├── LeafDivider.vue
    │   ├── IslandPhoneClock.vue
    │   ├── IslandModal.vue
    │   └── IslandClosingSlide.vue
```

## 结构层组件 (components/core/)

### 1. SectionDivider

章节分隔幻灯片。替代重复的 `layout: center` + `<span class="gradient-heading">` 模式。

#### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| title | String | '' (必需) | 章节标题 |
| subtitle | String | '' | 副标题说明 |

#### 使用示例

```vue
---
layout: center
---

<SectionDivider title="技术栈" />
<SectionDivider title="架构设计" subtitle="三种部署拓扑" />
```

#### 主题行为

- 默认主题：渐变标题样式
- island 主题：自动切换叶形装饰 + 有机标题风格（CSS 变量继承生效）

---

### 2. CardGrid

卡片网格布局组件。替代手动 `<div class="cards-grid-{2|3}">` 模式。

#### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| cols | Number | 2 | 列数（2 或 3） |
| gap | String | '' | 自定义间距（空则使用默认） |

#### 使用示例

不带动画（一次性展示）：

```vue
<CardGrid cols="2">
  <IslandCard color="green">...</IslandCard>
  <IslandCard color="orange">...</IslandCard>
</CardGrid>
```

带动画（逐卡片展示）——在每个卡片上包裹 `<v-click>`：

```vue
<CardGrid cols="3">
<v-click>
  <IslandCard type="title" color="teal">...</IslandCard>
</v-click>
<v-click>
  <IslandCard type="title" color="orange">...</IslandCard>
</v-click>
<v-click>
  <IslandCard type="title" color="purple">...</IslandCard>
</v-click>
</CardGrid>
```

注意：不要用 `<v-clicks>` 包裹 `<CardGrid>`，因为 `<v-clicks>` 只对直接子元素生效，会导致所有卡片一次性出现。

#### 主题行为

- 默认主题：CSS Grid + `.card` 样式
- island 主题：自动使用 `cards-grid-{2|3}` + IslandCard 样式（CSS 继承生效）

---

### 3. CalloutCard

强调要点卡片。替代重复的 `LeafDivider + IslandCard` 或 `highlight-box` 模式。

#### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| title | String | '' | 卡片标题 |
| color | String | 'default' | 配色标识（仅 island 主题生效） |

#### 使用示例

```vue
<v-click>
<CalloutCard title="核心驱动">
  检测并使用你机器上已安装的 Code Agent CLI...
</CalloutCard>
</v-click>
```

#### 主题行为

- 默认主题：`highlight-box` 样式（渐变背景 + 左侧边框）
- island 主题：LeafDivider + IslandCard 组合（需要在 island 主题下手动使用 LeafDivider + IslandCard，或扩展此组件）

---

### 4. ComparisonTable

多列比较表格。支持布尔值自动渲染为 ✅/❌，可高亮指定列。

#### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| headers | String[] | (必需) | 表头列名 |
| rows | (String|Boolean)[][] | (必需) | 表格行数据 |
| highlightCol | Number | -1 | 高亮列索引（0起始，-1不高亮） |

#### 使用示例

```vue
<ComparisonTable
  :headers="['维度', 'Claude Design', 'Open Design']"
  :rows="[
    ['License', 'Closed', 'Apache-2.0'],
    ['Vercel 可部署', false, true],
    ['Skills', 'Proprietary', '31 SKILL.md'],
  ]"
  :highlightCol="2"
/>
```

Boolean 值 `true` 渲染为 ✅，`false` 渲染为 ❌。

---

### 5. TechStackList

技术栈列表组件。替代未定义的 `tech-list` CSS 类。

#### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| title | String | '' | 分类标题 |
| items | Object[] | [] | 技术项列表 [{ name, desc }] |

#### 使用示例

**数据模式**：

```vue
<TechStackList
  title="核心框架"
  :items="[
    { name: 'Bun 1.2.14', desc: '包管理器和运行时' },
    { name: 'Next.js 16', desc: 'React 框架' },
  ]"
/>
```

**插槽模式**：

```vue
<TechStackList title="核心框架">
  <ul>
    <li><strong>Bun 1.2.14</strong> — 包管理器和运行时</li>
    <li><strong>Next.js 16</strong> — React 框架</li>
  </ul>
</TechStackList>
```

---

### 6. DefaultClosingSlide

默认主题结尾幻灯片组件。island / animal-crossing 主题不要使用此组件，应直接使用 `IslandClosingSlide`。

#### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| repoUrl | String | '' | 项目仓库链接 |
| repoName | String | '' | 仓库名称（显示文字） |
| subtitle | String | '每周精选有价值的技术项目' | 副标题 |

#### 使用示例

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

#### 主题行为

- 默认主题：渐变标题样式
- island 主题：禁止使用，改用 `IslandClosingSlide`

---

### 7. TwoColumnLayout

双栏布局组件。灵活控制左右比例和间距。

#### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| gap | String | '3rem' | 分栏间距 |
| leftRatio | Number | 1 | 左侧宽度比例 |
| rightRatio | Number | 1 | 右侧宽度比例 |

#### 使用示例

```vue
<TwoColumnLayout>
  <template #left>左侧内容</template>
  <template #right>右侧内容</template>
</TwoColumnLayout>
```

---

## 封面与社交组件 (components/core/)

### DefaultCoverSlide

封面幻灯片组件。island 主题下请使用 `IslandCoverSlide`。

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| title | String | '' (必需) | 标题 |
| subtitle | String | 无（undefined，由 v-if 控制显示） | 副标题 |
| event | String | 无（undefined，由 v-if 控制显示） | 活动名称 |
| author | String | 无（undefined，由 v-if 控制显示） | 作者姓名 |
| social | Object | 无（undefined，v-if 判断） | 社交信息 { github, twitter, linkedin } |
| gradient | Boolean | true | 使用渐变标题 |

### SocialLinks

封面与主题封面中使用的社交链接组件。

---

## 主题层组件 (components/themes/)

### StepFeatureShowcase

功能特性展示组件，采用编辑/杂志风格设计。

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| icon | String | (必需) | 图标名称 |
| title | String | (必需) | 功能标题 |
| step | Number | (必需) | 当前步骤编号 |
| total | Number | undefined | 总步骤数（决定是否显示进度条） |
| variant | String | 'default' | 变体样式: default / compact / highlight |

插槽内支持以下结构类：`feature-grid`、`feature-main`、`feature-side`、`feature-highlight`、`feature-tag`、`tag-dot`、`platform-badge`、`flow-step`、`flow-arrow`。

### PlatformBadgeIcon

平台徽章图标组件。

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| icon | String | (必需) | 图标名称 |

### FailureCaseCard

失败案例展示组件。聊天式 UI 展示模型误操作。

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| icon | String | (必需) | 图标（表情符号） |
| title | String | (必需) | 案例标题 |
| highlight | String | undefined | 高亮文本 |

插槽内类：`.chat-bubble`、`.error-mark`、`.highlight`。

### ProjectStructurePanel

项目目录结构滚动展示。

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| maxHeight | String | '80vh' | 最大高度 |

推荐用于目录树或模块结构展示。插槽内可以放 `txt` 代码块；组件会移除代码高亮 token 颜色，让结构文本继承设计系统的结构展示配色，避免在浅色面板中发白。

---

## 动物森友会主题组件 (components/themes/island/)

需通过 `defaults.class: animal-crossing` 激活。通常在入口文件顶部声明一次。

### IslandCoverSlide

动森风格封面组件。

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| title | String | '' (必需) | 标题 |
| subtitle | String | 无（由 v-if 控制是否显示） | 副标题 |
| author | String | 无（由 v-if 控制是否显示） | 作者姓名 |
| event | String | 无（由 v-if 控制是否显示） | 活动名称 |
| social | Object | 无（undefined，v-if 判断是否显示社交链接） | 社交信息 |

### IslandCard

有机形状卡片组件，支持 13 种 NookPhone 配色。

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| type | String | 'default' | 卡片类型: default / title |
| color | String | 'default' | 配色: default/pink/purple/blue/yellow/orange/teal/green/red/lime/yellow-green/brown/peach |
| padding | String | undefined | 内边距（默认不覆盖，使用 CSS 默认 padding） |

### IslandButton

3D 按压按钮组件。

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| type | String | 'default' | 按钮类型: primary/default/dashed/text/link |
| size | String | 'middle' | 大小: small/middle/large |
| danger | Boolean | false | 危险样式 |
| ghost | Boolean | false | 幽灵样式 |
| block | Boolean | false | 块级宽度 |
| loading | Boolean | false | 加载状态 |
| disabled | Boolean | false | 禁用状态 |

### LeafDivider

叶子装饰分割线。

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| variant | String | 'leaf' | 样式: leaf / simple / divider |
| color | String | '' | 自定义颜色 |

### IslandPhoneClock

动森风格实时时间显示。

### IslandModal

有机 blob 形对话框组件。

#### Props

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| open | Boolean | false | 是否打开 |
| title | String | '' | 对话框标题 |
| width | Number | 520 | 对话框宽度（px） |
| closable | Boolean | true | 是否显示关闭按钮 |

#### 事件

| 事件 | 说明 |
|------|------|
| close | 关闭对话框时触发 |
| ok | 点击确认按钮时触发 |

### IslandClosingSlide

动森主题专用结尾幻灯片。启用 `defaults.class: animal-crossing` 时必须使用它，不要使用 `DefaultClosingSlide`。

| Prop | Type | Default | 说明 |
|------|------|---------|------|
| repoUrl | String | '' | 项目仓库链接 |
| repoName | String | '' | 仓库名称 |
| subtitle | String | '关注 Weeko 周报，每周精选有价值的技术项目' | 副标题 |

```vue
---
layout: center
class: text-center
---

<IslandClosingSlide
  subtitle="GLM-5.1 × Zread MCP × Creator Workflow"
/>
```

---

## 样式类

不是组件，作为 CSS 类提供的实用功能。

### gradient-heading

```html
# <span class="gradient-heading">标题</span>
```

### animated-shadow

```html
<span class="gradient-heading animated-shadow">标题</span>
```

### emoji

```html
<span class="emoji">🎨</span>
```

---

## 组合示例

### 章节分隔 + 内容

```vue
---
layout: center
---

<SectionDivider title="架构设计" />

---

# 三种部署拓扑

<CardGrid cols="3">
  <IslandCard type="title" color="green">
    <h3>A — 全本地</h3>
    Browser → Next.js → Local Daemon
  </IslandCard>
  ...
</CardGrid>
```

### 强调要点

```vue
<CalloutCard title="最有趣的逆向策略">
  不是复制功能，而是让你的 Agent 接替作品
</CalloutCard>
```

### 多列比较

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

## Tips

1. **省略 Props**: 默认值适当时可省略
2. **插槽**: 多数组件使用插槽
3. **组合**: 结构层 + 主题层组件可自由组合
4. **主题切换**: island 主题下，结构组件自动继承主题 CSS 变量

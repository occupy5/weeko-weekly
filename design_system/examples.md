# 使用示例与前后对比

展示使用结构层组件和设计系统的实际效果。

---

## 章节分隔

### Before（手动）

```md
---
layout: center
---

# <span class="gradient-heading">技术栈</span>
```

每次重复手动写 layout + gradient-heading。

### After（组件）

```vue
---
layout: center
---

<SectionDivider title="技术栈" />
```

**改进**: 语义明确，减少重复代码，主题切换时自动继承。

---

## 卡片网格

### Before（手动）

```html
<div class="cards-grid-2">
<v-clicks>

<IslandCard type="title" color="orange">
  <h3>花叔的画术</h3>
  设计哲学指南针
</IslandCard>

<IslandCard type="title" color="green">
  <h3>歸藏的杂志风 PPT</h3>
  Deck 模式默认 Skill
</IslandCard>

</v-clicks>
</div>
```

每次需手动写 HTML 容器 + v-clicks。

### After（组件）

```vue
<CardGrid cols="2">
  <IslandCard type="title" color="orange">
    <h3>花叔的画术</h3>
    设计哲学指南针
  </IslandCard>
  <IslandCard type="title" color="green">
    <h3>歸藏的杂志风 PPT</h3>
    Deck 模式默认 Skill
  </IslandCard>
</CardGrid>
```

**改进**: CardGrid 自动处理 v-clicks 和网格布局，代码更简洁。

---

## 强调要点

### Before（手动，island 主题）

```html
<LeafDivider variant="divider" />
<v-click>
<IslandCard color="teal">
  <h3>核心要点</h3>
  关键信息描述
</IslandCard>
</v-click>
```

### After（组件）

```vue
<v-click>
<CalloutCard title="核心要点">
  关键信息描述
</CalloutCard>
</v-click>
```

**改进**: 默认主题用 highlight-box，island 主题用 LeafDivider + IslandCard（通过 CSS 变量继承）。

---

## 多列比较

### Before（裸表格）

```md
| 维度 | Claude Design | Open Design |
|---|---|---|
| License | Closed | Apache-2.0 |
| 可部署 | ❌ | ✅ |
```

无对比高亮，布尔值需手动写 emoji。

### After（组件）

```vue
<ComparisonTable
  :headers="['维度', 'Claude Design', 'Open Design']"
  :rows="[
    ['License', 'Closed', 'Apache-2.0'],
    ['可部署', false, true],
  ]"
  :highlightCol="2"
/>
```

**改进**: Boolean 自动渲染 ✅/❌，可指定高亮列，视觉对比更清晰。

---

## 封面幻灯片

### Before（手动）

约 15 行手动 HTML

### After（组件）

```vue
<DefaultCoverSlide
  title="演示标题"
  subtitle="副标题"
  event="活动名称"
  author="作者姓名"
  :social="{ github: 'fs0414', twitter: '_fs0414' }"
/>
```

**73% 代码削减**（15 行 → 6 行）

---

## 结尾幻灯片

### Before（手动）

```md
---
layout: center
class: text-center
---

# <span class="gradient-heading">感谢观看</span>

## 关注 weeko 周报
每周精选有价值的技术项目
[GitHub: org/repo](url)
```

### After（组件）

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

**改进**: 格式统一，主题切换自动适配。

---

## 双栏布局

### Before（Slidev 标准）

```md
---
layout: two-cols
---

# 左侧

::right::

# 右侧
```

定制的可定制性较低。

### After（组件）

```vue
<TwoColumnLayout :leftRatio="2" :rightRatio="1">
  <template #left>左侧（2/3）</template>
  <template #right>右侧（1/3）</template>
</TwoColumnLayout>
```

**改进**: 可灵活调整比例和间距。

---

## 过渡设置

### Before（每张指定）

每张幻灯片重复写 `transition: slide-left`

### After（全局设置）

顶部一次声明，后续不写。

---

## 综合示例：完整幻灯片集

`Before` 约 250 行 | `After` 约 120 行 | **52% 代码削减**

---

## 代码削减率

| 幻灯片类型 | Before | After | 削减率 |
|-----------|--------|-------|-------|
| 封面 | 15行 | 6行 | 60% |
| 章节分隔 | 3行 | 1行 | 67% |
| 卡片网格 | 8行 | 3行 | 63% |
| 结尾 | 6行 | 3行 | 50% |
| **整体平均** | - | - | **约55%** |

---

## 设计系统核心优势

1. **双层架构**: 结构层主题无关，主题层自由切换
2. **语义明确**: SectionDivider、CalloutCard 命名清晰
3. **维护性**: 修改一处即全局生效
4. **一致性**: 统一格式和样式
5. **扩展性**: 新主题只需添加 CSS 变量变体

---

## 下一步

1. 用结构层组件重构现有幻灯片
2. 创建新幻灯片时优先使用结构层组件
3. 根据需要扩展新的结构/主题组件
4. 参考 `design_system/ai-guide.md` 选择最佳模式

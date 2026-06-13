# AGENTS.md — AI 编码代理指南

本项目是面向知识类视频创作者的 Agent 内容生产工具。AI 代理在此工作时应遵循以下规范。

## 项目概览

- **项目**: Weeko — 面向知识类视频创作者的 Agent 内容生产工具
- **核心流程**: 资料研究、内容策划、幻灯片、口播、音频、视频与可选可信发布
- **技术栈**: Slidev、Vue.js 3、TypeScript、Bun、HyperFrames
- **包管理器**: Bun
- **样式**: CSS + oklch 色彩空间 + CSS 变量
- **本项目无测试套件和 lint 配置**

## 构建命令

```bash
bun install          # 安装依赖
bun run dev          # 启动开发服务器（http://localhost:3030）
bun run build        # 构建静态文件到 dist/
bun run export       # 导出为 PDF/PPTX/PNG
bun run export:states # 导出页面和 v-click 状态 PNG
```

### dApp

首次安装并启动 dApp：

```bash
cd dapp
corepack yarn install
corepack yarn start  # http://localhost:3000，默认连接 Base Sepolia
```

依赖安装后可从项目根目录使用：

```bash
bun run dapp         # 启动 Next.js dApp
bun run dapp:chain   # 启动本地 Hardhat 链（仅本地合约开发）
bun run dapp:compile # 编译合约
bun run dapp:build   # 构建 dApp
```

测试网部署与 publication 发布流程见 `dapp/README.md`。涉及真实网络写操作时，必须先核对目标网络、账户、余额、内容 URI 和工作流哈希。

## 项目结构

```
weekly/              # 每周内容（按期组织）
  {year}-W{week}-{topic}/   # 每期: source.md + slides.md + script.md
  _current/          # 当前工作目录
components/          # Vue 组件（双层架构）
  core/              # 结构层+展示组件（主题无关）
    SectionDivider、CardGrid、CalloutCard、ComparisonTable、TechStackList、DefaultClosingSlide、TwoColumnLayout、DefaultCoverSlide、SocialLinks、ProjectStructurePanel
  themes/            # 主题层组件（视觉变体）
    showcase/        # StepFeatureShowcase、PlatformBadgeIcon、FailureCaseCard
    island/          # IslandCoverSlide、IslandClosingSlide、IslandHackathonClosingSlide、IslandCard、IslandButton、LeafDivider、IslandPhoneClock、IslandModal
design_system/       # 设计系统文档
workflows/           # 幻灯片、脚本、音频、视频生成工作流
slides.md            # 主入口，指向当前周的幻灯片
style.css            # 全局样式
```

## 每周工作流程

### 新建一期

1. 创建目录: `weekly/{year}-W{week}-{topic}/`
2. 在 `source.md` 中撰写原始内容
3. 如需新主题组件，在 `components/themes/` 中创建

### 生成幻灯片

AI 读取 `source.md`，遵循 `workflows/slide-generation.md` 生成 `slides.md`。

### 生成口播脚本

幻灯片完成后，遵循 `workflows/script-generation.md` 生成 `script.md`。

### 生成音频

脚本完成后，使用 TTS 工具转换：

```bash
export ELEVENLABS_API_KEY=your-key
python3 tools/tts.py                  # 转换当前期（始终创建新版本）
python3 tools/tts.py --dry-run        # 预览分段信息
python3 tools/tts.py --episode XX     # 指定期号
python3 tools/tts.py --sections 01,08 # 仅转换指定分段
python3 tools/tts.py --merge          # 合并为完整音频（需 ffmpeg）
```

详见 `workflows/tts-workflow.md`。

### 生成视频

音频完成后，遵循 `workflows/video-generation.md` 生成完整 MP4：

1. 用 `bun run export:states` 导出每个 Slidev 页面和 v-click 状态。
2. 用 HyperFrames `index.html` 和 `timeline.*.json` 将 slide-state PNG 与完整旁白音频编排为视频。
3. 长视频渲染使用单 worker 和软件浏览器模式，避免多 worker 捕获高度漂移。
4. 渲染后用 ffmpeg 将完整旁白重新封装进最终 MP4，避免音频中途丢失。

生成物如 `assets/slides/`、`assets/audio/`、`snapshots/`、`renders/` 默认由 `.gitignore` 忽略。

## 代码风格规范

### 组件

- **位置**: `components/` 目录
- **命名**: PascalCase（如 `TwoColumnLayout.vue`、`DefaultCoverSlide.vue`）
- **必须使用** `<script setup lang="ts">`
- **必须** 定义 Props interface 和 TypeScript 类型
- **必须** 使用 `withDefaults` 设置默认值
- **必须** 从 Vue 导入所需 API（computed、ref 等）

```vue
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  gap?: string
  leftRatio?: number
}

const props = withDefaults(defineProps<Props>(), {
  gap: '3rem',
  leftRatio: 1,
})
</script>
```

### 导入

- 组件导入: 在 `<script setup>` 中显式 import
- Vue API: `import { computed, ref, watch } from 'vue'`
- 外部库: 先检查 `package.json` 确认可用依赖

### 样式

- **必须使用** oklch 色彩空间定义颜色
- **必须优先使用** CSS 变量（`var(--color-primary)` 等）
- CSS 类名使用 kebab-case（`.gradient-heading`、`.two-column-layout`）
- 优先 scoped 样式

核心色彩变量：

```css
--color-primary: oklch(0.55 0.08 55)      /* 暖棕色 */
--color-secondary: oklch(0.48 0.08 50)    /* 深棕色 */
--color-accent: oklch(0.62 0.10 45)       /* 焦糖色 */
--color-bg: oklch(0.95 0.02 70)           /* 暖白色 */
--color-text: oklch(0.25 0.03 50)         /* 深色文字 */
```

### 组件清单

**结构层组件** (`components/core/`):

| 组件 | 用途 |
|------|------|
| SectionDivider | 章节分隔幻灯片 |
| CardGrid | 卡片网格布局（2/3列 + v-clicks 动画） |
| CalloutCard | 强调要点卡片 |
| ComparisonTable | 多列比较表格（支持 ✅/❌ 自动渲染） |
| TechStackList | 技术栈列表 |
| DefaultClosingSlide | 结尾幻灯片 |
| TwoColumnLayout | 双栏布局（插槽 #left/#right） |
| ProjectStructurePanel | 可滚动代码结构展示 |

| DefaultCoverSlide | 封面幻灯片 |
| SocialLinks | 社交媒体链接 |

**主题层组件** (`components/themes/`):

| 组件 | 用途 |
|------|------|
| showcase/StepFeatureShowcase | 功能展示（图标 + 步骤） |
| showcase/PlatformBadgeIcon | 平台/功能徽章图标 |
| showcase/FailureCaseCard | 失败案例展示 |
| island/IslandCoverSlide | 动物森友会封面 |
| island/IslandCard | 动物森友会卡片 |
| island/IslandButton | 动物森友会按钮 |
| island/LeafDivider | 叶形分隔线 |
| island/IslandPhoneClock | NookPhone 时间显示 |
| island/IslandModal | 动物森友会弹窗 |
| island/IslandClosingSlide | 动物森友会结尾页 |
| island/IslandHackathonClosingSlide | 比赛/项目介绍结尾页，含总结与开源致谢 |

### 幻灯片创建原则

1. **必须首先查阅** `design_system/ai-guide.md` 中的模式
2. **存在组件时必须使用组件**，不写手动 HTML
3. **不写 transition 配置**（全局已设置 `slide-left`）
4. **不添加原文未记载的内容**，不写抽象描述或臆造细节
5. 全局默认配置（主题 class、transition）写在顶部一次，不在每页重复
6. 使用 `animal-crossing` / island 主题时，结尾页必须使用 `IslandClosingSlide`，不要使用 `DefaultClosingSlide`

## 文档维护规则

### 创建新组件时

1. 更新 `design_system/components.md` — 添加组件详情、Props、示例
2. 更新 `design_system/ai-guide.md` — 添加到组件选择表
3. 更新 `design_system/examples.md` — 添加前后对比示例

### 更新样式时

1. 更新 `design_system/tokens.md` — 如新增颜色/间距
2. 更新 `design_system/utility-classes.md` — 如新增实用类
3. 更新 `design_system/ai-guide.md` — 更新快速参考表

### 新增布局模式时

1. 更新 `design_system/layouts.md`
2. 更新 `design_system/ai-guide.md`

## 任务类型参考文档

| 用户意图 | 应查阅文档 | 优先级 |
|---------|----------|--------|
| 创建幻灯片 | `design_system/ai-guide.md` | 必须 |
| 创建封面 | `design_system/components.md`（DefaultCoverSlide） | 必须 |
| 双栏布局 | `design_system/layouts.md` | 必须 |
| 创建新组件 | `design_system/components.md` | 必须 |
| 修改颜色/间距 | `design_system/tokens.md` | 必须 |
| 使用实用类 | `design_system/utility-classes.md` | 必须 |
| 从 MD 生成幻灯片 | `workflows/slide-generation.md` | 必须 |
| 生成口播脚本 | `workflows/script-generation.md` | 必须 |
| 生成音频 | `workflows/tts-workflow.md` | 必须 |
| 生成视频 | `workflows/video-generation.md` | 必须 |
| 调试显示问题 | `workflows/visual-debug.md` | 必须 |

## 关键参考文件

- `design_system/ai-guide.md` — 幻灯片创建快速指南（首选入口）
- `design_system/components.md` — 完整组件目录
- `design_system/tokens.md` — 设计令牌（颜色、字体、间距）
- `design_system/layouts.md` — 布局模式
- `workflows/slide-generation.md` — 幻灯片生成工作流
- `workflows/script-generation.md` — 口播脚本生成工作流
- `workflows/tts-workflow.md` — TTS 音频生成工作流
- `workflows/video-generation.md` — HyperFrames 视频生成工作流
- `workflows/visual-debug.md` — 视觉调试工作流
- `llms.txt` — 项目文档索引（含 Slidev 官方文档远程引用）

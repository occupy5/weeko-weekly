# Weeko

> 面向知识类视频创作者的 Agent 内容生产工具

Weeko 将资料研究、内容整理、幻灯片设计、口播脚本、音频和视频制作组织成一套可复用的工作流。输入一个主题或资料链接，Agent 可以沿着明确的规范生成结构化内容，并通过设计系统保持不同选题、不同期数之间的视觉与表达一致性。

Slidev 是 Weeko 的内容渲染引擎，设计系统负责稳定输出质量，工作流文档则让 Agent 能够持续、可检查地完成一整期内容，而不只是生成一份临时演示文稿。

本项目使用 **GLM-5.1** 执行内容生产工作流，并通过 [Zread MCP](https://zread.ai/mcp) 获取 GitHub 仓库的结构、文档和源文件上下文。

## 为什么做 Weeko

知识类视频的制作通常需要反复执行同一组工作：

- 阅读和核对大量资料
- 将信息重组为适合讲解的叙事结构
- 设计幻灯片并处理视觉一致性
- 编写与画面对应的口播脚本
- 生成配音、对齐时间线并渲染视频
- 保存每一期的素材、版本和制作记录

通用 AI 工具可以完成其中某一步，但很难稳定地跑完整个流程。Weeko 将这些步骤变成项目内可执行、可复用、可扩展的 Agent 工作流。

## 核心能力

- **主题研究**：从 URL、项目文档或原始素材整理可靠的信息源
- **仓库理解**：通过 Zread MCP 搜索仓库文档、浏览目录结构并读取关键文件
- **内容策划**：生成适合知识讲解的结构化 `source.md`
- **幻灯片生成**：基于 Slidev、Vue 组件和设计系统生成 `slides.md`
- **口播脚本**：根据最终画面生成对应的 `script.md`
- **音频与视频**：支持 ElevenLabs TTS、Slidev 状态导出和 HyperFrames 渲染
- **质量检查**：包含构建验证、视觉检查和画面溢出调试流程
- **持续生产**：以“每期内容”为单位管理素材、产物和 Agent 运行记录
- **可信发布（可选）**：可将内容与运行记录保存到 IPFS，并登记可验证的发布凭证

## 工作流

```text
主题或资料链接
    ↓
资料研究与事实核对
    ↓
source.md 内容策划
    ↓
slides.md 幻灯片生成
    ↓
script.md 口播脚本
    ↓
音频生成（可选）
    ↓
视频渲染（可选）
    ↓
运行记录与可信发布（可选）
```

每一期内容保存在 `weekly/{year}-W{week}-{topic}/` 中。`weekly/_current/` 是当前工作目录，便于统一执行生成、构建和发布工具。

## 快速开始

```bash
bun install
bun run dev           # 启动 Slidev 开发服务器
bun run build         # 构建当前期幻灯片
bun run export        # 导出 PDF/PPTX/PNG
bun run export:states # 导出页面及 v-click 状态 PNG
```

项目默认从根目录的 `slides.md` 加载 `weekly/_current/slides.md`。首次运行时看到的是一套为 z.ai 黑客松准备的项目介绍内容，用于完整展示 Weeko 的设计理念和工作方式，包括：

- 面向知识类视频创作者的 Agent 生产流程
- GLM-5.1 如何执行研究、写作和内容生成任务
- Zread MCP 如何为 Agent 提供仓库结构、文档和代码上下文
- 设计系统驱动的 Slidev 内容呈现
- 从资料研究、内容策划到口播脚本的产物结构
- `agent-run.json` 中记录的执行步骤与工作流指纹
- dApp 中基于 IPFS 和 Base Sepolia 的可选可信发布能力

这套内容既是本地运行的默认页面，也是 Weeko 自身工作流生成的一期内容。你可以先通过它了解项目，再将 `weekly/_current/` 替换为自己的主题和素材。

### 启动 dApp

dApp 是独立的 Yarn 工作区。首次运行先安装其依赖：

```bash
cd dapp
corepack yarn install
corepack yarn start
```

打开 `http://localhost:3000`。当前配置默认连接 Base Sepolia，可直接查看已发布的 Creation Proof。

依赖安装完成后，也可以从项目根目录启动：

```bash
bun run dapp
```

如需调试本地合约，请分别启动本地链和 dApp：

```bash
# 终端 1：项目根目录
bun run dapp:chain

# 终端 2：项目根目录
bun run dapp
```

合约部署、publication 生成和测试网发布命令见 `dapp/README.md`。

创建新一期：

1. 在 `weekly/` 下创建一期目录并准备 `source.md`。
2. 遵循 `workflows/slide-generation.md` 生成幻灯片。
3. 遵循 `workflows/script-generation.md` 生成口播脚本。
4. 根据需要继续执行 TTS 和视频工作流。

## 项目结构

```text
weeko-weekly/
├── weekly/                # 按期管理的内容、脚本和运行记录
├── workflows/             # Agent 内容生产与质量检查工作流
├── components/
│   ├── core/              # 主题无关的结构组件
│   └── themes/            # 可替换的视觉主题组件
├── design_system/         # 设计令牌、布局、组件和 AI 使用指南
├── tools/                 # TTS、页面状态导出等辅助工具
├── dapp/                  # 可选的可信发布与收藏凭证扩展
├── slides.md              # 当前期 Slidev 入口
├── style.css              # 全局样式与设计令牌
└── llms.txt               # 面向 Agent 的项目文档索引
```

## 设计系统

Weeko 不依赖 Agent 临时拼接页面，而是使用项目内的组件和设计规范约束输出：

- `design_system/ai-guide.md`：Agent 创建幻灯片的首选入口
- `design_system/components.md`：组件、Props 和示例
- `design_system/layouts.md`：标准布局模式
- `design_system/tokens.md`：颜色、字体和间距令牌
- `design_system/utility-classes.md`：常用视觉样式

结构层组件负责内容组织，主题层组件负责视觉表达。新主题可以复用相同的内容工作流，而不需要重写整套幻灯片结构。

## 音频与视频

音视频生成是可选流程：

1. 使用 `tools/tts.py` 将口播脚本转换为分段音频。
2. 使用 `bun run export:states` 导出 Slidev 页面及动画状态。
3. 使用 HyperFrames 按口播时间线编排画面与音频。
4. 通过抽帧和视觉检查确认最终输出。

详细说明：

- `workflows/tts-workflow.md`
- `workflows/video-generation.md`
- `workflows/visual-debug.md`

生成物如 `assets/slides/`、`assets/audio/`、`snapshots/` 和 `renders/` 默认不提交到 Git。

## 可选：可信发布

`dapp/` 提供一套独立的发布扩展，用于保存内容版本和 Agent 运行记录：

- 为运行记录生成 SHA-256 指纹
- 将 publication 与 run log 上传到 IPFS
- 在兼容 EVM 的网络登记作者、内容 URI 和工作流哈希
- 为发布物生成可收藏的 Creation Proof
- 在 dApp 中核对本地内容、IPFS 数据与公开记录

这部分不是使用 Weeko 生成内容的前置条件。不了解 Web3 的创作者也可以独立使用完整的研究、幻灯片、脚本和视频工作流。

## 技术栈

| 领域 | 技术 |
|------|------|
| Agent 模型 | [GLM-5.1](https://z.ai/) |
| 仓库研究 | [Zread MCP](https://zread.ai/mcp) |
| Agent 工作流 | Markdown 规范、项目内技能与运行记录 |
| 内容呈现 | Slidev、Vue.js 3、TypeScript |
| 设计系统 | CSS Variables、oklch、可复用 Vue 组件 |
| 工具链 | Bun、Shiki、Playwright |
| 音频 | ElevenLabs |
| 视频 | HyperFrames、ffmpeg |
| 可选发布扩展 | IPFS、Solidity |

## 贡献

欢迎提交 Issue 和 Pull Request。新增组件、主题、布局或工作流时，请同步更新 `design_system/` 或 `workflows/` 中的对应文档，让人类和 Agent 都能复用这些能力。

## 许可证

MIT License

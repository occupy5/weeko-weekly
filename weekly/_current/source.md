---
title: Weeko
subtitle: 面向知识类视频创作者的 Agent 内容生产工具
author: Weeko
event: z.ai Hackathon
model: GLM-5.1
research: https://zread.ai/mcp
---

# Weeko

## 一句话介绍

Weeko 是一个面向知识类视频创作者的 Agent 内容生产工具。

创作者输入一个主题、资料链接或 GitHub 仓库，Weeko 将资料研究、内容策划、幻灯片设计、口播脚本、音频和视频制作组织成一套可复用工作流。设计系统负责稳定视觉质量，项目内工作流负责约束 Agent 的执行过程，可选的可信发布层负责保存内容版本与创作记录。

它不是单独的 Slidev 模板，也不是只生成一份 PPT 的聊天工具。Slidev 是内容渲染引擎，Agent 工作流才是产品核心。

# 为什么需要 Weeko

## 知识视频的成本不只在剪辑

制作一条知识类视频，通常要反复完成六类工作：

1. 阅读网页、项目文档和源代码，核对事实
2. 从资料中提炼适合讲解的叙事结构
3. 制作与内容匹配的幻灯片
4. 编写与每一页画面对应的口播脚本
5. 生成配音、对齐画面状态并渲染视频
6. 保存每一期的素材、版本和制作记录

通用 AI 工具可以帮助完成其中某一步，但上下文和约束经常停留在一次对话中。下一期仍要重新解释风格、目录、流程和质量要求。

## 现有方式的断点

| 环节 | 常见做法 | 主要问题 |
|------|----------|----------|
| 研究 | 浏览器中手工搜索和复制 | 来源分散，难以回到仓库上下文 |
| 写作 | 在聊天窗口生成大纲 | 与最终画面、脚本和素材目录脱节 |
| 设计 | 每期重新排版 | 视觉质量依赖临场发挥 |
| 视频 | 手工截图、配音和对齐 | 重复劳动多，难以复用 |
| 归档 | 保存最终 MP4 | 缺少结构化产物与过程记录 |

Weeko 的目标不是让 Agent “多生成一些文字”，而是让一整期知识内容成为可重复执行的项目。

# Weeko 如何工作

## 从输入到内容产品

一条标准工作流如下：

主题或资料链接
→ 资料研究与事实核对
→ `source.md` 内容策划
→ `slides.md` 幻灯片
→ `script.md` 口播脚本
→ TTS 音频（可选）
→ Slide states + HyperFrames 视频（可选）
→ `agent-run.json` 运行记录
→ IPFS / Base 可信发布（可选）

所有阶段都以文件作为明确接口。人可以检查和修改中间产物，Agent 也可以从指定阶段继续执行，而不必重新开始整段对话。

## GLM-5.1 与 Zread MCP

比赛版本使用 GLM-5.1 执行内容生产任务。

Zread MCP 负责为 Agent 提供 GitHub 仓库上下文。根据 Zread MCP 官方页面，它提供三类工具：

- `search_doc`：针对仓库文档提问并返回相关上下文
- `get_repo_structure`：读取仓库目录结构
- `read_file`：读取仓库中的具体文件

在 Weeko 中，两者的分工是：

| 能力 | 在工作流中的角色 |
|------|------------------|
| GLM-5.1 | 理解任务、组织叙事、生成和修改内容 |
| Zread MCP | 获取仓库结构、文档与关键源文件 |
| Weeko workflows | 规定每个阶段的输入、输出和检查方式 |
| Weeko design system | 约束幻灯片布局、组件和视觉风格 |

模型负责推理与执行，MCP 提供可靠上下文，项目规范负责让输出稳定复现。

## 四个核心产物

每一期至少保留四个核心文件：

### `source.md`

保存研究结果、事实来源和完整内容结构，是后续幻灯片与脚本的共同事实源。

### `slides.md`

使用 Slidev 和 Vue 组件表达最终画面。内容结构与视觉组件分离，支持浏览器预览、PDF、PPTX 和 PNG 导出。

### `script.md`

根据最终幻灯片编写口播，而不是独立生成一份与画面脱节的文章。

### `agent-run.json`

记录模型名称、目标、工作流步骤、指标、产物和安全边界，为调试、复盘和可信发布提供结构化数据。

# 设计系统与质量

## Agent 不应该临时设计每一页

Weeko 使用双层组件架构：

- 结构层组件负责信息组织，例如封面、章节、卡片网格、比较表格、双栏布局和项目结构
- 主题层组件负责视觉表达，例如 island 主题的卡片、按钮、封面和结束页

设计规范保存在 `design_system/`：

- `ai-guide.md`：Agent 的组件选择指南
- `components.md`：组件 Props 和示例
- `layouts.md`：布局模式
- `tokens.md`：颜色、字体、间距
- `utility-classes.md`：可复用样式

这样做的价值是让不同选题共享同一套表达质量，同时允许新增主题而不重写内容生产流程。

## 质量闭环

Weeko 不把“文件成功生成”视为完成。

幻灯片生成后还会执行：

1. Slidev 构建验证
2. 浏览器视觉检查
3. 文字溢出和布局检查
4. `<v-click>` 最终状态检查
5. 修改后重新构建

视频流程还会导出每一页和每一个 click state，通过 HyperFrames 快照检查关键时间点，再渲染最终 MP4。

质量规则与生成规则一起保存在仓库中，所以 Agent 能够修复问题，而不是只把问题留给创作者。

## 项目结构就是工作台

```text
weekly/_current/       当前一期：source / slides / script / agent-run
workflows/             幻灯片、脚本、TTS、视频与视觉检查流程
design_system/         设计令牌、布局、组件与 Agent 指南
components/            结构组件与主题组件
tools/                 TTS 与 slide-state 导出工具
dapp/                  可选的可信发布扩展
slides.md              当前一期的 Slidev 入口
```

项目默认加载 `weekly/_current/slides.md`。这份比赛 PPT 本身也是 Weeko 工作流的一期内容，因此演示页面同时是产品输出。

# 可选的可信发布

## 为什么要记录创作过程

AI 内容越来越容易生成，但创作者仍然很难回答：

- 这份内容对应哪个版本？
- 使用了什么模型和资料来源？
- Agent 实际执行了哪些步骤？
- 发布后内容是否被替换？

Weeko 不试图用区块链证明内容一定正确，而是证明“哪份内容、由谁、以哪个工作流版本完成并发布”。

## AI + Web3 的分工

可信发布层保持可选，不影响普通创作者使用内容工作流。

### Off-chain

- `source.md`、`slides.md`、`script.md`
- `agent-run.json`
- publication manifest
- IPFS 内容 URI

### On-chain

- creator 地址
- publication title
- IPFS content URI
- `workflowHash`
- publication 与 collectible proof

`agent-run.json` 的精确字节经过 SHA-256 生成 `workflowHash`。运行记录只要改变一个字符，指纹就会变化。

## 已跑通的 Base Sepolia 闭环

比赛版本已经在 Base Sepolia 完成一次真实发布：

- Network：Base Sepolia，chain ID `84532`
- Contract：`0x821d0e78b09dc4e923845069d65dd26fdb4dd6c7`
- Publication：`#1`
- Token：`#1`
- Creator / Collector：`0x74A900b702c5103B5D588D7D8e265c4B972e08Ff`
- Model：`GLM-5.1`
- Publish transaction：`0x7c846c5a...65fde1`
- Mint transaction：`0x8e0b1fb9...1e7259`

对应 publication 与 run log 已保存到 IPFS，dApp 会对比本地工作流哈希与链上哈希，并显示 Agent 步骤和 Creation Proof。

这一层的意义不是把内容生产“Web3 化”，而是为需要公开版本记录的创作者提供一个可插拔的发布出口。

# 项目价值

## 对知识创作者

- 降低研究、写稿、排版和视频编排的重复成本
- 保持不同期数之间的视觉与内容结构一致
- 中间产物可修改、可复用，不被锁在聊天记录里
- 可以只使用幻灯片和脚本，也可以继续生成音视频

## 对 Agent 工程

- 把提示词升级为仓库内可版本化的 workflows
- 把 UI 规范升级为 Agent 可读取的设计系统
- 把执行过程升级为结构化 `agent-run.json`
- 把一次性 Demo 升级为能持续生产新一期内容的工具

## 对 AI + Web3

- AI 负责研究、创作和生产
- IPFS 保存内容与运行记录
- Base 保存作者、URI 和工作流指纹
- dApp 负责公开核验与收藏

Web3 是发布与证明层，不是创作门槛。

# 总结

Weeko 的核心主张是：

知识视频不应该从一张空白 PPT 开始，也不应该结束在一个无法复用的聊天窗口里。

通过 GLM-5.1、Zread MCP、项目内工作流和设计系统，Weeko 将知识内容生产变成一套可检查、可扩展、可持续运行的 Agent 工具；通过可选的 IPFS 与 Base 发布层，它还可以为最终作品保留公开的版本和过程凭证。

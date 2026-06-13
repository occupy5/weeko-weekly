---
defaults:
  class: animal-crossing
---


<IslandCoverSlide
  title="Weeko"
  subtitle="面向知识类视频创作者的 Agent 内容生产工具"
  event="z.ai Hackathon · Creator Workflow × Verifiable Publishing"
/>

---

<div class="deck-kicker">01 · The problem</div>

# 做一条知识视频，真正耗时的是什么？

<div class="problem-path">
  <div v-click class="problem-stage" style="--stage-color: var(--nook-teal)">
    <div class="stage-number">01</div>
    <h2>研究</h2>
    <p>网页、文档与代码分散在不同上下文，事实核对和资料整理反复发生。</p>
  </div>
  <div v-click class="problem-stage" style="--stage-color: var(--nook-orange)">
    <div class="stage-number">02</div>
    <h2>表达</h2>
    <p>大纲、幻灯片与口播各自生成，内容结构无法稳定传递到最终画面。</p>
  </div>
  <div v-click class="problem-stage" style="--stage-color: var(--nook-purple)">
    <div class="stage-number">03</div>
    <h2>生产</h2>
    <p>排版、配音、页面状态与画面对齐，仍然依赖大量重复劳动。</p>
  </div>
</div>

<div v-click class="problem-thesis">
  通用 AI 可以完成某一步，但很难稳定推进完整的一期内容。
</div>

---

<div class="deck-kicker">02 · Positioning</div>

# Weeko 的定位

<div class="positioning-layout">
  <div>
    <div v-click class="positioning-statement">
      不是一次性的<br><strong>PPT 生成器</strong>
    </div>
    <v-click>
      <LeafDivider variant="divider" />
      <div class="positioning-statement">
        而是知识创作者的<br><strong>Agent 工作台</strong>
      </div>
    </v-click>
  </div>
  <div class="positioning-list">
    <div v-click class="positioning-item">
      <span>1</span>
      <div><strong>文件驱动</strong><small>每个中间产物都能检查和修改</small></div>
    </div>
    <div v-click class="positioning-item">
      <span>2</span>
      <div><strong>设计系统约束</strong><small>稳定复用视觉和内容模式</small></div>
    </div>
    <div v-click class="positioning-item">
      <span>3</span>
      <div><strong>完整生产链</strong><small>研究、幻灯片、口播、音视频</small></div>
    </div>
    <div v-click class="positioning-item">
      <span>4</span>
      <div><strong>可选可信发布</strong><small>为作品增加公开版本凭证</small></div>
    </div>
  </div>
</div>

---
layout: center
---

<SectionDivider
  title="从资料到内容产品"
  subtitle="每个阶段都有明确输入、输出与检查方式"
/>

---

<div class="deck-kicker">03 · Workflow</div>

# 一条可复用的 Agent 工作流

<div class="workflow-board">
  <div v-click="1" class="workflow-phase-wrap">
    <IslandCard color="teal">
      <div class="workflow-phase-head"><strong>内容形成</strong><span>01 — 04</span></div>
      <div class="workflow-steps">
        <div class="workflow-chip"><b>Research</b><span>主题、URL、仓库与事实核对</span></div>
        <div class="workflow-chip"><b>Source</b><span>沉淀结构化内容事实源</span></div>
        <div class="workflow-chip"><b>Slides</b><span>设计系统驱动的 Slidev</span></div>
        <div class="workflow-chip"><b>Script</b><span>生成与最终画面对齐的口播</span></div>
      </div>
    </IslandCard>
  </div>
  <div v-click="2" class="workflow-phase-wrap">
    <IslandCard color="yellow">
      <div class="workflow-phase-head"><strong>发布成片</strong><span>05 — 08</span></div>
      <div class="workflow-steps">
        <div class="workflow-chip"><b>Audio</b><span>分段 TTS 与完整旁白</span></div>
        <div class="workflow-chip"><b>Video</b><span>页面状态与时间线渲染</span></div>
        <div class="workflow-chip"><b>Verify</b><span>构建、视觉与关键帧检查</span></div>
        <div class="workflow-chip"><b>Publish</b><span>运行记录与可选可信发布</span></div>
      </div>
    </IslandCard>
  </div>
</div>

<div v-click="3" class="workflow-bridge">
  文件就是阶段接口，创作者和 Agent 都能从任意阶段继续
</div>

---

<div class="deck-kicker">04 · Intelligence</div>

# GLM-5.1 × Zread MCP

<div class="role-split">
  <div v-click class="role-card-wrap">
    <IslandCard color="green">
      <div class="role-card-title"><h2>GLM-5.1</h2><span>REASON + ACT</span></div>
      <div class="role-card-list">
        <div class="role-card-item">理解创作目标</div>
        <div class="role-card-item">组织知识叙事</div>
        <div class="role-card-item">生成并修改内容</div>
        <div class="role-card-item">执行检查与修复</div>
      </div>
    </IslandCard>
  </div>
  <div v-click class="role-join">×</div>
  <div v-click class="role-card-wrap">
    <IslandCard color="blue">
      <div class="role-card-title"><h2>Zread MCP</h2><span>REPO CONTEXT</span></div>
      <div class="role-card-list">
        <div class="role-card-item"><code>search_doc</code>搜索仓库文档</div>
        <div class="role-card-item"><code>get_repo_structure</code>读取目录结构</div>
        <div class="role-card-item"><code>read_file</code>获取关键文件</div>
        <div class="role-card-item">提供研究上下文</div>
      </div>
    </IslandCard>
  </div>
</div>

<div v-click class="role-result-card">
  <IslandCard>
    模型负责推理执行，MCP 提供上下文，Weeko 让过程稳定复现。
  </IslandCard>
</div>

---

<div class="deck-kicker">05 · Artifacts</div>

# 每一期都有四个核心产物

<div class="artifact-grid">
  <div v-click class="artifact-wrap">
    <IslandCard color="teal">
      <span class="artifact-index">01</span><span class="artifact-name">source.md</span><span class="artifact-desc">研究结果、事实来源与完整内容结构</span>
    </IslandCard>
  </div>
  <div v-click class="artifact-wrap">
    <IslandCard color="yellow">
      <span class="artifact-index">02</span><span class="artifact-name">slides.md</span><span class="artifact-desc">基于 Slidev 与 Vue 组件的最终画面</span>
    </IslandCard>
  </div>
  <div v-click class="artifact-wrap">
    <IslandCard>
      <span class="artifact-index">03</span><span class="artifact-name">script.md</span><span class="artifact-desc">根据最终幻灯片生成对应口播</span>
    </IslandCard>
  </div>
  <div v-click class="artifact-wrap">
    <IslandCard color="orange">
      <span class="artifact-index">04</span><span class="artifact-name">agent-run.json</span><span class="artifact-desc">模型、步骤、指标、产物与安全边界</span>
    </IslandCard>
  </div>
</div>

<div v-click class="final-thesis">内容不是留在会话里，而是沉淀为可继续工作的项目文件。</div>

---

<div class="deck-kicker">06 · Design system</div>

# Agent 不应该临时设计每一页

<div class="system-stack-refined">
  <div v-click class="system-card-wrap">
    <IslandCard color="yellow">
      <h2>内容层</h2><p>同一份 source、叙事与语义结构</p><span class="system-tag">WHAT</span>
    </IslandCard>
  </div>
  <div v-click class="system-card-wrap">
    <IslandCard color="teal">
      <h2>结构层</h2><p>封面、章节、卡片、对比表、双栏与项目结构</p><span class="system-tag">HOW</span>
    </IslandCard>
  </div>
  <div v-click class="system-card-wrap">
    <IslandCard>
      <h2>主题层</h2><p>替换颜色、圆角与视觉语言，不需要重写内容</p><span class="system-tag">LOOK</span>
    </IslandCard>
  </div>
</div>

<v-click>
  <LeafDivider variant="divider" />
  <div class="final-thesis">组件、令牌与使用规则同时服务开发者和内容生成 Agent。</div>
</v-click>

---

<div class="deck-kicker">07 · Quality loop</div>

# 生成不是结束，检查才是

<div class="quality-flow">
  <div v-click="1" class="quality-card-wrap">
    <IslandCard color="green"><span class="quality-number">01</span><h2>Build</h2><p>Slidev 构建与类型验证</p></IslandCard>
  </div>
  <div v-click="2" class="quality-card-wrap">
    <IslandCard color="blue"><span class="quality-number">02</span><h2>Visual</h2><p>检查溢出、布局与所有 click state</p></IslandCard>
  </div>
  <div v-click="3" class="quality-card-wrap">
    <IslandCard color="orange"><span class="quality-number">03</span><h2>Render</h2><p>核对页面状态、快照与视频关键帧</p></IslandCard>
  </div>
</div>

<div v-click="4" class="quality-repair">
  <IslandCard><strong>发现问题 → Agent 继续修改</strong><span>规则和修复方法留在项目里，形成下一轮输入</span></IslandCard>
</div>

---

<div class="deck-kicker">08 · Workbench</div>

# 项目本身就是工作台

<div class="workbench-layout">
  <ProjectStructurePanel v-click maxHeight="420px">

```text
weekly/_current/       当前一期内容
├── source.md          研究与内容策划
├── slides.md          Slidev 幻灯片
├── script.md          口播脚本
└── agent-run.json     Agent 运行记录

workflows/             内容生产与质量检查
design_system/         组件、布局、令牌与 AI 指南
components/            结构组件与主题组件
tools/                 TTS 与 slide-state 导出
dapp/                  可选可信发布扩展
slides.md              当前一期入口
```

  </ProjectStructurePanel>
  <div class="workbench-side">
    <div v-click class="workbench-point"><b>可见</b><span>每一步的输入、输出都在仓库里</span></div>
    <div v-click class="workbench-point"><b>可改</b><span>创作者能直接调整中间产物</span></div>
    <div v-click class="workbench-point"><b>可续</b><span>Agent 从指定阶段继续执行</span></div>
    <div v-click class="workbench-point"><b>可复用</b><span>本页 PPT 就来自 _current 工作流</span></div>
  </div>
</div>

---
layout: center
---

<SectionDivider
  title="创作完成之后"
  subtitle="Web3 是可选的发布与证明层，不是使用门槛"
/>

---

<div class="deck-kicker">09 · Public record</div>

# AI 内容还缺少一个公开版本记录

<div class="record-layout">
  <div v-click class="record-question">
    这份内容由谁、用什么资料与模型、经过哪些步骤完成？
    <br><span>发布后有没有被替换？</span>
  </div>
  <div class="record-lines">
    <div v-click="2" class="record-line"><b>01</b><span>Publication manifest</span></div>
    <div v-click="2" class="record-line"><b>02</b><span>Agent run log</span></div>
    <div v-click="3" class="record-line"><b>03</b><span>IPFS content URI</span></div>
    <div v-click="3" class="record-line"><b>04</b><span>SHA-256 workflow hash</span></div>
    <div v-click="4" class="record-line"><b>05</b><span>Creator 与 publication</span></div>
  </div>
</div>

<v-click at="5">
  <LeafDivider variant="divider" />
  <div class="deck-note text-center">区块链不证明内容一定正确；它证明哪份内容、由谁、以哪个工作流版本完成并发布。</div>
</v-click>

---

<div class="deck-kicker">10 · Verifiable publishing</div>

# AI × IPFS × Base

<div class="trust-map">
  <div v-click="1" class="trust-main-card">
    <IslandCard color="green">
      <small>CREATE</small>
      <h2>GLM-5.1</h2>
      <p>研究、创作与内容生产</p>
    </IslandCard>
  </div>
  <div class="trust-middle">
    <div v-click="2" class="trust-mini-card">
      <IslandCard color="teal"><b>Agent Run</b><span>记录步骤、指标与产物</span></IslandCard>
    </div>
    <div v-click="3" class="trust-mini-card">
      <IslandCard color="yellow"><b>SHA-256</b><span>生成工作流精确指纹</span></IslandCard>
    </div>
    <div v-click="4" class="trust-mini-card">
      <IslandCard color="orange"><b>IPFS</b><span>保存 publication 与 run log</span></IslandCard>
    </div>
  </div>
  <div v-click="5" class="trust-main-card">
    <IslandCard color="blue">
      <small>REGISTER</small>
      <h2>Base</h2>
      <p>登记 creator、URI 与 workflow hash</p>
    </IslandCard>
  </div>
</div>

<div v-click="6" class="trust-proof-card">
  <IslandCard>
    <span>Mint Creation Proof</span>
    <span>dApp 展示 Agent Timeline</span>
    <span>本地 / IPFS / 链上校验</span>
  </IslandCard>
</div>

---

<div class="deck-kicker">11 · Live proof</div>

# dApp：链上 Creation Proof

<IslandDappProofSlide
  screenshot="/screenshots/weeko-dapp-live-view.png"
  contract="0x821D0E78B09dc4e923845069d65DD26FdB4Dd6C7"
  explorer-url="https://sepolia.basescan.org/address/0x821D0E78B09dc4e923845069d65DD26FdB4Dd6C7"
  meta="Publication #2 · Token #1 · process verified"
/>

---

<div class="deck-kicker">12 · Difference</div>

# Weeko 的差异

<v-click>
<ComparisonTable
  :headers="['维度', '通用 AI 对话', 'Weeko']"
  :rows="[
    ['目标', '完成一次生成', '持续生产每一期内容'],
    ['上下文', '停留在会话中', 'Zread MCP + 项目文件'],
    ['视觉', '临时排版', '设计系统与可复用组件'],
    ['产物', '最终文本或 PPT', 'source / slides / script / run log'],
    ['质量', '依赖人工收尾', '构建、视觉与关键帧检查'],
    ['发布', '保存最终文件', '可选 IPFS 与 Base 凭证'],
  ]"
  :highlightCol="2"
/>
</v-click>

<v-click>
  <LeafDivider variant="divider" />
  <div class="final-thesis">Weeko 交付的不是一次回答，而是一套能继续运行的创作能力。</div>
</v-click>

---

<div class="deck-kicker">13 · Value</div>

# 价值：让创作能力留在项目里

<div class="value-layout-refined">
  <div v-click class="value-thesis-wrap">
    <IslandCard color="yellow">
      <small>CORE VALUE</small>
      <strong>把一次性的 AI 输出，变成留在项目里的创作能力。</strong>
      <p>知识视频不从空白 PPT 开始，也不结束在无法复用的聊天窗口里。</p>
    </IslandCard>
  </div>
  <div class="value-list-refined">
    <div v-click class="value-item-wrap">
      <IslandCard color="teal"><b>01</b><strong>对创作者</strong><span>减少研究、写稿、排版与编排的重复成本</span></IslandCard>
    </div>
    <div v-click class="value-item-wrap">
      <IslandCard><b>02</b><strong>对 Agent</strong><span>把 Prompt 升级为可版本化、可执行的工作流</span></IslandCard>
    </div>
    <div v-click class="value-item-wrap">
      <IslandCard color="orange"><b>03</b><strong>对内容资产</strong><span>保留结构化产物，并按需增加公开版本凭证</span></IslandCard>
    </div>
  </div>
</div>

---
layout: center
class: text-center
---

<IslandHackathonClosingSlide
  title="感谢观看"
  subtitle="z.ai Hackathon · Creator Workflow × Verifiable Publishing"
  summary="Weeko 把资料研究、内容策划、Slidev 设计、脚本与可选可信发布串成一条可复用的 Agent 工作流，让知识类视频从一次性生成变成可检查、可复用、可发布的项目资产。"
  :projects="[
    {
      name: 'slidevjs/slidev',
      url: 'https://github.com/slidevjs/slidev',
      description: '让 Markdown、Vue 组件与演示发布成为同一套创作界面。'
    },
    {
      name: 'scaffold-eth/scaffold-eth-2',
      url: 'https://github.com/scaffold-eth/scaffold-eth-2',
      description: '为测试网发布与 dApp 原型提供快速、清晰的 Web3 工程起点。'
    },
    {
      name: 'guokaigdg/animal-island-ui',
      url: 'https://github.com/guokaigdg/animal-island-ui',
      description: '提供动森风格的视觉灵感。'
    }
  ]"
/>

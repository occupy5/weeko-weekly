---
defaults:
  class: animal-crossing
---

<style>
.deck-kicker {
  margin-bottom: 0.55rem;
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.deck-note {
  color: var(--color-text-muted);
  font-size: 0.72rem;
  line-height: 1.55;
}

.problem-path {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  margin-top: 2.4rem;
}

.problem-stage {
  position: relative;
  min-height: 17rem;
  padding: 1.2rem 1.1rem 1rem;
  border-top: 5px solid var(--stage-color);
}

.problem-stage::after {
  position: absolute;
  top: 1.35rem;
  right: -0.85rem;
  color: color-mix(in oklch, var(--stage-color) 45%, transparent);
  content: "→";
  font-size: 1.8rem;
  font-weight: 800;
}

.problem-stage:last-child::after {
  content: "";
}

.problem-stage .stage-number {
  color: color-mix(in oklch, var(--stage-color) 82%, var(--color-text));
  font-size: 3.4rem;
  font-weight: 900;
  line-height: 1;
  opacity: 0.28;
}

.problem-stage h2 {
  margin: -0.45rem 0 0.8rem;
  font-size: 1.35rem;
}

.problem-stage p {
  color: var(--color-text-muted);
  font-size: 0.82rem;
  line-height: 1.65;
}

.problem-thesis {
  margin-top: 1.1rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
}

.positioning-layout {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 3rem;
  align-items: center;
  margin-top: 1.5rem;
}

.positioning-statement {
  font-size: 1.65rem;
  font-weight: 800;
  line-height: 1.45;
}

.positioning-statement strong {
  color: var(--color-primary);
  font-size: 2.15rem;
}

.positioning-list {
  display: flex;
  flex-direction: column;
  gap: 0.68rem;
}

.positioning-item {
  display: grid;
  grid-template-columns: 1.7rem 1fr;
  gap: 0.7rem;
  align-items: start;
  padding-bottom: 0.68rem;
  border-bottom: 1px dashed color-mix(in oklch, var(--color-primary) 32%, transparent);
}

.positioning-item span:first-child {
  display: grid;
  width: 1.55rem;
  height: 1.55rem;
  place-items: center;
  border-radius: 50%;
  background: var(--nook-teal);
  color: var(--color-text);
  font-size: 0.68rem;
  font-weight: 800;
}

.positioning-item strong {
  display: block;
  margin-bottom: 0.1rem;
  font-size: 0.88rem;
}

.positioning-item small {
  color: var(--color-text-muted);
  font-size: 0.68rem;
  line-height: 1.45;
}

.workflow-river {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem 1rem;
  margin-top: 1.5rem;
}

.workflow-step {
  position: relative;
  min-height: 7rem;
  padding: 0.85rem;
  border-radius: 28px 22px 30px 20px / 22px 30px 20px 28px;
  background: var(--step-bg);
  box-shadow: 0 6px 14px oklch(0.3 0.03 55 / 0.08);
}

.workflow-step:nth-child(n + 5) {
  transform: translateX(1.35rem);
}

.workflow-step b {
  display: block;
  margin-bottom: 0.28rem;
  color: color-mix(in oklch, var(--color-text) 82%, var(--step-bg));
  font-size: 0.82rem;
}

.workflow-step span {
  color: color-mix(in oklch, var(--color-text) 72%, var(--step-bg));
  font-size: 0.64rem;
  line-height: 1.4;
}

.workflow-step em {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.62rem;
  font-style: normal;
  font-weight: 800;
  opacity: 0.56;
}

.workflow-caption {
  display: flex;
  justify-content: space-between;
  margin-top: 1.3rem;
  color: var(--color-text-muted);
  font-size: 0.72rem;
}

.role-split {
  display: grid;
  grid-template-columns: 1fr 4rem 1fr;
  align-items: stretch;
  margin-top: 1.35rem;
}

.role-panel {
  padding: 1.4rem 1.5rem;
  border-radius: 32px 24px 34px 26px / 26px 34px 24px 32px;
}

.role-panel.model {
  background: var(--nook-green);
}

.role-panel.context {
  background: var(--nook-blue);
}

.role-panel h2 {
  margin-bottom: 1rem;
  font-size: 1.35rem;
}

.role-panel ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.role-panel li {
  padding: 0.42rem 0;
  border-bottom: 1px solid oklch(1 0 0 / 0.33);
  font-size: 0.75rem;
}

.role-join {
  display: grid;
  place-items: center;
  color: var(--color-primary);
  font-size: 1.7rem;
  font-weight: 900;
}

.role-result {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.78rem;
  font-weight: 700;
}

.file-stack {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 88%;
  margin: 1.3rem auto 0;
}

.file-row {
  display: grid;
  grid-template-columns: 2.4rem 12rem 1fr;
  gap: 0.9rem;
  align-items: center;
  padding: 0.72rem 1rem;
  border-radius: 18px 25px 20px 14px;
  background: var(--file-bg);
  box-shadow: 0 4px 10px oklch(0.3 0.03 55 / 0.07);
}

.file-row:nth-child(even) {
  transform: translateX(2.2rem);
}

.file-index {
  color: color-mix(in oklch, var(--color-text) 60%, var(--file-bg));
  font-size: 0.68rem;
  font-weight: 900;
}

.file-name {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 800;
}

.file-desc {
  color: color-mix(in oklch, var(--color-text) 76%, var(--file-bg));
  font-size: 0.7rem;
}

.system-layers {
  position: relative;
  width: 82%;
  height: 22rem;
  margin: 0.8rem auto 0;
}

.system-layer {
  position: absolute;
  left: 50%;
  width: var(--layer-width);
  padding: 1rem 1.4rem;
  transform: translateX(-50%);
  border-radius: 50% 45% 48% 52% / 44% 54% 46% 56%;
  background: var(--layer-bg);
  box-shadow: 0 8px 18px oklch(0.3 0.03 55 / 0.1);
  text-align: center;
}

.system-layer:nth-child(1) { top: 0; }
.system-layer:nth-child(2) { top: 6.2rem; }
.system-layer:nth-child(3) { top: 12.4rem; }

.system-layer h2 {
  margin: 0 0 0.2rem;
  font-size: 1rem;
}

.system-layer p {
  margin: 0;
  color: color-mix(in oklch, var(--color-text) 72%, var(--layer-bg));
  font-size: 0.68rem;
}

.quality-orbit {
  position: relative;
  width: 35rem;
  height: 24rem;
  margin: 0.4rem auto 0;
}

.quality-center {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  width: 11rem;
  height: 11rem;
  transform: translate(-50%, -50%);
  place-items: center;
  border-radius: 46% 54% 48% 52% / 52% 42% 58% 48%;
  background: var(--nook-yellow);
  box-shadow: 0 10px 24px oklch(0.3 0.03 55 / 0.12);
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
}

.quality-node {
  position: absolute;
  width: 10rem;
  padding: 0.8rem 0.9rem;
  border-radius: 22px;
  background: var(--node-bg);
  text-align: center;
}

.quality-node:nth-child(2) { top: 0.3rem; left: 12.5rem; }
.quality-node:nth-child(3) { bottom: 1rem; left: 0; }
.quality-node:nth-child(4) { right: 0; bottom: 1rem; }

.quality-node b {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.86rem;
}

.quality-node span {
  font-size: 0.62rem;
  line-height: 1.35;
}

.quality-arrow {
  position: absolute;
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 900;
}

.quality-arrow.a { top: 7.2rem; left: 8.3rem; transform: rotate(42deg); }
.quality-arrow.b { right: 8.3rem; top: 7.2rem; transform: rotate(138deg); }
.quality-arrow.c { bottom: 2.6rem; left: 16.6rem; transform: rotate(270deg); }

.workbench-layout {
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 1.6rem;
  align-items: stretch;
}

.workbench-side {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.8rem;
}

.workbench-point {
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed color-mix(in oklch, var(--color-primary) 35%, transparent);
}

.workbench-point b {
  display: block;
  margin-bottom: 0.2rem;
  color: var(--color-primary);
  font-size: 0.82rem;
}

.workbench-point span {
  color: var(--color-text-muted);
  font-size: 0.68rem;
  line-height: 1.45;
}

.record-layout {
  display: grid;
  grid-template-columns: 0.82fr 1.18fr;
  gap: 2.4rem;
  align-items: center;
  margin-top: 1.2rem;
}

.record-question {
  font-size: 1.65rem;
  font-weight: 800;
  line-height: 1.55;
}

.record-question span {
  color: var(--color-primary);
}

.record-lines {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.record-line {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0.65rem;
  align-items: center;
  padding: 0.65rem 0.8rem;
  border-radius: 14px 22px 16px 20px;
  background: color-mix(in oklch, var(--nook-teal) 54%, var(--color-bg));
}

.record-line b {
  display: grid;
  width: 1.55rem;
  height: 1.55rem;
  place-items: center;
  border-radius: 50%;
  background: var(--color-bg);
  font-size: 0.62rem;
}

.record-line span {
  font-size: 0.72rem;
}

.trust-pipeline {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.6rem;
  align-items: center;
  margin-top: 2.7rem;
}

.trust-node {
  position: relative;
  min-height: 10rem;
  padding: 1rem 0.75rem;
  border-radius: 34px 25px 30px 22px / 24px 34px 24px 32px;
  background: var(--node-bg);
  text-align: center;
}

.trust-node::after {
  position: absolute;
  top: 3.8rem;
  right: -0.7rem;
  content: "→";
  color: var(--color-primary);
  font-size: 1.25rem;
  font-weight: 900;
}

.trust-node:last-child::after {
  content: "";
}

.trust-node em {
  display: block;
  margin-bottom: 0.65rem;
  font-size: 0.6rem;
  font-style: normal;
  font-weight: 900;
  opacity: 0.56;
}

.trust-node b {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
}

.trust-node span {
  font-size: 0.62rem;
  line-height: 1.4;
}

.trust-branches {
  display: flex;
  justify-content: center;
  gap: 0.65rem;
  margin-top: 1.15rem;
}

.trust-chip {
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: color-mix(in oklch, var(--nook-yellow) 62%, var(--color-bg));
  font-size: 0.65rem;
  font-weight: 700;
}

.chain-receipt {
  position: relative;
  width: 84%;
  margin: 0.8rem auto 0;
  padding: 1.25rem 1.5rem;
  border-radius: 18px 24px 20px 28px;
  background: oklch(0.98 0.025 88);
  box-shadow: 0 12px 28px oklch(0.3 0.03 55 / 0.12);
}

.chain-receipt::before,
.chain-receipt::after {
  position: absolute;
  right: 1rem;
  left: 1rem;
  height: 1px;
  background: repeating-linear-gradient(90deg, var(--color-primary) 0 6px, transparent 6px 12px);
  content: "";
  opacity: 0.28;
}

.chain-receipt::before { top: 3.6rem; }
.chain-receipt::after { bottom: 3.4rem; }

.receipt-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.15rem;
}

.receipt-head b {
  font-size: 1.05rem;
}

.receipt-status {
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  background: var(--nook-green);
  font-size: 0.62rem;
  font-weight: 800;
}

.receipt-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  padding: 0.75rem 0;
}

.receipt-metric strong {
  display: block;
  font-size: 1.45rem;
  line-height: 1.1;
}

.receipt-metric span {
  color: var(--color-text-muted);
  font-size: 0.62rem;
}

.receipt-facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1.2rem;
  padding: 0.8rem 0;
}

.receipt-fact {
  font-size: 0.67rem;
  line-height: 1.45;
}

.receipt-fact b {
  display: block;
  color: var(--color-primary);
  font-size: 0.58rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.proof-address {
  overflow-wrap: anywhere;
  font-family: var(--font-mono);
  font-size: 0.57rem;
}

.receipt-foot {
  margin-top: 0.75rem;
  text-align: center;
  font-size: 0.65rem;
  font-weight: 700;
}

.value-columns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.25rem;
  margin-top: 1.2rem;
}

.value-column {
  min-height: 18rem;
  padding: 1.1rem 1rem;
  border-radius: 48% 52% 46% 54% / 18% 22% 20% 24%;
  background: var(--value-bg);
}

.value-column em {
  display: block;
  color: color-mix(in oklch, var(--color-text) 56%, var(--value-bg));
  font-size: 2.7rem;
  font-style: normal;
  font-weight: 900;
  line-height: 1;
  opacity: 0.28;
}

.value-column h2 {
  margin: 0.1rem 0 0.75rem;
  font-size: 1.05rem;
}

.value-column p {
  color: color-mix(in oklch, var(--color-text) 76%, var(--value-bg));
  font-size: 0.72rem;
  line-height: 1.6;
}

.final-thesis {
  margin-top: 0.55rem;
  text-align: center;
  font-size: 0.78rem;
  font-weight: 800;
}
</style>

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

# Base Sepolia：闭环已经真实跑通

<div class="chain-receipt">
  <div class="receipt-head">
    <b>WEEKO / PUBLISH RECEIPT</b>
    <span v-click="1" class="receipt-status">VERIFIED</span>
  </div>
  <div class="receipt-grid">
    <div v-click="2" class="receipt-metric"><strong>#1</strong><span>Publication</span></div>
    <div v-click="2" class="receipt-metric"><strong>#1</strong><span>Creation Proof</span></div>
    <div v-click="2" class="receipt-metric"><strong>84532</strong><span>Base Sepolia</span></div>
  </div>
  <div class="receipt-facts">
    <div v-click="3" class="receipt-fact"><b>Model</b>GLM-5.1</div>
    <div v-click="3" class="receipt-fact"><b>Result</b>Publication 与 Mint 均成功</div>
    <div v-click="4" class="receipt-fact"><b>Contract</b><span class="proof-address">0x821d0e78b09dc4e923845069d65dd26fdb4dd6c7</span></div>
    <div v-click="4" class="receipt-fact"><b>Creator</b><span class="proof-address">0x74A900b702c5103B5D588D7D8e265c4B972e08Ff</span></div>
    <div v-click="5" class="receipt-fact"><b>Storage</b>IPFS publication / run log 可读取</div>
    <div v-click="5" class="receipt-fact"><b>Verification</b>dApp 与链上 workflow hash 一致</div>
  </div>
  <div v-click="6" class="receipt-foot">作品和完成它的过程，拥有同一个公开版本。</div>
</div>

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
      description: '为可信发布与 dApp 原型提供快速、清晰的 Web3 工程起点。'
    },
    {
      name: 'guokaigdg/animal-island-ui',
      url: 'https://github.com/guokaigdg/animal-island-ui',
      description: '提供动森风格的视觉灵感，让演示更温暖也更有记忆点。'
    }
  ]"
/>

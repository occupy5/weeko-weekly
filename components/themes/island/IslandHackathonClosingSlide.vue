<script setup lang="ts">
interface OpenSourceProject {
	name: string;
	url: string;
	description: string;
}

interface Props {
	title?: string;
	summary: string;
	projects: OpenSourceProject[];
	subtitle?: string;
}

withDefaults(defineProps<Props>(), {
	title: '谢谢观看',
	subtitle: 'z.ai Hackathon · Creator Workflow × Verifiable Publishing',
});
</script>

<template>
  <div class="island-hackathon-closing animal-cursor-1CaqL">
    <div class="closing-shell">
      <div class="closing-ribbon">{{ subtitle }}</div>

      <div class="closing-board">
        <section class="closing-lead">
          <span class="closing-kicker">Hackathon wrap-up</span>
          <h1 class="closing-title">{{ title }}</h1>

          <div class="summary-note">
            <p>{{ summary }}</p>
          </div>
        </section>

        <section class="credits-panel">
          <div class="credits-heading">
            <span>Open Source Thanks</span>
            <strong>感谢这些开源项目</strong>
          </div>

          <div class="credits-list">
            <a
              v-for="(project, index) in projects"
              :key="project.url"
              :href="project.url"
              target="_blank"
              rel="noreferrer"
              class="credit-ticket"
            >
              <span class="ticket-index">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="ticket-copy">
                <strong>{{ project.name }}</strong>
                <small>{{ project.description }}</small>
              </span>
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style>
.slidev-layout:has(.island-hackathon-closing) {
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

.slidev-page:has(.island-hackathon-closing),
#slideshow:has(.island-hackathon-closing) {
  background: #7dc395 !important;
}
</style>

<style scoped>
.island-hackathon-closing {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    linear-gradient(rgba(226, 244, 219, 0.12), rgba(226, 244, 219, 0.12)),
    url("/home_bg.svg") center / cover no-repeat,
    #7dc395;
  border-radius: 40px 35px 45px 38px / 38px 45px 35px 40px;
}

.closing-shell {
  position: relative;
  z-index: 1;
  width: min(86%, 920px);
  display: grid;
  gap: 0.7rem;
  color: #255f54;
}

.closing-ribbon {
  justify-self: center;
  padding: 0.38rem 1.15rem;
  color: #255f54;
  background: rgba(230, 251, 238, 0.9);
  border: 2px solid rgba(130, 213, 187, 0.52);
  border-radius: 999px;
  box-shadow:
    0 8px 18px rgba(29, 116, 99, 0.14),
    inset 0 -2px 0 rgba(130, 213, 187, 0.36);
  font-size: clamp(0.7rem, 1.15vw, 0.86rem);
  font-weight: 900;
  letter-spacing: 0.04em;
}

.closing-board {
  position: relative;
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  gap: 1.25rem;
  align-items: stretch;
  padding: 1.05rem;
  border-radius: 38px 34px 42px 32px / 34px 42px 32px 38px;
  background:
    linear-gradient(135deg, rgba(226, 248, 231, 0.95), rgba(247, 249, 217, 0.94));
  border: 3px solid rgba(255, 255, 255, 0.72);
  box-shadow:
    0 18px 34px rgba(29, 116, 99, 0.16),
    inset 0 -6px 0 rgba(130, 213, 187, 0.24);
}

.closing-board::before {
  content: "";
  position: absolute;
  inset: 0.6rem;
  border: 1.5px dashed rgba(29, 139, 117, 0.28);
  border-radius: 30px;
  pointer-events: none;
}

.closing-lead,
.credits-panel {
  position: relative;
  z-index: 1;
}

.closing-lead {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.9rem;
  min-width: 0;
  padding: 0.2rem 0.15rem 0.2rem 0.2rem;
  text-align: left;
}

.closing-kicker {
  width: fit-content;
  padding: 0.26rem 0.68rem;
  color: #127d6d;
  background: rgba(186, 245, 224, 0.78);
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.closing-title {
  margin: 0;
  color: #245f53;
  font-size: clamp(2rem, 4.6vw, 3.25rem);
  font-weight: 950;
  line-height: 0.98;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 0 rgba(255, 249, 214, 0.8);
}

.summary-note {
  display: grid;
  gap: 0.45rem;
  padding: 0.9rem 1rem 1rem;
  border-radius: 24px 22px 26px 20px / 22px 26px 20px 24px;
  background: rgba(255, 245, 199, 0.78);
  box-shadow: inset 5px 0 0 #1c9a84;
}

.summary-note span {
  color: #127d6d;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.summary-note p {
  margin: 0;
  color: #35584f;
  font-size: clamp(0.84rem, 1.42vw, 1rem);
  font-weight: 800;
  line-height: 1.58;
}

.credits-panel {
  display: grid;
  align-content: center;
  gap: 0.7rem;
  min-width: 0;
  padding: 0.2rem;
}

.credits-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  color: #245f53;
}

.credits-heading span {
  color: #127d6d;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.credits-heading strong {
  font-size: 0.98rem;
  font-weight: 950;
}

.credits-list {
  display: grid;
  gap: 0.58rem;
}

.credit-ticket {
  display: grid;
  grid-template-columns: 3.2rem 1fr;
  align-items: center;
  gap: 0.72rem;
  min-height: 4.5rem;
  padding: 0.74rem 0.86rem;
  color: #35584f;
  text-align: left;
  text-decoration: none;
  border-radius: 22px 20px 24px 18px / 20px 24px 18px 22px;
  background: rgba(255, 251, 226, 0.9);
  border: 2px solid rgba(130, 213, 187, 0.38);
  box-shadow:
    0 8px 16px rgba(29, 116, 99, 0.1),
    inset 0 -3px 0 rgba(130, 213, 187, 0.22);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.credit-ticket:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 20px rgba(29, 116, 99, 0.14),
    inset 0 -3px 0 rgba(130, 213, 187, 0.22);
}

.ticket-index {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  color: #f7f9d9;
  background: #008b78;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 950;
  box-shadow: inset 0 -3px 0 rgba(0, 90, 76, 0.45);
}

.ticket-copy {
  display: grid;
  gap: 0.22rem;
  min-width: 0;
}

.ticket-copy strong {
  overflow: hidden;
  color: #245f53;
  font-size: clamp(0.82rem, 1.35vw, 0.98rem);
  font-weight: 950;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ticket-copy small {
  color: #54746a;
  font-size: clamp(0.62rem, 1.05vw, 0.74rem);
  font-weight: 750;
  line-height: 1.38;
}
</style>

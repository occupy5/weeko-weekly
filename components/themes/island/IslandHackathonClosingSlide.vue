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
          <h1 class="closing-title">{{ title }}</h1>

          <div class="summary-note">
            <p>{{ summary }}</p>
          </div>
        </section>

        <section class="credits-panel">
          <div class="credits-heading">
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
  width: min(84%, 900px);
  display: grid;
  gap: 0.85rem;
  color: #255f54;
}

.closing-ribbon {
  justify-self: center;
  padding: 0.34rem 1.05rem;
  color: #255f54;
  background: rgba(230, 251, 238, 0.74);
  border: 1.5px solid rgba(130, 213, 187, 0.42);
  border-radius: 999px;
  box-shadow: 0 6px 14px rgba(29, 116, 99, 0.1);
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
  padding: 1.35rem 1.45rem;
  border-radius: 34px 30px 38px 30px / 30px 38px 30px 34px;
  background: rgba(239, 250, 227, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 16px 32px rgba(29, 116, 99, 0.14);
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
  gap: 0.75rem;
  min-width: 0;
  padding: 0.15rem 0.2rem 0.15rem 0;
  text-align: left;
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
  padding-left: 0.85rem;
  border-left: 5px solid #1c9a84;
}

.summary-note p {
  margin: 0;
  color: #35584f;
  font-size: clamp(0.82rem, 1.32vw, 0.95rem);
  font-weight: 800;
  line-height: 1.62;
}

.credits-panel {
  display: grid;
  align-content: center;
  gap: 0.8rem;
  min-width: 0;
  padding: 0.1rem 0;
}

.credits-heading {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: 1rem;
  color: #245f53;
}

.credits-heading strong {
  color: #127d6d;
  font-size: 0.78rem;
  font-weight: 950;
  letter-spacing: 0.12em;
}

.credits-list {
  display: grid;
  gap: 0.42rem;
}

.credit-ticket {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  align-items: center;
  gap: 0.7rem;
  min-height: 3.9rem;
  padding: 0.5rem 0;
  color: #35584f;
  text-align: left;
  text-decoration: none;
  border-bottom: 1px solid rgba(29, 139, 117, 0.18);
  transition: transform 180ms ease;
}

.credit-ticket:last-child {
  border-bottom: 0;
}

.credit-ticket:hover {
  transform: translateY(-2px);
}

.ticket-index {
  display: grid;
  place-items: center;
  width: 2.1rem;
  height: 2.1rem;
  color: #008b78;
  background: rgba(186, 245, 224, 0.82);
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 950;
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

<script setup lang="ts">
import SocialLinks from '../../core/SocialLinks.vue';

interface Props {
	title: string;
	subtitle?: string;
	author?: string;
	event?: string;
	social?: {
		github?: string;
		twitter?: string;
		linkedin?: string;
	};
}

const _props = withDefaults(defineProps<Props>(), {});
</script>

<template>
  <div class="island-cover animal-cursor-1CaqL">

    <div class="cover-content">

      <div v-if="subtitle" class="cover-subtitle-badge">{{ subtitle }}</div>

      <h1 class="cover-title">{{ title }}</h1>

      <div v-if="event || author" class="cover-meta">
        <span v-if="event" class="meta-pill">{{ event }}</span>
        <span v-if="event && author" class="separator">·</span>
        <span v-if="author" class="meta-pill">{{ author }}</span>
      </div>
    </div>

    <div v-if="social" class="cover-social">
      <SocialLinks
        :github="social.github"
        :twitter="social.twitter"
        :linkedin="social.linkedin"
        size="xl"
      />
    </div>
  </div>
</template>

<style>
.slidev-layout:has(.island-cover) {
  padding: 0 !important;
}
</style>

<style scoped>
.island-cover {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: 40px 35px 45px 38px / 38px 45px 35px 40px;
  overflow: hidden;
}

/* Decorative floating circles */
.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
  pointer-events: none;
}

.deco-circle-1 {
  width: 160px;
  height: 160px;
  background: var(--nook-yellow, #f7cd67);
  top: 8%;
  right: 10%;
  animation: float 6s ease-in-out infinite;
}

.deco-circle-2 {
  width: 100px;
  height: 100px;
  background: var(--nook-pink, #f8a6b2);
  bottom: 15%;
  left: 8%;
  animation: float 8s ease-in-out infinite 1s;
}

.deco-circle-3 {
  width: 60px;
  height: 60px;
  background: var(--nook-teal, #82d5bb);
  top: 20%;
  left: 15%;
  animation: float 7s ease-in-out infinite 0.5s;
}

/* Decorative leaf */
.deco-leaf {
  position: absolute;
  bottom: 12%;
  right: 12%;
  width: 56px;
  height: 56px;
  fill: var(--nook-green, #8ac68a);
  opacity: 0.2;
  transform: rotate(-15deg);
  animation: float 5s ease-in-out infinite 0.3s;
  pointer-events: none;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
}

.cover-content {
  text-align: center;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cover-subtitle-badge {
  display: inline-block;
  font-size: clamp(0.85rem, 1.4vw, 1rem);
  font-weight: 600;
  color: var(--nook-brown, #725d42);
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(8px);
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 12px rgba(61, 52, 40, 0.08);
  letter-spacing: 0.02em;
}

.cover-title {
  font-size: clamp(2.4rem, 5.5vw, 4rem);
  font-weight: 800;
  line-height: 1.15;
  color: rgb(255, 249, 230);
  text-shadow:
    0 2px 0 rgba(0, 0, 0, 0.15),
    0 4px 8px rgba(0, 0, 0, 0.25),
    0 8px 24px rgba(0, 0, 0, 0.15);
  margin: 0;
  letter-spacing: -0.02em;
}

.cover-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: clamp(0.9rem, 1.6vw, 1.05rem);
  font-weight: 600;
  color: rgba(255, 249, 230, 0.9);
  margin-top: 0.25rem;
}

.meta-pill {
  display: inline-block;
  padding: 0.35rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 50px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.separator {
  color: rgba(255, 249, 230, 0.7);
  font-weight: 700;
}

.cover-social {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
}
</style>

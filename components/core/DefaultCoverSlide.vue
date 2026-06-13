<script setup lang="ts">
import SocialLinks from '../core/SocialLinks.vue';

interface Props {
	title: string;
	subtitle?: string;
	event?: string;
	author?: string;
	social?: {
		github?: string;
		twitter?: string;
		linkedin?: string;
	};
	gradient?: boolean;
}

withDefaults(defineProps<Props>(), {
	gradient: true,
});
</script>

<template>
  <div class="cover-slide">
    <div class="cover-content">
      <h1 class="cover-title">
        {{ title }}
      </h1>

      <div v-if="subtitle" class="cover-subtitle">
        {{ subtitle }}
      </div>

      <div v-if="event || author" class="cover-meta">
        <span v-if="event">{{ event }}</span>
        <span v-if="event && author" class="separator">/</span>
        <span v-if="author">{{ author }}</span>
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
.slidev-layout:has(.cover-slide) {
  padding: 0 !important;
}
</style>

<style scoped>
.cover-slide {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.cover-content {
  text-align: center;
}

.cover-title {
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.cover-subtitle {
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  font-weight: 400;
  line-height: 1.8;
  color: var(--color-text-muted);
  margin-top: 1rem;
}

.cover-meta {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  color: var(--color-text-muted);
  margin-top: 2rem;
}

.separator {
  margin: 0 0.5rem;
  color: var(--color-text-muted);
}

.cover-social {
  margin-top: 2rem;
}
</style>

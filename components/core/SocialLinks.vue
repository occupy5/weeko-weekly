<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	github?: string;
	twitter?: string;
	linkedin?: string;
	size?: string;
	gap?: number;
}

const props = withDefaults(defineProps<Props>(), {
	size: '2xl',
	gap: 2,
});

const sizeClass = computed(() => `text-${props.size}`);
const gapClass = computed(() => `gap-${props.gap}`);
</script>

<template>
  <div class="social-links flex" :class="[gapClass, sizeClass]">
    <a
      v-if="github"
      :href="`https://github.com/${github}`"
      target="_blank"
      rel="noopener noreferrer"
      class="social-link"
      aria-label="GitHub profile"
    >
      <carbon-logo-github />
    </a>
    <a
      v-if="twitter"
      :href="`https://x.com/${twitter}`"
      target="_blank"
      rel="noopener noreferrer"
      class="social-link"
      aria-label="Twitter/X profile"
    >
      <carbon-logo-twitter />
    </a>
    <a
      v-if="linkedin"
      :href="`https://linkedin.com/in/${linkedin}`"
      target="_blank"
      rel="noopener noreferrer"
      class="social-link"
      aria-label="LinkedIn profile"
    >
      <carbon-logo-linkedin />
    </a>
  </div>
</template>

<style scoped>
.social-links a {
  transition: all 0.25s ease;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 10px;
  font-weight: 500;
}

.social-link:hover {
  color: var(--color-secondary);
  transform: translateY(-2px);
}

.social-link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
  box-shadow: 0 0 0 4px var(--focus-ring);
}
</style>
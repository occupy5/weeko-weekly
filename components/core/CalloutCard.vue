<script setup lang="ts">
interface Props {
	title?: string;
	color?: string;
}

withDefaults(defineProps<Props>(), {
	title: '',
	color: 'default',
});
</script>

<template>
  <div class="callout-card" :class="[`callout-${color}`]">
    <h3 v-if="title">{{ title }}</h3>
    <slot />
  </div>
</template>

<style scoped>
.callout-card {
  background: linear-gradient(135deg,
    color-mix(in oklch, var(--color-primary) 15%, var(--color-bg)) 0%,
    color-mix(in oklch, var(--color-accent) 10%, var(--color-bg-soft)) 100%
  );
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border-left: 4px solid var(--color-primary);
  margin: 1.5rem 0;
}

.callout-card h3 {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.callout-card :deep(p) {
  font-family: var(--font-body);
  line-height: 1.6;
}
</style>
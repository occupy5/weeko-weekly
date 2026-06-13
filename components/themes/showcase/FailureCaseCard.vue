<script setup lang="ts">
interface Props {
	icon: string;
	title: string;
	highlight?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="failure-case" role="note" :aria-label="`Example: ${title}`">
    <div class="failure-header">
      <span class="failure-icon" aria-hidden="true">{{ icon }}</span>
      <span class="failure-title">{{ title }}</span>
    </div>
    <div class="failure-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.failure-case {
  background: var(--failure-bg);
  border: 1px solid var(--failure-border);
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  margin: 0.4rem 0;
}

.failure-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
  font-weight: 600;
  font-size: 0.85rem;
}

.failure-icon {
  font-size: 1rem;
  line-height: 1;
}

.failure-title {
  color: var(--color-text);
}

.failure-content {
  font-size: 0.8rem;
  line-height: 1.6;
  color: var(--failure-content-text);
}

.failure-content :deep(.highlight) {
  color: var(--failure-highlight);
  font-weight: 500;
}

.failure-content :deep(.chat-bubble) {
  background: var(--failure-chat-bg);
  border-radius: 8px;
  padding: 0.4rem 0.6rem;
  margin: 0.3rem 0;
  border-left: 2px solid var(--failure-chat-border);
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.failure-content :deep(.error-mark) {
  color: var(--failure-highlight);
  font-weight: 600;
  font-size: 0.7rem;
  margin-left: 0.3rem;
}

.failure-content :deep(code) {
  background: var(--color-code-bg);
  color: var(--color-code-text);
  padding: 0.15rem 0.3rem;
  border-radius: 3px;
  font-size: 0.7rem;
}
</style>
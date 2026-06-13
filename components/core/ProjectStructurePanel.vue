<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface Props {
	title?: string;
	maxHeight?: string;
	autoScroll?: boolean;
	scrollSpeed?: number;
}

const props = withDefaults(defineProps<Props>(), {
	title: '项目结构',
	maxHeight: '100vh',
	autoScroll: false,
	scrollSpeed: 30,
});

const scrollContainer = ref<HTMLElement | null>(null);
const isHovered = ref(false);

onMounted(() => {
	if (props.autoScroll && scrollContainer.value) {
		const container = scrollContainer.value;
		let animationId: number;
		let scrollTop = 0;
		let direction = 1;

		const animate = () => {
			if (!isHovered.value) {
				scrollTop += direction * 0.5;
				container.scrollTop = scrollTop;

				if (scrollTop >= container.scrollHeight - container.clientHeight) {
					direction = -1;
				} else if (scrollTop <= 0) {
					direction = 1;
				}
			}
			animationId = requestAnimationFrame(animate);
		};

		animate();

		onUnmounted(() => {
			cancelAnimationFrame(animationId);
		});
	}
});
</script>

<template>
  <div class="structure-wrapper" role="region" aria-label="Project structure">
    <div 
      ref="scrollContainer"
      class="structure-content"
      :style="{ maxHeight }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.structure-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.structure-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text);
  line-height: 1.3;
}

.structure-content {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.25rem 1.35rem;
  background:
    linear-gradient(180deg,
      color-mix(in oklch, var(--structure-bg) 88%, white 12%) 0%,
      var(--structure-bg) 100%
    );
  border: 0;
  border-radius: 20px;
  box-shadow:
    0 14px 30px oklch(0.25 0.04 55 / 0.10),
    inset 0 0 0 1px color-mix(in oklch, var(--structure-border) 72%, transparent);
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 0.75rem;
  line-height: 1.6;
  scroll-behavior: smooth;
  flex: 1;
  min-height: 0;
}

.structure-content:hover {
  box-shadow:
    0 16px 34px oklch(0.25 0.04 55 / 0.12),
    inset 0 0 0 1px color-mix(in oklch, var(--color-primary) 36%, var(--structure-border));
}

.structure-content::-webkit-scrollbar {
  width: 8px;
}

.structure-content::-webkit-scrollbar-track {
  background: transparent;
  margin: 8px 0;
}

.structure-content::-webkit-scrollbar-thumb {
  background: var(--structure-scrollbar-thumb);
  border-radius: 4px;
  transition: background 0.2s;
}

.structure-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

.structure-content :deep(pre) {
  background: transparent;
  border: 0 !important;
  box-shadow: none !important;
  margin: 0;
  padding: 0;
  font-size: inherit;
  line-height: inherit;
  color: var(--structure-file-text);
  text-align: left;
  white-space: pre;
}

.structure-content :deep(code) {
  background: transparent;
  border: 0 !important;
  box-shadow: none !important;
  color: var(--color-text);
  text-align: left;
}

.structure-content :deep(.slidev-code-wrapper) {
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  margin: 0;
  padding: 0;
}

.structure-content :deep(.shiki) {
  background: transparent !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  color: var(--structure-file-text) !important;
  padding: 0 !important;
}

.structure-content :deep(.shiki span) {
  color: inherit !important;
}

.structure-content :deep(.comment) {
  color: var(--color-text-muted);
  font-style: italic;
}

.structure-content :deep(.directory) {
  color: var(--color-primary);
  font-weight: 600;
}

.structure-content :deep(.file) {
  color: var(--structure-file-text);
}

.scroll-indicator {
  margin-top: 0.5rem;
  text-align: center;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.structure-content:hover + .scroll-indicator,
.scroll-indicator:hover {
  opacity: 1;
}

.scroll-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>

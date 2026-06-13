<script setup lang="ts">
interface Props {
	icon: string;
	title: string;
	step: number;
	total?: number;
	variant?: 'default' | 'compact' | 'highlight';
}

const _props = withDefaults(defineProps<Props>(), {
	total: undefined,
	variant: 'default',
});

const _svgContent: Record<string, string> = {
	cycle:
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4V1L8 5l4 4V6a6 6 0 016 6 6 6 0 01-6 6 6 6 0 01-6-6H4a8 8 0 008 8 8 8 0 008-8 8 8 0 00-8-8z"/></svg>',
	webapp:
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="8" x2="21" y2="8" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="5.5" r="0.5" fill="currentColor"/><circle cx="8" cy="5.5" r="0.5" fill="currentColor"/></svg>',
	globe:
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="1.5"/></svg>',
	schedule:
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><polyline points="12 7 12 12 15 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
	fork: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="6" cy="6" r="2" fill="currentColor"/><circle cx="6" cy="18" r="2" fill="currentColor"/><circle cx="18" cy="6" r="2" fill="currentColor"/><line x1="6" y1="8" x2="6" y2="16" stroke="currentColor" stroke-width="1.5"/><line x1="6" y1="6" x2="18" y2="6" stroke="currentColor" stroke-width="1.5"/><line x1="18" y1="6" x2="18" y2="12" stroke="currentColor" stroke-width="1.5"/></svg>',
	server:
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="11" width="16" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="18" width="16" height="3" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="16" cy="6.5" r="0.5" fill="currentColor"/><circle cx="16" cy="13.5" r="0.5" fill="currentColor"/></svg>',
};
</script>

<template>
  <div class="feature-showcase" :class="`variant-${variant}`" role="region" :aria-label="total ? `${title} - Step ${step} of ${total}` : `${title} - Step ${step}`">
    <header class="feature-header">
      <div class="step-pentagon">
        <span class="step-value">{{ step }}</span>
        <span class="step-label">STEP</span>
      </div>
      
      <div class="header-body">
        <!-- <div class="icon-line" v-html="svgContent[icon]" aria-hidden="true" /> -->
        <h2 class="feature-title">{{ title }}</h2>
      </div>
      
      <!-- <div class="total-badge" aria-hidden="true">
        of {{ total }}
      </div> -->
    </header>
    
    <div class="feature-body">
      <slot />
    </div>
    
    <footer v-if="total" class="feature-footer">
      <div class="progress-sequence">
        <span
          v-for="n in total"
          :key="n"
          class="progress-dot"
          :class="{ active: n <= step, current: n === step }"
        />
      </div>
    </footer>
  </div>
</template>

<style scoped>
.feature-showcase {
  --pentagon-bg: var(--color-primary);
  --pentagon-text: var(--color-bg);
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  padding: 0;
}

.feature-showcase.variant-compact {
  gap: clamp(1rem, 2vw, 1.5rem);
}

.feature-showcase.variant-highlight {
  --pentagon-bg: var(--color-accent);
}

.feature-showcase.variant-compact .feature-header {
  padding-bottom: 0.75rem;
}

header.feature-header {
  display: flex;
  align-items: flex-start;
  gap: clamp(1rem, 2vw, 1.5rem);
  padding-bottom: clamp(1.25rem, 2.5vw, 1.75rem);
  position: relative;
}

.feature-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    var(--color-primary) 0%,
    color-mix(in oklch, var(--color-primary) 30%, transparent) 40%,
    transparent 100%
  );
}

.step-pentagon {
  width: clamp(4rem, 6vw, 5rem);
  height: clamp(4.5rem, 6.5vw, 5.5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--pentagon-bg);
  color: var(--pentagon-text);
  clip-path: polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%);
  flex-shrink: 0;
}

.step-value {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: clamp(1.75rem, 3.5vw, 2.25rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
}

.step-label {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: clamp(0.55rem, 1vw, 0.65rem);
  font-weight: 500;
  letter-spacing: 0.08em;
  opacity: 0.85;
  margin-top: 0.15rem;
}

.header-body {
  flex: 1;
  min-width: 0;
  display: flex;
  align-self: center;
  flex-direction: column;
  gap: 0.4rem;
  padding-top: 0.5rem;
}

.icon-line {
  width: clamp(1.25rem, 2vw, 1.5rem);
  height: clamp(1.25rem, 2vw, 1.5rem);
  color: var(--color-text-muted);
  opacity: 0.7;
}

.icon-line :deep(svg) {
  width: 100%;
  height: 100%;
}

.feature-title {
  font-size: clamp(1.5rem, 3.2vw, 2.1rem);
  font-weight: 700;
  margin: 0;
  color: var(--color-text);
  line-height: 1.3;
}

.total-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.7rem, 1.2vw, 0.8rem);
  color: var(--color-text-muted);
  opacity: 0.5;
  letter-spacing: 0.02em;
  padding-top: 0.5rem;
}

.feature-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.feature-body :deep(.feature-grid) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2.5rem, 4vw, 3.5rem);
  align-items: start;
}

.feature-body :deep(.feature-main) {
  font-size: clamp(1rem, 1.7vw, 1.15rem);
  line-height: 1.75;
  color: var(--color-text);
}

.feature-body :deep(.feature-main p) {
  margin: 0 0 1rem 0;
}

.feature-body :deep(.feature-main strong) {
  font-weight: 600;
  color: var(--color-text);
}

.feature-body :deep(.feature-highlight) {
  padding: clamp(0.75rem, 1.25vw, 1rem) clamp(1rem, 1.5vw, 1.25rem);
  background: color-mix(in oklch, var(--color-primary) 6%, var(--color-bg));
  border-left: 2px solid var(--color-primary);
  font-size: clamp(0.85rem, 1.4vw, 0.95rem);
  line-height: 1.6;
  color: var(--color-text-muted);
  margin-top: 1rem;
}

.feature-body :deep(.feature-side) {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.feature-body :deep(.feature-tag) {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: clamp(0.45rem, 0.8vw, 0.55rem) 0;
  font-size: clamp(0.85rem, 1.3vw, 0.9rem);
  color: var(--color-text);
  border-bottom: 1px solid color-mix(in oklch, var(--color-primary) 12%, transparent);
}

.feature-body :deep(.feature-tag:last-child) {
  border-bottom: none;
}

.feature-body :deep(.feature-tag .tag-dot) {
  width: 6px;
  height: 6px;
  background: var(--color-primary);
  flex-shrink: 0;
}

.feature-body :deep(.feature-flow) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(0.35rem, 0.6vw, 0.45rem);
  margin-bottom: clamp(0.75rem, 1.2vw, 1rem);
  padding-bottom: clamp(0.6rem, 1vw, 0.75rem);
  border-bottom: 1px solid color-mix(in oklch, var(--color-primary) 12%, transparent);
}

.feature-body :deep(.flow-step) {
  padding: clamp(0.3rem, 0.5vw, 0.35rem) clamp(0.6rem, 1vw, 0.75rem);
  background: var(--color-text);
  color: var(--color-bg);
  font-size: clamp(0.7rem, 1.1vw, 0.75rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.feature-body :deep(.flow-arrow) {
  color: var(--color-primary);
  font-size: clamp(0.75rem, 1.2vw, 0.85rem);
  opacity: 0.55;
}

.feature-body :deep(.feature-platforms) {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(0.4rem, 0.7vw, 0.5rem);
  margin-bottom: clamp(0.6rem, 1vw, 0.75rem);
  padding-bottom: clamp(0.5rem, 0.9vw, 0.6rem);
  border-bottom: 1px solid color-mix(in oklch, var(--color-primary) 12%, transparent);
}

.feature-body :deep(.platform-badge) {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: clamp(0.25rem, 0.4vw, 0.3rem) clamp(0.5rem, 0.8vw, 0.6rem);
  background: transparent;
  border: 1px solid color-mix(in oklch, var(--color-primary) 18%, transparent);
  font-size: clamp(0.75rem, 1.1vw, 0.8rem);
  color: var(--color-text);
  font-weight: 500;
}

footer.feature-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: clamp(0.5rem, 1vw, 0.75rem);
}

.progress-sequence {
  display: flex;
  gap: clamp(0.5rem, 1vw, 0.75rem);
}

.progress-dot {
  width: clamp(8px, 1.2vw, 10px);
  height: clamp(8px, 1.2vw, 10px);
  background: color-mix(in oklch, var(--color-primary) 25%, transparent);
  transition: background 0.2s ease-out, transform 0.2s ease-out;
}

.progress-dot.active {
  background: color-mix(in oklch, var(--color-primary) 60%, transparent);
}

.progress-dot.current {
  background: var(--color-primary);
  transform: scale(1.3);
}

@media (max-width: 768px) {
  .feature-body :deep(.feature-grid) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .total-badge {
    display: none;
  }
}
</style>

<script setup lang="ts">
interface Props {
	variant?: 'leaf' | 'divider' | 'simple';
	color?: string;
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'leaf',
	color: '',
});
</script>

<template>
  <div
    v-if="variant === 'divider'"
    class="animal-divider-ZBhpE"
    :style="{ color: color || '#58b785' }"
  ></div>
  <div
    v-else-if="variant === 'simple'"
    class="leaf-divider-simple"
    :style="{ color: color || 'var(--color-accent, oklch(0.62 0.10 45))' }"
  >
    <div class="simple-line" />
    <svg class="leaf-icon-small" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.09,19.89 7.53,20 8,20C12.17,20 14.37,14.68 17,8M12,8C9.89,8.29 7.28,10.4 5.38,13.38C6.91,10.71 9.09,8.71 12,8Z"/>
    </svg>
    <div class="simple-line" />
  </div>
  <div
    v-else
    class="leaf-divider"
    :style="{ color: color || 'var(--color-primary, oklch(0.55 0.08 55))' }"
  >
    <svg class="leaf-icon leaf-icon-left" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.09,19.89 7.53,20 8,20C12.17,20 14.37,14.68 17,8M12,8C9.89,8.29 7.28,10.4 5.38,13.38C6.91,10.71 9.09,8.71 12,8Z"/>
    </svg>
    <div class="divider-line" />
    <svg class="leaf-icon leaf-icon-right" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.09,19.89 7.53,20 8,20C12.17,20 14.37,14.68 17,8M12,8C9.89,8.29 7.28,10.4 5.38,13.38C6.91,10.71 9.09,8.71 12,8Z"/>
    </svg>
  </div>
</template>

<style scoped>
.leaf-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  color: var(--color-primary, var(--animal-primary-color));
}

.leaf-icon-left {
  transform: scaleX(-1);
}

.divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--color-accent, oklch(0.62 0.10 45)) 0%,
    color-mix(in oklch, var(--color-accent, oklch(0.62 0.10 45)) 30%, transparent) 50%,
    var(--color-accent, oklch(0.62 0.10 45)) 100%
  );
  border-radius: 1px;
}

.leaf-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  filter: drop-shadow(0 0 3px rgba(88, 183, 133, 0.3));
}

.leaf-icon-right {
  transform: scaleX(-1);
}

.leaf-divider-simple {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.simple-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    currentColor 30%,
    currentColor 70%,
    transparent 100%
  );
  opacity: 0.6;
}

.leaf-icon-small {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.8;
}
</style>
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	cols?: number;
	gap?: string;
}

const props = withDefaults(defineProps<Props>(), {
	cols: 2,
	gap: '',
});

const gridClass = computed(() => {
	if (Number(props.cols) === 3) return 'cards-grid-3';
	return 'cards-grid-2';
});

const gapStyle = computed(() => {
	return props.gap ? `gap: ${props.gap}` : '';
});
</script>

<template>
  <div :class="gridClass" :style="gapStyle">
    <slot />
  </div>
</template>
<script setup lang="ts">
interface Props {
	type?: 'default' | 'title';
	color?:
		| 'default'
		| 'pink'
		| 'purple'
		| 'blue'
		| 'yellow'
		| 'orange'
		| 'teal'
		| 'green'
		| 'red'
		| 'lime'
		| 'yellow-green'
		| 'brown'
		| 'peach';
	padding?: string;
}

const props = withDefaults(defineProps<Props>(), {
	type: 'default',
	color: 'default',
	padding: undefined,
});

const pkgColorClass: Record<string, string> = {
	default: '',
	pink: 'animal-card-app-pink-3Eo8d',
	purple: 'animal-card-purple-Gq7sR',
	blue: 'animal-card-app-blue-GHH1a',
	yellow: 'animal-card-app-yellow-DWB-L',
	orange: 'animal-card-app-orange-V5yD7',
	teal: 'animal-card-app-teal-R5kFG',
	green: 'animal-card-app-green-xlNUs',
	red: 'animal-card-app-red-DzE0l',
	lime: 'animal-card-lime-green-KiJbe',
	'yellow-green': 'animal-card-yellow-green-4c-lF',
	brown: 'animal-card-brown-hLCrx',
	peach: 'animal-card-warm-peach-pink-RlSVo',
};

const pkgTypeClass: Record<string, string> = {
	default: 'animal-card-DJ515',
	title: 'animal-card-title-PL-WB',
};
</script>

<template>
  <div
    :class="[
      pkgTypeClass[type],
      pkgColorClass[color],
    ]"
    :style="[
      { boxShadow: '0 2px 6px rgba(107, 92, 67, 0.15)' },
      padding ? { padding } : {},
    ]"
  >
    <slot />
  </div>
</template>
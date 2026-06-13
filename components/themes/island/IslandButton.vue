<script setup lang="ts">
interface Props {
	type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
	size?: 'small' | 'middle' | 'large';
	danger?: boolean;
	ghost?: boolean;
	block?: boolean;
	loading?: boolean;
	disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	type: 'default',
	size: 'middle',
	danger: false,
	ghost: false,
	block: false,
	loading: false,
	disabled: false,
});

const pkgBtnClass: Record<string, string> = {
	primary: 'animal-btn-primary-9tMG9',
	default: 'animal-btn-default-L7yE6',
	dashed: 'animal-btn-dashed-wzZ-i',
	text: 'animal-btn-text-Tope4',
	link: 'animal-btn-link-pURnf',
};

const pkgSizeClass: Record<string, string> = {
	small: 'animal-btn-small-6Srsd',
	middle: 'animal-btn-middle-zEXqv',
	large: 'animal-btn-large-k9IvA',
};
</script>

<template>
  <button
    :class="[
      'animal-btn-QoKe1',
      pkgBtnClass[type],
      pkgSizeClass[size],
      { 'animal-btn-danger-zQ4kF': danger },
      { 'animal-btn-ghost-Ykty4': ghost },
      { 'animal-btn-block-MC4pp': block },
      { 'animal-btn-loading-PfXLM': loading },
    ]"
    :disabled="disabled || loading"
  >
    <slot />
  </button>
</template>
<script setup lang="ts">
interface TechItem {
	name: string;
	desc: string;
}

interface Props {
	title?: string;
	items?: TechItem[];
}

withDefaults(defineProps<Props>(), {
	title: '',
	items: () => [],
});
</script>

<template>
  <div class="tech-list">
    <h3 v-if="title">{{ title }}</h3>
    <ul v-if="items.length">
      <li v-for="item in items" :key="item.name">
        <strong>{{ item.name }}</strong> — {{ item.desc }}
      </li>
    </ul>
    <slot v-else />
  </div>
</template>

<style scoped>
.tech-list h3 {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
  font-size: clamp(1rem, 1.6vw, 1.1rem);
}

.tech-list ul {
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.tech-list li {
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 1.4vw, 0.95rem);
  line-height: 1.6;
  padding-left: 0;
}
</style>
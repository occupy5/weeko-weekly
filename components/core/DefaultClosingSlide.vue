<script setup lang="ts">
interface Props {
	repoUrl?: string;
	repoName?: string;
	subtitle?: string;
}

withDefaults(defineProps<Props>(), {
	repoUrl: '',
	repoName: '',
	subtitle: '每周精选有价值的技术项目',
});
</script>

<template>
  <div class="closing-slide">
    <h1 class="closing-title gradient-heading">感谢观看</h1>
    <div class="closing-subtitle">{{ subtitle }}</div>
    <a v-if="repoUrl" :href="repoUrl" target="_blank" class="closing-link">
      GitHub: {{ repoName }}
    </a>
  </div>
</template>

<style scoped>
.closing-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  width: 100%;
}

.closing-title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
}

.closing-subtitle {
  font-size: clamp(1rem, 1.6vw, 1.1rem);
  color: var(--color-text-muted);
}

.closing-link {
  font-size: clamp(0.9rem, 1.4vw, 1rem);
  color: var(--color-primary);
  font-weight: 600;
  margin-top: 1rem;
}
</style>
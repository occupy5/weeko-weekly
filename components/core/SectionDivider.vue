<script setup lang="ts">
interface Props {
	title: string;
	subtitle?: string;
}

withDefaults(defineProps<Props>(), {
	subtitle: '',
});
</script>

<template>
  <div class="section-divider">
    <h1 class="section-divider-title gradient-heading">
      {{ title }}
    </h1>
    <div v-if="subtitle" class="section-divider-subtitle">
      {{ subtitle }}
    </div>
  </div>
</template>

<style scoped>
.section-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  width: 100%;
}

.section-divider-title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 700;
  line-height: 1.25;
}

.section-divider-subtitle {
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  font-weight: 400;
  line-height: 1.8;
  color: var(--color-text-muted);
}
</style>
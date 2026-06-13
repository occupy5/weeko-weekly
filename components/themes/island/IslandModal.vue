<script setup lang="ts">
interface Props {
	open?: boolean;
	title?: string;
	width?: number;
	closable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	open: false,
	title: '',
	width: 520,
	closable: true,
});

const emit = defineEmits<{
	close: [];
	ok: [];
}>();
</script>

<template>
  <Teleport to="body">
    <Transition name="island-modal">
      <div v-if="open" class="island-modal-overlay" @click.self="emit('close')">
        <div
          class="island-modal-container leaf-cursor"
          :style="{ width: `${width}px` }"
        >
          <div v-if="closable" class="island-modal-close" @click="emit('close')">
            <svg viewBox="0 0 12 12" width="14" height="14">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>

          <div v-if="title" class="island-modal-title">{{ title }}</div>

          <div class="island-modal-body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="island-modal-footer">
            <slot name="footer" />
          </div>

          <div v-else class="island-modal-footer">
            <button class="island-modal-btn-cancel press-3d" @click="emit('close')">取消</button>
            <button class="island-modal-btn-ok press-3d" @click="emit('ok')">确认</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.island-modal-overlay {
  position: fixed;
  inset: 0;
  background: oklch(0.20 0.04 50 / 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.island-modal-container {
  position: relative;
  background: var(--color-bg);
  border-radius: 40px 35px 45px 38px / 38px 45px 35px 40px;
  padding: 2rem 2.5rem 1.5rem;
  box-shadow: 0 8px 24px oklch(0.30 0.04 50 / 0.14);
  max-height: 80vh;
  overflow: auto;
}

.island-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.island-modal-close:hover {
  background: color-mix(in oklch, var(--color-primary) 10%, transparent);
}

.island-modal-title {
  font-size: clamp(1.2rem, 2.6vw, 1.6rem);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.island-modal-body {
  color: var(--color-text);
  line-height: 1.8;
  font-size: clamp(1rem, 1.8vw, 1.15rem);
}

.island-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.island-modal-btn-cancel {
  background: var(--color-bg-soft);
  color: var(--color-text);
  padding: 6px 20px;
  font-weight: 500;
  font-size: 0.95rem;
}

.island-modal-btn-ok {
  background: var(--color-primary);
  color: var(--color-bg);
  padding: 6px 20px;
  font-weight: 600;
  font-size: 0.95rem;
}

.island-modal-enter-active {
  transition: opacity 0.3s ease;
}

.island-modal-leave-active {
  transition: opacity 0.2s ease;
}

.island-modal-enter-from,
.island-modal-leave-to {
  opacity: 0;
}

.island-modal-enter-active .island-modal-container {
  transition: transform 0.3s ease;
}

.island-modal-leave-active .island-modal-container {
  transition: transform 0.2s ease;
}

.island-modal-enter-from .island-modal-container {
  transform: scale(0.95) translateY(10px);
}

.island-modal-leave-to .island-modal-container {
  transform: scale(0.95) translateY(-5px);
}
</style>
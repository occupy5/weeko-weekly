<script setup lang="ts">
interface Props {
	screenshot: string;
	contract: string;
	explorerUrl: string;
	meta?: string;
	contractLabel?: string;
	screenshotAlt?: string;
}

withDefaults(defineProps<Props>(), {
	meta: '',
	contractLabel: 'BASE SEPOLIA CONTRACT',
	screenshotAlt: 'Weeko dApp live page',
});
</script>

<template>
  <div class="island-dapp-proof">
    <div v-click="1" class="island-dapp-shot">
      <img :src="screenshot" :alt="screenshotAlt" />
    </div>
    <div class="island-dapp-side">
      <div v-click="2" class="island-dapp-contract">
        <span>{{ contractLabel }}</span>
        <a :href="explorerUrl" target="_blank" rel="noopener noreferrer">{{ contract }}</a>
        <small v-if="meta">{{ meta }}</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.island-dapp-proof {
  display: grid;
  grid-template-columns: 1.34fr 0.66fr;
  gap: 0.9rem;
  align-items: stretch;
  margin-top: 0.7rem;
}

.island-dapp-shot,
.island-dapp-contract {
  overflow: hidden;
  border: 4px solid color-mix(in oklch, white 72%, var(--nook-yellow));
  border-radius: 24px;
  background: color-mix(in oklch, white 86%, var(--nook-yellow));
  box-shadow: 0 14px 30px oklch(0.36 0.04 80 / 0.13);
}

.island-dapp-shot {
  height: 21.7rem;
}

.island-dapp-shot img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.island-dapp-side {
  display: flex;
  align-items: flex-start;
  min-width: 0;
}

.island-dapp-contract {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 5.7rem;
  padding: 0.72rem 0.9rem;
  border-radius: 22px 26px 20px 24px;
  background: color-mix(in oklch, var(--nook-green) 34%, white);
}

.island-dapp-contract span {
  color: var(--color-primary);
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.island-dapp-contract a {
  margin-top: 0.25rem;
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 0.56rem;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
  text-decoration: none;
}

.island-dapp-contract small {
  margin-top: 0.34rem;
  color: var(--color-text-muted);
  font-size: 0.55rem;
  font-weight: 700;
}
</style>

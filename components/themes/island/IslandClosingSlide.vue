<script setup lang="ts">
interface Props {
	repoUrl?: string;
	repoName?: string;
	subtitle?: string;
}

withDefaults(defineProps<Props>(), {
	repoUrl: '',
	repoName: '',
	subtitle: '关注 Weeko 周报，每周精选有价值的技术项目',
});
</script>

<template>
  <div class="island-closing animal-cursor-1CaqL">
     <div class="closing-content">
       <h1 class="closing-title">感谢观看</h1>
       <div class="closing-subtitle-pill">{{ subtitle }}</div>
       <a v-if="repoUrl" :href="repoUrl" target="_blank" class="closing-link-pill">
         <svg class="gh-icon" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
           <path fill=" currentColor" fill-rule="evenodd" clip-rule="evenodd"
             d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.06 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.386-3.05 1.52-5.162 2.775-6.352-9.725-1.085-19.932-4.867-19.932-21.675 0-4.782 1.683-8.692 4.448-11.744-.45-1.085-1.936-5.457.43-11.36 0 0 3.63-1.14 11.945 4.49 3.474-.977 7.19-1.466 10.88-1.466 3.695 0 7.405.49 10.886 1.466 8.307-5.63 11.936-4.49 11.936-4.49 2.368 5.904.875 10.276.422 11.36 2.758 3.052 4.445 6.962 4.445 11.744 0 16.876-10.21 20.563-19.944 21.63 1.568 1.34 3.01 3.946 3.01 7.954 0 5.742-.052 10.375-.052 11.788 0 1.317.896 2.852 3.334 2.362C83.992 89.39 98 70.954 98 49.217c0-27.217-21.838-49.217-48.855-49.217z"/>
         </svg>
         {{ repoName }}
       </a>
     </div>
   </div>
</template>

<style>
.slidev-layout:has(.island-closing) {
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}
</style>

<style scoped>
.island-closing {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: 40px 35px 45px 38px / 38px 45px 35px 40px;
  overflow: hidden;
}

.closing-deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
  pointer-events: none;
}

.closing-deco-1 {
  width: 160px;
  height: 160px;
  background: var(--nook-yellow, #f7cd67);
  top: 8%;
  right: 10%;
  animation: closing-float 6s ease-in-out infinite;
}

.closing-deco-2 {
  width: 100px;
  height: 100px;
  background: var(--nook-pink, #f8a6b2);
  bottom: 15%;
  left: 8%;
  animation: closing-float 8s ease-in-out infinite 1s;
}

.closing-deco-3 {
  width: 60px;
  height: 60px;
  background: var(--nook-teal, #82d5bb);
  top: 20%;
  left: 15%;
  animation: closing-float 7s ease-in-out infinite 0.5s;
}

@keyframes closing-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
}

.closing-content {
  text-align: center;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.closing-title {
  font-size: clamp(2.4rem, 5.5vw, 4rem);
  font-weight: 800;
  line-height: 1.15;
  color: rgb(255, 249, 230);
  text-shadow:
    0 2px 0 rgba(0, 0, 0, 0.15),
    0 4px 8px rgba(0, 0, 0, 0.25),
    0 8px 24px rgba(0, 0, 0, 0.15);
  margin: 0;
  letter-spacing: -0.02em;
}

.closing-subtitle-pill {
  font-size: clamp(0.85rem, 1.4vw, 1rem);
  font-weight: 600;
  color: var(--nook-brown, #725d42);
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(8px);
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 12px rgba(61, 52, 40, 0.08);
}

.closing-link-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.9rem, 1.6vw, 1.05rem);
  font-weight: 600;
  color: rgba(255, 249, 230, 0.9);
  padding: 0.45rem 1.4rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 50px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  text-decoration: none;
}

.gh-icon {
  width: 1.1em;
  height: 1.1em;
  opacity: 0.9;
}
</style>

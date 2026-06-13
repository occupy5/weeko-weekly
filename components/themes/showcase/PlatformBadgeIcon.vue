<script setup lang="ts">
interface Props {
	icon: string;
}

const _props = defineProps<Props>();

const _svgContent: Record<string, string> = {
	telegram:
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M16 19a6.99 6.99 0 0 1-5.833-3.129l1.666-1.107a5 5 0 0 0 8.334 0l1.666 1.107A6.99 6.99 0 0 1 16 19m4-11a2 2 0 1 0 2 2a1.98 1.98 0 0 0-2-2m-8 0a2 2 0 1 0 2 2a1.98 1.98 0 0 0-2-2"/><path fill="currentColor" d="M17.736 30L16 29l4-7h6a1.997 1.997 0 0 0 2-2V6a1.997 1.997 0 0 0-2-2H6a1.997 1.997 0 0 0-2 2v14a1.997 1.997 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-4.835Z"/></svg>',
	discord:
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M25.7 7.1Q23 5.9 20 5.3h-.1c-.2.4-.5 1-.7 1.5c-2.2-.3-4.3-.3-6.4 0c-.2-.5-.5-1-.7-1.5H12q-3 .45-5.7 1.8C2.7 12.5 1.7 17.8 2.2 23v.1c2.4 1.8 4.7 2.8 7 3.5h.1c.5-.7 1-1.5 1.4-2.3v-.1c-.8-.3-1.5-.6-2.2-1c-.1 0-.1-.1 0-.1c.1-.1.3-.2.4-.3H9c4.6 2.1 9.5 2.1 14.1 0h.1c.1.1.3.2.4.3c.1 0 0 .1 0 .1c-.7.4-1.4.8-2.2 1c0 0-.1.1 0 .1c.4.8.9 1.6 1.4 2.3h.1c2.3-.7 4.6-1.8 7-3.5V23c.6-6-1-11.2-4.2-15.9M11.4 19.9c-1.4 0-2.5-1.3-2.5-2.8s1.1-2.8 2.5-2.8s2.5 1.3 2.5 2.8s-1.1 2.8-2.5 2.8m9.3 0c-1.4 0-2.5-1.3-2.5-2.8s1.1-2.8 2.5-2.8s2.5 1.3 2.5 2.8s-1.1 2.8-2.5 2.8"/></svg>',
	slack:
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M9.042 19.166a2.521 2.521 0 1 1-2.52-2.521h2.52zm1.27 0a2.521 2.521 0 0 1 5.043 0v6.313a2.521 2.521 0 1 1-5.042 0zm2.522-10.124a2.521 2.521 0 1 1 2.521-2.52v2.52zm0 1.27a2.521 2.521 0 0 1 0 5.043H6.52a2.521 2.521 0 1 1 0-5.042zm10.124 2.522a2.521 2.521 0 1 1 2.52 2.521h-2.52zm-1.27 0a2.521 2.521 0 0 1-5.043 0V6.52a2.521 2.521 0 1 1 5.042 0zm-2.522 10.124a2.521 2.521 0 1 1-2.521 2.52v-2.52zm0-1.27a2.521 2.521 0 0 1 0-5.043h6.313a2.521 2.521 0 1 1 0 5.042z"/></svg>',
	whatsapp:
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M23 7h4v4h-4zm0 6h4v4h-4zm-6-6h4v4h-4zm0 6h4v4h-4z"/><circle cx="14.5" cy="24.5" r="1.5" fill="currentColor"/><path fill="currentColor" d="M21 30H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h13v2H8v24h13v-8h2v8a2 2 0 0 1-2 2"/></svg>',
	signal:
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M15 12h2v18h-2zm-3.67 6.22a7 7 0 0 1 0-10.44l1.34 1.49a5 5 0 0 0 0 7.46zm9.34 0l-1.34-1.49a5 5 0 0 0 0-7.46l1.34-1.49a7 7 0 0 1 0 10.44"/><path fill="currentColor" d="M8.4 21.8a11 11 0 0 1 0-17.6l1.2 1.6a9 9 0 0 0 0 14.4zm15.2 0l-1.2-1.6a9 9 0 0 0 0-14.4l1.2-1.6a11 11 0 0 1 0 17.6"/></svg>',
	cli: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M26 4.01H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-20a2 2 0 0 0-2-2m0 2v4H6v-4Zm-20 20v-14h20v14Z"/><path fill="currentColor" d="m10.76 16.18l2.82 2.83l-2.82 2.83l1.41 1.41l4.24-4.24l-4.24-4.24z"/></svg>',
	docker:
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M17 13V6H8v16h16v-9Zm-7-5h5v5h-5Zm0 7h5v5h-5Zm12 5h-5v-5h5Z"/><path fill="currentColor" d="M28 11h-9V2h9zm-7-2h5V4h-5zm7 11h-2v2h2v6H4v-6h2v-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2"/><circle cx="7" cy="25" r="1" fill="currentColor"/></svg>',
	ssh: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="9" cy="26" r="1" fill="currentColor"/><path fill="currentColor" d="M26 22h-5v2h5v4H6v-4h9c1.1 0 2-.9 2-2v-9.17l2.59 2.59L21 14l-5-5l-5 5l1.41 1.41L15 12.83V22H6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2"/></svg>',
	daytona:
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M25.829 13.116A10.02 10.02 0 0 0 16 5v2a8.02 8.02 0 0 1 7.865 6.493l.259 1.346l1.349.245A5.502 5.502 0 0 1 24.508 26H16v2h8.508a7.502 7.502 0 0 0 1.32-14.884M8 24h6v2H8zm-4 0h2v2H4zm2-4h8v2H6zm-4 0h2v2H2zm6-4h6v2H8zm-4 0h2v2H4zm6-4h4v2h-4zm-4 0h2v2H6zm6-4h2v2h-2z"/></svg>',
	singularity:
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M30 24v-2h-2.1c-.1-.6-.4-1.2-.7-1.8l1.5-1.5l-1.4-1.4l-1.5 1.5c-.5-.3-1.1-.6-1.8-.7V16h-2v2.1c-.6.1-1.2.4-1.8.7l-1.5-1.5l-1.4 1.4l1.5 1.5c-.3.5-.6 1.1-.7 1.8H16v2h2.1c.1.6.4 1.2.7 1.8l-1.5 1.5l1.4 1.4l1.5-1.5c.5.3 1.1.6 1.8.7V30h2v-2.1c.6-.1 1.2-.4 1.8-.7l1.5 1.5l1.4-1.4l-1.5-1.5c.3-.5.6-1.1.7-1.8zm-7 2c-1.7 0-3-1.3-3-3s1.3-3 3-3s3 1.3 3 3s-1.3 3-3 3"/><path fill="currentColor" d="M14 28H6c-1.103 0-2-.897-2-2V6c0-1.103.897-2 2-2h20c1.103 0 2 .897 2 2v8h-2V6H6v20h8z"/></svg>',
	modal:
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M16 7a7.7 7.7 0 0 1 1.51.15a8 8 0 0 1 6.35 6.34l.26 1.35l1.35.24a5.5 5.5 0 0 1-1 10.92H7.5a5.5 5.5 0 0 1-1-10.92l1.34-.24l.26-1.35A8 8 0 0 1 16 7m0-2a10 10 0 0 0-9.83 8.12A7.5 7.5 0 0 0 7.49 28h17a7.5 7.5 0 0 0 1.32-14.88a10 10 0 0 0-7.94-7.94A10.3 10.3 0 0 0 16 5"/></svg>',
	local:
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M8 4v4H4V4zM2 2v8h8V2zm16 5v4h-4V7zm-6-2v8h8V5zM8 16v4H4v-4zm-6-2v8h8v-8z"/><path fill="currentColor" d="M22 10v6h-6v6h-6v8h20V10Zm-4 8h4v4h-4Zm-2 10h-4v-4h4Zm6 0h-4v-4h4Zm6 0h-4v-4h4Zm0-6h-4v-4h4Zm-4-6v-4h4v4Z"/></svg>',
	voice:
		'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M23 14v3a7 7 0 0 1-14 0v-3H7v3a9 9 0 0 0 8 8.94V28h-4v2h10v-2h-4v-2.06A9 9 0 0 0 25 17v-3Z"/><path fill="currentColor" d="M16 22a5 5 0 0 0 5-5V7a5 5 0 0 0-10 0v10a5 5 0 0 0 5 5M13 7a3 3 0 0 1 6 0v10a3 3 0 0 1-6 0Z"/></svg>',
};
</script>

<template>
  <span class="badge-icon" v-html="svgContent[props.icon] || ''" />
</template>

<style scoped>
.badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  color: var(--color-primary);
}

.badge-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>

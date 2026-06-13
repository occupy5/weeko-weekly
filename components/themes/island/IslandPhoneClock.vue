<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface Props {
	className?: string;
}

const props = withDefaults(defineProps<Props>(), {
	className: '',
});

const timeDisplay = ref('');
const weekday = ref('');
const monthDate = ref('');

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function updateTime() {
	const now = new Date();
	weekday.value = weekdays[now.getDay()];
	const month = months[now.getMonth()];
	const date = now.getDate();
	monthDate.value = `${month} ${date}`;
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	timeDisplay.value = `${hours}:${minutes}`;
}

let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
	updateTime();
	timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
	if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="animal-cursor-1CaqL" :class="className">
    <div class="animal-acDatetime-hVKh7">
      <div class="animal-acDate-rhO3k">
        <span class="animal-acWeekday-bxDHR">{{ weekday }}</span>
        <span class="animal-acMonthday-1jUmX">{{ monthDate }}</span>
      </div>
      <div class="animal-acTime-S-twb">
        <span>{{ timeDisplay.slice(0, 2) }}</span>
        <span class="animal-acColon-g4vuJ">:</span>
        <span>{{ timeDisplay.slice(3) }}</span>
      </div>
    </div>
  </div>
</template>
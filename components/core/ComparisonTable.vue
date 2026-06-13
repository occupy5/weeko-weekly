<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	headers: string[];
	rows: (string | boolean)[][];
	highlightCol?: number;
}

const props = withDefaults(defineProps<Props>(), {
	highlightCol: -1,
});

const processedRows = computed(() => {
	return props.rows.map((row) =>
		row.map((cell) => {
			if (cell === true) return { text: '✅', isBoolean: true, isTrue: true };
			if (cell === false) return { text: '❌', isBoolean: true, isTrue: false };
			return { text: String(cell), isBoolean: false, isTrue: false };
		}),
	);
});

const isHighlightCol = (colIndex: number) => {
	return props.highlightCol > 0 && colIndex === props.highlightCol;
};
</script>

<template>
  <table class="comparison-table">
    <thead>
      <tr>
        <th
          v-for="(header, idx) in headers"
          :key="idx"
          :class="{ 'comparison-highlight-col': isHighlightCol(idx) }"
        >
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIdx) in processedRows" :key="rowIdx">
        <td
          v-for="(cell, colIdx) in row"
          :key="colIdx"
          :class="{
            'comparison-highlight-col': isHighlightCol(colIdx),
            'comparison-boolean': cell.isBoolean,
            'comparison-true': cell.isTrue,
            'comparison-false': !cell.isTrue && cell.isBoolean,
          }"
        >
          {{ cell.text }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.comparison-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 0.5rem 0;
  border-radius: 12px;
  overflow: hidden;
  font-size: clamp(0.8rem, 1.4vw, 0.95rem);
}

.comparison-highlight-col {
  background: color-mix(in oklch, var(--color-accent) 8%, transparent);
  font-weight: 600;
}

.comparison-highlight-col:hover {
  background: color-mix(in oklch, var(--color-accent) 12%, transparent);
}

.comparison-true {
  color: oklch(0.55 0.12 140);
}

.comparison-false {
  color: oklch(0.55 0.12 25);
}
</style>
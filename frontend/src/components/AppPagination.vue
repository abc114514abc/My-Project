<template>
  <nav v-if="totalPages > 1" class="pagination">
    <button :disabled="page <= 1" @click="$emit('change', page - 1)">‹ 上一页</button>

    <template v-for="p in pages" :key="p">
      <span v-if="p === '…'" class="pagination__ellipsis">…</span>
      <button v-else :class="{ active: p === page }" @click="$emit('change', p)">
        {{ p }}
      </button>
    </template>

    <button :disabled="page >= totalPages" @click="$emit('change', page + 1)">下一页 ›</button>
    <span class="pagination__total">共 {{ total }} 条</span>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  total: { type: Number, required: true },
});

defineEmits(['change']);

const pages = computed(() => {
  const total = props.totalPages;
  const current = props.page;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const result = [1];
  if (current > 3) result.push('…');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) result.push(i);

  if (current < total - 2) result.push('…');
  result.push(total);
  return result;
});
</script>

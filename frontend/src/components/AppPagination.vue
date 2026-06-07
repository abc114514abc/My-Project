<template>
  <nav v-if="totalPages > 1" class="pagination">
    <!-- 上一页 -->
    <button :disabled="page <= 1" @click="$emit('change', page - 1)">
      ‹ 上一页
    </button>

    <!-- 页码 -->
    <template v-for="p in pages" :key="p">
      <span v-if="p === '…'" class="ellipsis">…</span>
      <button
        v-else
        :class="{ active: p === page }"
        @click="$emit('change', p)"
      >
        {{ p }}
      </button>
    </template>

    <!-- 下一页 -->
    <button :disabled="page >= totalPages" @click="$emit('change', page + 1)">
      下一页 ›
    </button>

    <!-- 总数 -->
    <span class="total-info">共 {{ total }} 条</span>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

defineEmits(['change']);

const pages = computed(() => {
  const total = props.totalPages;
  const current = props.page;

  // 总页数 ≤ 7，全部显示
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // 超过 7 页，显示省略号
  const result = [1];

  if (current > 3) {
    result.push('…');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    result.push(i);
  }

  if (current < total - 2) {
    result.push('…');
  }

  result.push(total);

  return result;
});
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 28px;
}

.pagination button {
  padding: 8px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  color: #555;
}

.pagination button:hover:not(:disabled):not(.active) {
  border-color: #667eea;
  color: #667eea;
}

.pagination button.active {
  background: #667eea;
  color: #fff;
  border-color: #667eea;
}

.pagination button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.ellipsis {
  padding: 0 6px;
  color: #999;
}

.total-info {
  margin-left: 12px;
  font-size: 13px;
  color: #999;
}
</style>

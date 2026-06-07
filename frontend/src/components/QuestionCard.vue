<template>
  <article :class="['card', { 'card--expanded': expanded }]">
    <!-- 头部（可点击展开） -->
    <header class="card__header" @click="expanded = !expanded">
      <div class="card__title-row">
        <span :class="['badge', 'badge--' + question.difficulty]">
          {{ difficultyLabel }}
        </span>
        <h3 class="card__title">{{ question.title }}</h3>
        <span v-if="question.is_mistake" class="badge badge--mistake">错题</span>
      </div>

      <div class="card__meta">
        <span v-if="question.source" class="card__source">📎 {{ question.source }}</span>
        <time class="card__time">{{ formatDate(question.updated_at) }}</time>
        <span class="card__chevron">{{ expanded ? '▲' : '▼' }}</span>
      </div>
    </header>

    <!-- 展开内容 -->
    <section v-show="expanded" class="card__body" @click.stop>
      <!-- 标签行 -->
      <div class="card__tags">
        <span v-if="!question.tags || question.tags.length === 0" class="card__tags-empty">
          暂无标签
        </span>
        <span v-for="tag in question.tags" :key="tag.id" class="tag">
          {{ tag.name }}
        </span>
      </div>

      <!-- Markdown 渲染预览 -->
      <div class="card__content" v-html="htmlPreview"></div>

      <!-- 操作按钮 -->
      <footer class="card__actions">
        <button type="button" class="btn-action btn-action--danger" @click.stop="handleDelete">
          🗑 删除
        </button>
      </footer>
    </section>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue';
import { markdownToHtml } from '../utils/markdown';

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['delete']);

const expanded = ref(false);

const difficultyLabel = computed(() => {
  const map = { easy: '简单', medium: '中等', hard: '困难' };
  return map[props.question.difficulty] || '未知';
});

const htmlPreview = computed(() => {
  const text = props.question.content || '';
  const preview = text.length > 300 ? text.slice(0, 300) + '…' : text;
  return markdownToHtml(preview);
});

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('zh-CN');
}

function handleDelete() {
  if (confirm('确定删除这道题目吗？')) {
    emit('delete', props.question.id);
  }
}
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  padding: 18px 22px;
  margin-bottom: 10px;
  border: 1px solid #eee;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.card--expanded {
  border-color: #667eea;
}

/* 头部 */
.card__header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.card__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card__title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.card__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #999;
}

.card__chevron {
  font-size: 10px;
}

/* 展开区域 */
.card__body {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #f2f2f2;
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.card__tags-empty {
  font-size: 13px;
  color: #ccc;
}

.tag {
  font-size: 12px;
  background: #eef0ff;
  color: #667eea;
  padding: 4px 12px;
  border-radius: 20px;
}

/* Markdown 内容 */
.card__content {
  font-size: 14px;
  line-height: 1.75;
  color: #444;
}

.card__content :deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.card__content :deep(pre) {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 14px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}

.card__content :deep(h2),
.card__content :deep(h3),
.card__content :deep(h4) {
  margin: 10px 0 6px;
  color: #1a1a2e;
}

/* 操作按钮 */
.card__actions {
  margin-top: 14px;
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  color: #666;
}

.btn-action--danger:hover {
  border-color: #e74c3c;
  color: #e74c3c;
}

/* 徽标 */
.badge {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.badge--easy {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge--medium {
  background: #fff3e0;
  color: #e65100;
}

.badge--hard {
  background: #ffebee;
  color: #c62828;
}

.badge--mistake {
  background: #c62828;
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>

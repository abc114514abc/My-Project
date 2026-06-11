<template>
  <article :class="['question-card', { 'question-card--expanded': expanded }]">
    <header class="question-card__header">
      <div class="question-card__title-row">
        <span :class="['badge', 'badge--' + question.difficulty]">
          {{ difficultyLabel[question.difficulty] || '未知' }}
        </span>
        <router-link :to="'/questions/' + question.id" class="question-card__title">
          {{ question.title }}
        </router-link>
        <span v-if="question.is_mistake && store.isLoggedIn" class="badge badge--mistake">已收藏</span>
      </div>

      <div class="question-card__meta">
        <span v-if="question.source" class="question-card__source">{{ question.source }}</span>
        <time>{{ formatDate(question.updated_at) }}</time>
        <button type="button" class="question-card__toggle" @click="expanded = !expanded">
          {{ expanded ? '收起' : '展开' }}
        </button>
      </div>
    </header>

    <section v-show="expanded" class="question-card__body" @click.stop>
      <div class="question-card__tags">
        <span v-if="!question.tags || question.tags.length === 0" class="question-card__tags-empty">
          暂无标签
        </span>
        <span v-for="tag in question.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
      </div>

      <div class="question-card__content markdown-body" v-html="htmlPreview"></div>

      <footer class="question-card__actions">
        <router-link :to="'/questions/' + question.id" class="btn-action">查看详情</router-link>
        <template v-if="store.isLoggedIn">
          <router-link
            :to="'/questions/' + question.id + '/edit'"
            class="btn-action btn-action--primary"
          >
            编辑
          </router-link>
          <button
            type="button"
            class="btn-action"
            :class="{ 'btn-action--active': question.is_mistake }"
            @click.stop="handleToggleMistake"
          >
            {{ question.is_mistake ? '取消收藏' : '收藏' }}
          </button>
          <button type="button" class="btn-action btn-action--danger" @click.stop="handleDelete">
            删除
          </button>
        </template>
      </footer>
    </section>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue';
import { markdownToHtml } from '../utils/markdown';
import { questionAPI } from '../api/question';
import { useUserStore } from '../stores/user';
import { formatDate, difficultyLabel } from '../utils/format';

const store = useUserStore();

const props = defineProps({
  question: { type: Object, required: true },
});

const emit = defineEmits(['delete', 'refresh']);

const expanded = ref(false);

const htmlPreview = computed(() => {
  const text = props.question.content || '';
  const preview = text.length > 300 ? text.slice(0, 300) + '…' : text;
  return markdownToHtml(preview);
});

async function handleToggleMistake() {
  try {
    await questionAPI.toggleMistake(props.question.id);
    emit('refresh');
  } catch (err) {
    alert(err.message || '操作失败');
  }
}

function handleDelete() {
  if (confirm('确定删除这道题目吗？')) {
    emit('delete', props.question.id);
  }
}
</script>

<style scoped>
.question-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  margin-bottom: 10px;
  border: 1px solid var(--color-border);
  transition: box-shadow 0.2s, border-color 0.2s;
}

.question-card:hover {
  box-shadow: var(--shadow-sm);
}

.question-card--expanded {
  border-color: var(--color-primary);
}

.question-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.question-card__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.question-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.15s;
}

.question-card__title:hover {
  color: var(--color-primary);
}

.question-card__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.question-card__source {
  color: var(--color-text-secondary);
}

.question-card__toggle {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 12px;
  padding: 3px 10px;
  color: var(--color-text-muted);
  font-family: inherit;
}

.question-card__toggle:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.question-card__body {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.question-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.question-card__tags-empty {
  font-size: 13px;
  color: var(--color-text-muted);
}

.question-card__content {
  font-size: 14px;
}

.question-card__actions {
  margin-top: 14px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>

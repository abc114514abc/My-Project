<template>
  <article :class="['question-card', { 'question-card--expanded': expanded }]">
    <header class="question-card__header">
      <div class="question-card__title-row">
        <span :class="['badge', 'badge--' + question.difficulty]">
          {{ difficultyLabel[question.difficulty] || '未知' }}
        </span>
        <div class="question-card__text-wrap">
          <router-link :to="'/questions/' + question.id" class="question-card__title">
            {{ question.title }}
          </router-link>
          <div class="question-card__subline-wrap">
            <p class="question-card__subline">
              <span v-if="question.tags && question.tags.length" class="question-card__tag-chips">
                <span v-for="tag in question.tags.slice(0, 3)" :key="tag.id" class="question-card__tag-chip">{{ tag.name }}</span>
              </span>
              <span v-else class="question-card__tag-chips question-card__tag-chips--muted">
                <span class="question-card__tag-chip">暂无标签</span>
              </span>
            </p>
            <span v-if="question.source" class="question-card__source-inline">{{ question.source }}</span>
          </div>
        </div>
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
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.question-card__text-wrap {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  padding-right: 8px;
}

.question-card__title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.15s;
  line-height: 1.4;
}

.question-card__subline-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
  flex-wrap: wrap;
  width: auto;
  padding-top: 6px;
  border-top: 1px solid rgba(148, 163, 184, 0.35);
  max-width: 50%;
}

.question-card__subline {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.4;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 100%;
}

.question-card__tag-chips {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
}

.question-card__tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(148, 163, 184, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.18);
  color: var(--color-text-secondary);
  font-size: 11px;
  line-height: 1.4;
}

.question-card__tag-chips--muted .question-card__tag-chip {
  opacity: 0.85;
}

.question-card__source-inline {
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.4;
}

.question-card__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--color-text-muted);
  margin-left: 8px;
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

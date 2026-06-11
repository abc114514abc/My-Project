<template>
  <AppLayout>
    <div class="editor-page">
      <div v-if="loading" class="state">
        <div class="spinner"></div>
        <p>加载中<span class="loading-dots"></span></p>
      </div>

      <div v-else-if="loadError" class="state state--error">
        <p>{{ loadError }}</p>
        <div class="state__actions">
          <button class="btn btn-danger" @click="loadQuestion">重试</button>
          <router-link to="/questions" class="btn btn-outline">返回列表</router-link>
        </div>
      </div>

      <template v-else>
        <header class="editor__header">
          <router-link to="/questions" class="back-link">← 返回列表</router-link>
          <h2>{{ isEditMode ? '编辑题目' : '新增题目' }}</h2>
          <button
            v-if="isEditMode"
            type="button"
            class="btn-fav"
            :class="{ active: form.isMistake }"
            @click="handleToggleMistake"
          >
            {{ form.isMistake ? '取消收藏' : '收藏' }}
          </button>
        </header>

        <form class="editor__form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">题目标题 <span class="required">*</span></label>
            <input id="title" v-model="form.title" type="text" placeholder="例：Vue3 响应式原理" maxlength="200" />
            <span v-if="errors.title" class="field-error">{{ errors.title }}</span>
          </div>

          <div class="form-row">
            <div class="form-group form-group--half">
              <label for="difficulty">难度</label>
              <select id="difficulty" v-model="form.difficulty">
                <option value="easy">🟢 简单</option>
                <option value="medium">🟡 中等</option>
                <option value="hard">🔴 困难</option>
              </select>
            </div>
            <div class="form-group form-group--half">
              <label for="source">来源</label>
              <input id="source" v-model="form.source" type="text" placeholder="例：字节跳动一面 / LeetCode 1" maxlength="100" />
            </div>
          </div>

          <div class="form-group">
            <label>标签</label>
            <div class="tags-area">
              <div class="tags-selected">
                <span v-if="selectedTags.length === 0" class="tags-empty">暂未选择标签</span>
                <span v-for="tag in selectedTags" :key="tag.id" class="tag tag--selected">
                  {{ tag.name }}
                  <button type="button" class="tag-remove" @click="removeTag(tag.id)">✕</button>
                </span>
              </div>
              <div class="tags-add-row">
                <select v-model="selectedTagId" class="tag-select" @change="addTagFromSelect">
                  <option value="">选择已有标签...</option>
                  <option v-for="tag in availableTags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
                </select>
                <span class="tags-or">或</span>
                <input v-model="newTagName" type="text" placeholder="新标签名" class="tag-input" maxlength="50" @keyup.enter.prevent="createTag" />
                <button type="button" class="btn-tag-add" :disabled="!newTagName.trim()" @click="createTag">+ 创建</button>
              </div>
              <span v-if="errors.tags" class="field-error">{{ errors.tags }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="content">题目内容（Markdown）</label>
                        <div class="md-editor" :class="{ 'md-editor--preview-hidden': !showPreview }">
              <div class="md-editor__textarea-wrap">
                <textarea id="content" v-model="form.content" placeholder="支持 Markdown 语法" class="md-editor__textarea"></textarea>
                <button type="button" class="btn-toggle-preview-float" @click="showPreview = !showPreview" v-if="!showPreview">📖 显示预览</button>
              </div>
              <div class="md-editor__preview" v-show="showPreview">
                <div class="md-editor__preview-header">
                  <span class="md-editor__preview-label">预览</span>
                  <button type="button" class="btn-toggle-preview" @click="showPreview = !showPreview">隐藏</button>
                </div>
                <div class="md-editor__preview-content markdown-body" v-html="renderedMarkdown"></div>
              </div>
            </div>
          </div>

          <div v-if="submitError" class="error-msg">{{ submitError }}</div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? '保存中...' : (isEditMode ? '保存修改' : '创建题目') }}
            </button>
            <button v-if="isEditMode" type="button" class="btn btn-danger" @click="handleDelete">删除题目</button>
            <router-link to="/questions" class="btn btn-ghost">取消</router-link>
          </div>
        </form>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import AppLayout from '../components/AppLayout.vue';
import { questionAPI } from '../api/question';
import { tagAPI } from '../api/tag';

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!route.params.id);
const editId = computed(() => route.params.id || null);

const loading = ref(false);
const loadError = ref('');
const submitting = ref(false);
const submitError = ref('');
const showPreview = ref(false);

const form = reactive({
  title: '',
  difficulty: 'medium',
  source: '',
  content: '',
  isMistake: false,
});

const errors = reactive({ title: '', tags: '' });

const allTags = ref([]);
const selectedTags = ref([]);
const selectedTagId = ref('');
const newTagName = ref('');

const availableTags = computed(() => {
  const selectedIds = new Set(selectedTags.value.map(t => t.id));
  return allTags.value.filter(t => !selectedIds.has(t.id));
});

const renderedMarkdown = computed(() => {
  if (!form.content) return '<p style="color:#ccc;">输入内容后这里显示预览</p>';
  return DOMPurify.sanitize(marked.parse(form.content));
});

async function loadTags() {
  try {
    const data = await tagAPI.getList();
    allTags.value = data || [];
  } catch (err) {
    console.error('加载标签失败:', err);
  }
}

async function loadQuestion() {
  if (!isEditMode.value) return;
  loading.value = true;
  loadError.value = '';
  try {
    const data = await questionAPI.getById(editId.value);
    form.title = data.title;
    form.difficulty = data.difficulty;
    form.source = data.source || '';
    form.content = data.content || '';
    form.isMistake = data.is_mistake;
    selectedTags.value = (data.tags || []).map(t => ({ id: t.id, name: t.name }));
  } catch (err) {
    loadError.value = err.message || '加载题目失败';
  } finally {
    loading.value = false;
  }
}

onMounted(async () => { await loadTags(); await loadQuestion(); });

function addTagFromSelect() {
  const id = Number(selectedTagId.value);
  if (!id) return;
  const tag = allTags.value.find(t => t.id === id);
  if (!tag || selectedTags.value.some(t => t.id === id)) { selectedTagId.value = ''; return; }
  selectedTags.value.push({ id: tag.id, name: tag.name });
  selectedTagId.value = '';
}

async function createTag() {
  const name = newTagName.value.trim();
  if (!name || selectedTags.value.some(t => t.name === name)) { newTagName.value = ''; return; }
  try {
    const data = await tagAPI.create(name);
    const newTag = data || { id: Date.now(), name };
    allTags.value.push({ id: newTag.id, name: newTag.name, question_count: 0 });
    selectedTags.value.push({ id: newTag.id, name: newTag.name });
    newTagName.value = '';
  } catch (err) { alert(err.message || '创建标签失败'); }
}

function removeTag(tagId) { selectedTags.value = selectedTags.value.filter(t => t.id !== tagId); }

function validate() {
  let valid = true;
  if (!form.title.trim()) { errors.title = '请输入题目标题'; valid = false; } else { errors.title = ''; }
  errors.tags = '';
  return valid;
}

async function handleSubmit() {
  if (!validate()) return;
  submitting.value = true;
  submitError.value = '';
  const payload = { title: form.title.trim(), difficulty: form.difficulty, source: form.source.trim(), content: form.content, tagIds: selectedTags.value.map(t => t.id) };
  try {
    if (isEditMode.value) {
      const data = await questionAPI.update(editId.value, payload);
      router.push('/questions/' + data.id);
    } else {
      const data = await questionAPI.create(payload);
      router.push('/questions/' + data.id);
    }
  } catch (err) { submitError.value = err.message || '保存失败'; } finally { submitting.value = false; }
}

async function handleDelete() {
  if (!confirm('确定删除这道题目吗？')) return;
  try { await questionAPI.remove(editId.value); router.push('/questions'); } catch (err) { alert(err.message || '删除失败'); }
}

async function handleToggleMistake() {
  try { const data = await questionAPI.toggleMistake(editId.value); form.isMistake = data.is_mistake; } catch (err) { alert(err.message || '操作失败'); }
}
</script>

<style scoped>
.editor__header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.editor__header h2 {
  font-size: 22px;
  color: var(--color-text);
  flex: 1;
}

.btn-fav {
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-size: 13px;
  cursor: pointer;
  color: var(--color-text-secondary);
  font-family: inherit;
}

.btn-fav.active {
  background: var(--color-warning-bg);
  border-color: #f0d060;
  color: var(--color-warning);
}

.editor__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.editor__form .form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 0;
}

.editor__form .form-group label {
  font-weight: 600;
  color: var(--color-text);
}

.required { color: var(--color-danger); }
.field-error { font-size: 13px; color: var(--color-danger); margin-top: 2px; }
.form-row { display: flex; gap: 16px; }
.form-group--half { flex: 1; }

.tags-area {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 14px;
  background: var(--color-surface);
}

.tags-selected {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
  min-height: 28px;
}

.tags-empty { font-size: 13px; color: var(--color-text-muted); }

.tag--selected {
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
  color: var(--color-text-muted);
  padding: 0 2px;
}

.tag-remove:hover { color: var(--color-danger); }

.tags-add-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tag-select, .tag-input {
  flex: 1;
  min-width: 120px;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  outline: none;
  font-family: inherit;
}

.tags-or { font-size: 12px; color: var(--color-text-muted); }

.btn-tag-add {
  padding: 8px 14px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
}

.btn-tag-add:disabled { opacity: 0.4; cursor: not-allowed; }

.md-editor { display: flex; gap: 16px; min-height: 400px; }
.md-editor__textarea-wrap { flex: 1; position: relative; display: flex; }
.md-editor__textarea {
  flex: 1;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-family: var(--font-mono);
  line-height: 1.7;
  resize: vertical;
  min-height: 400px;
  outline: none;
}

.md-editor__textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(91, 110, 232, 0.12);
}

.btn-toggle-preview-float {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 14px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
}

.md-editor__preview {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #fafbfc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.md-editor__preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.md-editor__preview-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.btn-toggle-preview {
  padding: 4px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-size: 12px;
  cursor: pointer;
  color: var(--color-text-muted);
  font-family: inherit;
}

.md-editor__preview-content {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
}

.form-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

@media (max-width: 768px) {
  .md-editor { flex-direction: column; min-height: auto; }
  .md-editor__textarea { min-height: 250px; }
  .md-editor__preview { min-height: 250px; }
  .form-row { flex-direction: column; }
}
</style>

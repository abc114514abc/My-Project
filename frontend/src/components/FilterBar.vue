<template>
  <div class="filter-bar">
    <!-- 搜索框 -->
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索题目标题或内容..."
        @input="onKeywordInput"
      />
      <button v-if="keyword" class="clear-btn" @click="clearKeyword">✕</button>
    </div>

    <!-- 筛选条件 -->
    <div class="filters">
      <!-- 难度下拉 -->
      <select v-model="difficulty" @change="emitChange">
        <option value="">全部难度</option>
        <option value="easy">🟢 简单</option>
        <option value="medium">🟡 中等</option>
        <option value="hard">🔴 困难</option>
      </select>

      <!-- 标签下拉 -->
      <select v-model="tagId" @change="emitChange">
        <option value="">全部标签</option>
        <option v-for="tag in tags" :key="tag.id" :value="tag.id">
          {{ tag.name }} ({{ tag.question_count }})
        </option>
      </select>

      <!-- 仅看错题开关 -->
      <button
        type="button"
        :class="['toggle-btn', { active: isMistake }]"
        @click="toggleMistake"
      >
        ❌ 仅看错题
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { tagAPI } from '../api/tag';

const emit = defineEmits(['filter-change']);

const keyword = ref('');
const difficulty = ref('');
const tagId = ref('');
const isMistake = ref(false);
const tags = ref([]);

let timer = null;

function onKeywordInput() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    emitChange();
  }, 300);
}

function clearKeyword() {
  keyword.value = '';
  emitChange();
}

function toggleMistake() {
  isMistake.value = !isMistake.value;
  emitChange();
}

function emitChange() {
  emit('filter-change', {
    keyword: keyword.value,
    difficulty: difficulty.value,
    tagId: tagId.value,
    isMistake: isMistake.value,
  });
}

onMounted(async () => {
  try {
    const data = await tagAPI.getList();
    tags.value = data || [];
  } catch (err) {
    console.error('加载标签失败:', err);
    tags.value = [];
  }
});
</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

/* 搜索框 */
.search-box {
  position: relative;
  flex: 1;
  min-width: 220px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0.4;
  pointer-events: none;
}

.search-box input {
  width: 100%;
  padding: 10px 36px 10px 36px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
}

.clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 15px;
  color: #bbb;
  cursor: pointer;
  padding: 4px;
}

.clear-btn:hover {
  color: #555;
}

/* 筛选组 */
.filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

select {
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
  min-width: 130px;
  outline: none;
  transition: border-color 0.2s;
}

select:focus {
  border-color: #667eea;
}

/* 错题开关 */
.toggle-btn {
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  color: #666;
}

.toggle-btn.active {
  background: #fff0f0;
  border-color: #e74c3c;
  color: #e74c3c;
}
</style>

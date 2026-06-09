<template>
  <AppLayout>
    <div class="page">
      <header class="page__header">
        <h2>⭐ 收藏列表</h2>
        <span v-if="list.length" class="count">{{ list.length }} 题</span>
      </header>

      <div v-if="loading" class="state">加载中...</div>

      <div v-else-if="errorMsg" class="state state--error">
        <p>{{ errorMsg }}</p>
        <button class="btn-retry" @click="fetchList">重试</button>
      </div>

      <div v-else-if="list.length === 0" class="state">
        <p class="state__icon">⭐</p>
        <p>还没有收藏任何题目</p>
        <router-link to="/questions" class="btn-go">去浏览题目</router-link>
      </div>

      <template v-else>
        <div class="list">
          <article v-for="q in list" :key="q.id" class="fav-item">
            <div class="fav-item__main">
              <span :class="['badge-sm', 'badge-sm--' + q.difficulty]">
                {{ { easy: '简单', medium: '中等', hard: '困难' }[q.difficulty] }}
              </span>
              <router-link :to="'/questions/' + q.id" class="fav-item__title">
                {{ q.title }}
              </router-link>
              <span v-if="q.source" class="fav-item__source">📎 {{ q.source }}</span>
            </div>
            <div class="fav-item__tags">
              <span v-for="t in q.tags" :key="t.id" class="mini-tag">{{ t.name }}</span>
            </div>
            <button class="btn-unfav" @click="handleUnfavorite(q.id)">取消收藏</button>
          </article>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import { questionAPI } from '../api/question';

const list = ref([]);
const loading = ref(false);
const errorMsg = ref('');

async function fetchList() {
  loading.value = true;
  errorMsg.value = '';

  try {
    const data = await questionAPI.getList({ page: 1, pageSize: 100, isMistake: 'true' });
    list.value = data.list || [];
  } catch (err) {
    errorMsg.value = err.message || '加载失败';
  } finally {
    loading.value = false;
  }
}

async function handleUnfavorite(id) {
  try {
    await questionAPI.toggleMistake(id);
    list.value = list.value.filter(q => q.id !== id);
  } catch (err) {
    alert(err.message || '操作失败');
  }
}

onMounted(fetchList);
</script>

<style scoped>
.page__header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 22px;
}

.page__header h2 {
  font-size: 22px;
  color: #1a1a2e;
}

.count {
  font-size: 14px;
  color: #999;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fav-item {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.fav-item__main {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 200px;
}

.fav-item__title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  text-decoration: none;
}

.fav-item__title:hover {
  color: #667eea;
}

.fav-item__source {
  font-size: 12px;
  color: #bbb;
}

.fav-item__tags {
  display: flex;
  gap: 4px;
}

.mini-tag {
  font-size: 11px;
  background: #eef0ff;
  color: #667eea;
  padding: 2px 8px;
  border-radius: 10px;
}

.btn-unfav {
  padding: 6px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  font-size: 12px;
  cursor: pointer;
  color: #888;
  transition: all 0.15s;
}

.btn-unfav:hover {
  border-color: #e74c3c;
  color: #e74c3c;
}

.badge-sm {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
}

.badge-sm--easy { background: #e8f5e9; color: #2e7d32; }
.badge-sm--medium { background: #fff3e0; color: #e65100; }
.badge-sm--hard { background: #ffebee; color: #c62828; }

/* 状态 */
.state {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 12px;
  color: #999;
}

.state__icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.state--error {
  color: #e74c3c;
}

.btn-retry {
  margin-top: 12px;
  padding: 8px 20px;
  border: 1px solid #e74c3c;
  border-radius: 8px;
  background: #fff;
  color: #e74c3c;
  cursor: pointer;
}

.btn-go {
  margin-top: 14px;
  display: inline-block;
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}
</style>

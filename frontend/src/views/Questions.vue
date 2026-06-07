<template>
  <AppLayout>
    <div class="page">
      <!-- 头部：标题 + 新增按钮 -->
      <header class="page__header">
        <h2>📚 题目列表</h2>
        <router-link to="/questions/new" class="btn-add">+ 新增题目</router-link>
      </header>

      <!-- 筛选条 -->
      <FilterBar @filter-change="handleFilterChange" />

      <!-- 加载中 -->
      <div v-if="loading" class="state">
        <p>加载中...</p>
      </div>

      <!-- 加载出错 -->
      <div v-else-if="errorMsg" class="state state--error">
        <p>{{ errorMsg }}</p>
        <button class="btn-retry" @click="fetchList">重试</button>
      </div>

      <!-- 列表为空 -->
      <div v-else-if="list.length === 0" class="state">
        <p class="state__icon">📭</p>
        <p>还没有题目，点击右上角「新增题目」开始吧</p>
      </div>

      <!-- 题目列表 -->
      <template v-else>
        <QuestionCard
          v-for="item in list"
          :key="item.id"
          :question="item"
          @delete="handleDelete"
        />

        <AppPagination
          :page="pagination.page"
          :total-pages="pagination.totalPages"
          :total="pagination.total"
          @change="handlePageChange"
        />
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import FilterBar from '../components/FilterBar.vue';
import QuestionCard from '../components/QuestionCard.vue';
import AppPagination from '../components/AppPagination.vue';
import { questionAPI } from '../api/question';

// ── 数据状态 ──
const list = ref([]);
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
});
const loading = ref(false);
const errorMsg = ref('');

// ── 当前筛选条件 ──
let currentFilters = {};

// ── 请求数据 ──
async function fetchList() {
  loading.value = true;
  errorMsg.value = '';

  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...currentFilters,
    };

    // 有关键词走搜索接口，否则走列表接口
    const data = currentFilters.keyword
      ? await questionAPI.search(params)
      : await questionAPI.getList(params);

    list.value = data.list || [];
    pagination.page = data.pagination.page;
    pagination.pageSize = data.pagination.pageSize;
    pagination.total = data.pagination.total;
    pagination.totalPages = data.pagination.totalPages;
  } catch (err) {
    errorMsg.value = err.message || '加载失败';
  } finally {
    loading.value = false;
  }
}

// ── 筛选变化 ──
function handleFilterChange(filters) {
  currentFilters = { ...filters };
  pagination.page = 1; // 重置到第一页
  fetchList();
}

// ── 翻页 ──
function handlePageChange(page) {
  pagination.page = page;
  fetchList();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── 删除题目 ──
async function handleDelete(id) {
  try {
    await questionAPI.remove(id);
    fetchList();
  } catch (err) {
    alert(err.message || '删除失败');
  }
}

// ── 初始化 ──
onMounted(() => {
  fetchList();
});
</script>

<style scoped>
.page {
  /* 内容由 AppLayout 的 slot 包裹 */
  font-size: 15;
}

/* 头部 */
.page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.page__header h2 {
  font-size: 22px;
  color: #1a1a2e;
}

/* 新增按钮 */
.btn-add {
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: opacity 0.2s;
}

.btn-add:hover {
  opacity: 0.9;
}

/* 状态占位 */
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

/* 重试按钮 */
.btn-retry {
  margin-top: 12px;
  padding: 8px 20px;
  border: 1px solid #e74c3c;
  border-radius: 8px;
  background: #fff;
  color: #e74c3c;
  cursor: pointer;
}
</style>

<template>
  <AppLayout>
    <div class="profile-page">
      <h2>👤 个人中心</h2>

      <div class="profile-card">
        <div class="profile-avatar">{{ store.username[0]?.toUpperCase() }}</div>
        <div class="profile-info">
          <h3>{{ store.username }}</h3>
          <p class="profile-meta">用户 ID：{{ store.user?.id }}</p>
        </div>
      </div>

      <div class="stats-row" v-if="stats.total > 0">
        <div class="stat-box">
          <span class="stat-box__num">{{ stats.total }}</span>
          <span class="stat-box__label">总题目</span>
        </div>
        <div class="stat-box">
          <span class="stat-box__num">{{ stats.favorites }}</span>
          <span class="stat-box__label">收藏</span>
        </div>
        <div class="stat-box">
          <span class="stat-box__num">{{ stats.easy }}</span>
          <span class="stat-box__label">简单</span>
        </div>
        <div class="stat-box">
          <span class="stat-box__num">{{ stats.medium }}</span>
          <span class="stat-box__label">中等</span>
        </div>
        <div class="stat-box">
          <span class="stat-box__num">{{ stats.hard }}</span>
          <span class="stat-box__label">困难</span>
        </div>
      </div>

      <div v-if="stats.total === 0 && !loading" class="empty">
        <p>还没有题目，去添加第一道吧</p>
        <router-link to="/questions/new" class="btn-go">+ 新增题目</router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import { useUserStore } from '../stores/user';
import { questionAPI } from '../api/question';

const store = useUserStore();
const loading = ref(false);
const allQuestions = ref([]);

const stats = computed(() => {
  const list = allQuestions.value;
  return {
    total: list.length,
    favorites: list.filter(q => q.is_mistake).length,
    easy: list.filter(q => q.difficulty === 'easy').length,
    medium: list.filter(q => q.difficulty === 'medium').length,
    hard: list.filter(q => q.difficulty === 'hard').length,
  };
});

onMounted(async () => {
  loading.value = true;
  try {
    const data = await questionAPI.getList({ page: 1, pageSize: 500 });
    allQuestions.value = data.list || [];
  } catch (err) {
    console.error('加载统计失败:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.profile-page h2 {
  font-size: 22px;
  color: #1a1a2e;
  margin-bottom: 22px;
}

/* 个人信息卡片 */
.profile-card {
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}

.profile-info h3 {
  font-size: 20px;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.profile-meta {
  font-size: 13px;
  color: #999;
}

/* 统计 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.stat-box {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-box__num {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-box__label {
  font-size: 13px;
  color: #999;
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  color: #999;
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

@media (max-width: 640px) {
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

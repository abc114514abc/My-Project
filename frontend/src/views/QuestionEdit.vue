<template>
  <AppLayout>
    <div class="placeholder">
      <p>📝 编辑器将在 Day4 实现</p>
      <router-link to="/questions" class="back-link">← 返回题目列表</router-link>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue';
</script>

<style scoped>
.placeholder {
  text-align: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 12px;
  color: #999;
  font-size: 16px;
}

.back-link {
  display: inline-block;
  margin-top: 16px;
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  text-decoration: underline;
}
</style>

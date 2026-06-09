<template>
  <AppLayout>
    <div class="random-page">
      <div v-if="loading" class="state">抽题中...</div>

      <div v-else-if="errorMsg" class="state state--error">
        <p>{{ errorMsg }}</p>
        <button class="btn-retry" @click="pickRandom">再抽一次</button>
        <router-link to="/questions" class="back-link">浏览题库</router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import { questionAPI } from '../api/question';

const router = useRouter();
const loading = ref(true);
const errorMsg = ref('');

async function pickRandom() {
  loading.value = true;
  errorMsg.value = '';

  try {
    const data = await questionAPI.getList({ page: 1, pageSize: 1000 });
    const list = data.list || [];

    if (list.length === 0) {
      errorMsg.value = '题库中还没有题目';
      loading.value = false;
      return;
    }

    const randomIndex = Math.floor(Math.random() * list.length);
    router.replace('/questions/' + list[randomIndex].id);
  } catch (err) {
    errorMsg.value = err.message || '出错了';
    loading.value = false;
  }
}

onMounted(pickRandom);
</script>

<style scoped>
.random-page {
  /* 容器 */
}

.state {
  text-align: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 12px;
  color: #999;
  font-size: 16px;
}

.state--error {
  color: #e74c3c;
}

.btn-retry {
  margin-top: 14px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
}

.back-link {
  display: inline-block;
  margin-top: 12px;
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
}
</style>

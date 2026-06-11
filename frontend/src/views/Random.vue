<template>
  <AppLayout>
    <div class="random-page">
      <div v-if="loading" class="state">
        <div class="spinner"></div>
        <p>正在随机抽题<span class="loading-dots"></span></p>
      </div>

      <div v-else-if="errorMsg" class="state state--error">
        <p>{{ errorMsg }}</p>
        <div class="state__actions">
          <button class="btn btn-primary" @click="pickRandom">再抽一次</button>
          <router-link to="/questions" class="btn btn-outline">浏览题库</router-link>
        </div>
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

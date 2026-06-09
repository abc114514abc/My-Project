<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="navbar-inner">
        <router-link to="/" class="navbar-brand">📚 面试知识库</router-link>

        <div class="navbar-links">
          <!-- 公开链接 -->
          <router-link to="/" class="navbar-link" exact-active-class="active">首页</router-link>
          <router-link to="/questions" class="navbar-link" active-class="active">浏览题目</router-link>
          <router-link to="/random" class="navbar-link">随机一题</router-link>

          <!-- 仅登录可见 -->
          <template v-if="store.isLoggedIn">
            <router-link to="/favorites" class="navbar-link" active-class="active">⭐ 收藏</router-link>
            <router-link to="/profile" class="navbar-link" active-class="active">👤 {{ store.username }}</router-link>
          </template>

          <!-- 未登录 -->
          <template v-else>
            <router-link to="/login" class="navbar-link navbar-link--auth">登录</router-link>
            <router-link to="/register" class="navbar-link navbar-link--auth register-link">注册</router-link>
          </template>

          <!-- 退出（登录可见） -->
          <button v-if="store.isLoggedIn" class="btn-logout" @click="handleLogout">退出</button>
        </div>
      </div>
    </nav>

    <!-- 内容区 -->
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const store = useUserStore();
const router = useRouter();

function handleLogout() {
  store.logout();
  router.push('/');
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 导航栏 */
.navbar {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 28px;
}

.navbar-brand {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
  margin-right: auto;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.navbar-link {
  padding: 8px 16px;
  font-size: 14px;
  color: #555;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.15s;
  white-space: nowrap;
}

.navbar-link:hover {
  background: #f0f2ff;
  color: #667eea;
}

.navbar-link.active,
.navbar-link.exact-active {
  background: #eef0ff;
  color: #667eea;
  font-weight: 600;
}

.navbar-link--auth {
  border: 1px solid #e0e0e0;
}

.register-link {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border: none;
}

.register-link:hover {
  opacity: 0.9;
  color: #fff;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.btn-logout {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  color: #888;
  margin-left: 6px;
  transition: all 0.15s;
}

.btn-logout:hover {
  border-color: #e74c3c;
  color: #e74c3c;
}

/* 内容区 */
.main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 28px 24px 60px;
}
</style>


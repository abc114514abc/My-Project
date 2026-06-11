<template>
  <div class="layout">
    <nav class="navbar">
      <div class="navbar__inner">
        <router-link to="/" class="navbar__brand">面试知识库</router-link>

        <button class="navbar__toggle" @click="menuOpen = !menuOpen" aria-label="菜单">
          <span></span><span></span><span></span>
        </button>

        <div :class="['navbar__links', { 'navbar__links--open': menuOpen }]">
          <router-link to="/" class="navbar__link" exact-active-class="navbar__link--active" @click="menuOpen = false">首页</router-link>
          <router-link to="/questions" class="navbar__link" active-class="navbar__link--active" @click="menuOpen = false">浏览题目</router-link>
          <router-link to="/random" class="navbar__link" active-class="navbar__link--active" @click="menuOpen = false">随机一题</router-link>

          <template v-if="store.isLoggedIn">
            <router-link to="/favorites" class="navbar__link" active-class="navbar__link--active" @click="menuOpen = false">收藏</router-link>
            <router-link to="/profile" class="navbar__link" active-class="navbar__link--active" @click="menuOpen = false">{{ store.username }}</router-link>
            <button class="btn btn-ghost btn-sm navbar__logout" @click="handleLogout">退出</button>
          </template>

          <template v-else>
            <router-link to="/login" class="btn btn-ghost btn-sm" @click="menuOpen = false">登录</router-link>
            <router-link to="/register" class="btn btn-primary btn-sm" @click="menuOpen = false">注册</router-link>
          </template>
        </div>
      </div>
    </nav>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <p>面试知识库 · 整理你的面试笔记</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const store = useUserStore();
const router = useRouter();
const menuOpen = ref(false);

function handleLogout() {
  store.logout();
  menuOpen.value = false;
  router.push('/');
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.navbar {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-page);
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar__brand {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  margin-right: auto;
}

.navbar__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.navbar__toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text);
  border-radius: 1px;
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.navbar__link {
  padding: 7px 14px;
  font-size: 14px;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all 0.15s;
  white-space: nowrap;
}

.navbar__link:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.navbar__link--active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

.navbar__logout {
  margin-left: 4px;
}

.main {
  flex: 1;
  max-width: var(--max-width);
  width: 100%;
  margin: 0 auto;
  padding: 28px var(--spacing-page) 40px;
}

.footer {
  text-align: center;
  padding: 20px;
  font-size: 13px;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

@media (max-width: 768px) {
  .navbar__toggle {
    display: flex;
  }

  .navbar__links {
    display: none;
    position: absolute;
    top: var(--navbar-height);
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    padding: 12px var(--spacing-page) 16px;
    gap: 4px;
    box-shadow: var(--shadow-md);
  }

  .navbar__links--open {
    display: flex;
  }

  .navbar__link,
  .navbar__links .btn {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}
</style>

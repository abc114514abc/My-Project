import { createRouter, createWebHistory } from 'vue-router';

// 定义页面路由；登录/注册设为访客页，仪表盘需要登录权限。
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
];

// 创建 Vue Router 实例，并启用浏览器 history 模式。
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫：
// 1. 需要登录的页面未登录时，跳转到登录页。
// 2. 登录/注册页已登录时，跳转到仪表盘。
// 3. 其他页面正常放行。
router.beforeEach((to) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' };
  }

  if (to.meta.guest && token) {
    return { name: 'Dashboard' };
  }

  return true;
});

export default router;


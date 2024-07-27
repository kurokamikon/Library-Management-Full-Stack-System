const routes = [
  { path: '/', component: () => import('../views/login/index.vue') },
  { path: '/login', component: () => import('../views/login/index.vue') },
  { path: '/register', component: () => import('../views/register/index.vue') },
  { path: '/home', component: () => import('../views/home/index.vue'), meta: { requiresAuth: true } }
];

export default routes;

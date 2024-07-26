const routes = [
  { path: '/', component: () => import('../views/login/index.vue') },
  { path: '/login', component: () => import('../views/login/index.vue') },
  { path: '/register', component: () => import('../views/register/index.vue') }
];

export default routes;

const routes = [
  { path: '/', component: () => import('../views/login/index.vue') },
  { path: '/login', component: () => import('../views/login/index.vue') },
  { path: '/register', component: () => import('../views/register/index.vue') },
  {
    path: '/home',
    component: () => import('../views/home/index.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/home/borrow',
        component: () => import('@/components/home/borrow.vue')
      },
      {
        path: '/home/return',
        component: () => import('@/components/home/return.vue')
      },
      {
        path: '/home/recharge',
        component: () => import('@/components/home/recharge.vue')
      },
      {
        path: '/home/add',
        component: () => import('@/components/home/add.vue')
      },
      {
        path: '/home/input',
        component: () => import('@/components/home/input.vue')
      }
    ]
  }
];

export default routes;

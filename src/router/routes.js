const asyncRoutes = [
  {
    path: '/home',
    component: () => import('../views/home/index.vue'),
    meta: { roles: ['user', 'admin'] },
    children: [
      {
        path: 'borrow',
        component: () => import('@/components/home/borrow.vue'),
        meta: { roles: ['user', 'admin'] }
      },
      {
        path: 'return',
        component: () => import('@/components/home/return.vue'),
        meta: { roles: ['user', 'admin'] }
      },
      {
        path: 'recharge',
        component: () => import('@/components/home/recharge.vue'),
        meta: { roles: ['user', 'admin'] }
      },
      {
        path: 'add',
        component: () => import('@/components/home/add.vue'),
        meta: { roles: ['admin'] }
      },
      {
        path: 'input',
        component: () => import('@/components/home/input.vue'),
        meta: { roles: ['admin'] }
      }
    ]
  }
];

const constantRoutes = [
  { path: '/', component: () => import('../views/login/index.vue') },
  { path: '/login', component: () => import('../views/login/index.vue') },
  { path: '/register', component: () => import('../views/register/index.vue') },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404/index.vue')
  }
];

export { constantRoutes, asyncRoutes };

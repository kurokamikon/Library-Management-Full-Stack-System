import { createRouter, createWebHistory } from 'vue-router';
import { Axios } from '../utils/request.js';
import { constantRoutes, asyncRoutes } from './routes';
import { state, userMethods } from '@/store/userState';
import Toast from 'primevue/toast';
import { toRaw } from 'vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
});

const token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null;
function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role);
  }
  return true;
}

function filterAsyncRoutes(routes, role) {
  const res = [];
  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(role, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role);
      }
      res.push(tmp);
    }
  });
  return res;
}

function isConstantRoute(path) {
  return constantRoutes.some((route) => route.path === path);
}

async function getRoles() {
  const response = await Axios({
    method: 'post',
    url: '/getRoles',
    data: { _id: state.user.id }
  });
  return response.message;
}

export async function setupRoutes() {
  if (state.isLoggedIn && state.matchRoutes.length === 0) {
    const gotRoles = await getRoles();
    const accessedRoutes = filterAsyncRoutes(asyncRoutes, gotRoles);
    userMethods.setRouter(accessedRoutes);
    accessedRoutes.forEach((route) => {
      router.addRoute(route);
    });
    return true;
  }
  return false;
}

router.beforeEach(async (to, from, next) => {
  if (!state.isLoggedIn && !isConstantRoute(to.path)) {
    return next('/login');
  }
  const routesAdded = await setupRoutes();
  if (routesAdded) {
    next({ ...to, replace: true });
  } else {
    next();
  }
});

export default router;

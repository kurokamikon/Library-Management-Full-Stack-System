import { Axios } from '../utils/request.js';
import { asyncRoutes } from './routes';
import Toast from 'primevue/toast';
const asyncRoutesAdded = false;
async function verifyToken(token) {
  try {
    const response = await Axios({
      method: 'post',
      url: '/api/verify-token',
      data: { token }
    });
    return response.data.valid;
  } catch (error) {
    return false;
  }
}
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
export async function beforeEach(to, from, next) {
  const token = localStorage.getItem('token');
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !from.matched.some((record) => record.meta.requiresAuth)
  ) {
    if (!token) {
      return next({ path: '/login' });
    }
    try {
      // 发送 token 到后端进行验证
      const isValid = await verifyToken(token);
      if (!isValid) {
        localStorage.removeItem('token');
        return next({ path: '/login' });
      } else {
        next();
      }
    } catch (error) {
      localStorage.removeItem('token');
      next({ path: '/login' });
    }
  } else {
    console.log(666);
    next(); // 不需要验证的路由或在已认证的路由内部跳转，直接允许
  }
}

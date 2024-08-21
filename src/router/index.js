import { createRouter, createWebHistory } from 'vue-router';
import { constantRoutes } from './routes';
import { beforeEach } from './guards';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
});
router.beforeEach(beforeEach);
export default router;

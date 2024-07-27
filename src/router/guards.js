export async function beforeEach(to, from, next) {
  const token = localStorage.getItem('token');

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (token) {
      try {
        // 发送 token 到后端进行验证
        const response = await Axios.post('/verify-token', { token });
        if (response.data.valid) {
          next(); // token 有效，允许跳转
        } else {
          localStorage.removeItem('sessionToken'); // token 无效，移除并重定向到登录页面
          next({ path: '/login' });
        }
      } catch (error) {
        console.error('Token 验证失败:', error);
        localStorage.removeItem('sessionToken');
        next({ path: '/login' });
      }
    } else {
      next({ path: '/login' }); // 没有 token，重定向到登录页面
    }
  } else {
    next(); // 不需要验证的路由，直接允许跳转
  }
}

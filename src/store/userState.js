import { reactive, watch } from 'vue';

export const state = reactive({
  user: null,
  isLoggedIn: false,
  matchRoutes: []
});

watch(
  () => state.user,
  (newValue) => {
    if (newValue) {
      sessionStorage.setItem('user', JSON.stringify(newValue));
    } else {
      sessionStorage.removeItem('user');
    }
  },
  { deep: true }
);

export const userMethods = {
  setUser(userData) {
    state.user = userData;
    state.isLoggedIn = true;
  },
  clearUser() {
    state.user = null;
    state.isLoggedIn = false;
  },
  restoreUser() {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      this.setUser(userData);
    }
  },
  setRouter(matchRoutes) {
    state.matchRoutes = matchRoutes;
  }
};

// 在创建 state 时立即尝试恢复用户数据
userMethods.restoreUser();

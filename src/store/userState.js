import { reactive, watch } from 'vue';

export const state = reactive({
  user: null,
  isLoggedIn: false
});

watch(
  () => state.user,
  (newValue) => {
    if (newValue) {
      localStorage.setItem('user', JSON.stringify(newValue));
    } else {
      localStorage.removeItem('user');
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
    state.user = {
      username: null,
      id: null
    };
    state.isLoggedIn = false;
  },
  restoreUser() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      this.setUser(userData);
    }
  }
};

// 在创建 state 时立即尝试恢复用户数据
userMethods.restoreUser();

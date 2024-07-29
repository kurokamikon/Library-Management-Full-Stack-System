import { reactive } from 'vue';

export const state = reactive({
  user: {
    username: null,
    id: null
  },
  isLoggedIn: false
});

export const userMethods = {
  setUser(userData) {
    state.user = userData;
    state.isLoggedIn = true;
    localStorage.setItem('user', JSON.stringify(userData));
  },
  clearUser() {
    state.user = null;
    state.isLoggedIn = false;
    localStorage.removeItem('user');
  },
  restoreUser() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      this.setUser(userData);
    }
  }
};

<template>
  <div class="flex items-center justify-center h-screen bg-gray-200">
    <form class="w-96 m-6 p-6 bg-white rounded-lg shadow-xl" @submit.prevent="submitForm">
      <h1 class="text-3xl font-bold mb-5">登录</h1>
      <div class="mb-5">
        <label class="block mb-2 text-sm font-bold text-gray-700" for="username">用户名:</label>
        <input
          class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          type="text"
          id="username"
          v-model="user.username"
          required
        />
      </div>
      <div class="mb-5">
        <label class="block mb-2 text-sm font-bold text-gray-700" for="password">密码:</label>
        <input
          class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          type="password"
          id="password"
          v-model="user.password"
          required
        />
      </div>
      <div class="mb-5">没有账号？去<router-link to="/register" class="text-blue-600/100">注册</router-link></div>
      <button
        class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        type="submit"
      >
        登录
      </button>
    </form>
  </div>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center">
    <Toast />
  </div>
</template>

<script>
  import Button from 'primevue/button';

  export default {
    data() {
      return {
        user: {
          username: '',
          password: ''
        }
      };
    },
    methods: {
      submitForm() {
        this.$axios(
          {
            method: 'post',
            url: '/login',
            data: this.user
          },
          {
            throttle: true // 启用节流
          }
        )
          .then((response) => {
            if (response === null) {
              console.log('请求被节流，请稍后再试');
              return;
            }
            if (response && response.status == 200) {
              this.$toast.add({
                severity: 'success',
                detail: '登录成功',
                life: 3000
              });
              localStorage.setItem('token', response.token);
            } else if (response && response.status == 401) {
              this.$toast.add({
                severity: 'error',
                detail: '登陆失败，请检查是否正确',
                life: 3000
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };
</script>

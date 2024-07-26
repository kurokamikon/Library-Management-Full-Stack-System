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
          v-model="username"
          required
        />
      </div>
      <div class="mb-5">
        <label class="block mb-2 text-sm font-bold text-gray-700" for="password">密码:</label>
        <input
          class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          type="password"
          id="password"
          v-model="password"
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
</template>

<script>
  import Toast from 'primevue/toast';
  import Button from 'primevue/button';
  import DatePicker from 'primevue/datepicker';

  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      submitForm() {
        console.log('Username:', this.username);
        console.log('Password:', this.password);
        // 在这里添加你的登录逻辑
      }
    }
  };
</script>

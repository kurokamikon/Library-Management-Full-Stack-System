<template>
  <div
    class="flex items-center justify-center h-screen bg-gray-200 bg-[url('@/assets/img/background.jpg')] bg-cover bg-center bg-no-repeat"
  >
    <form class="w-96 m-6 p-6 bg-white rounded-lg shadow-xl" @submit.prevent="submitForm">
      <h1 class="text-3xl font-bold mb-5">注册</h1>
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
      <div class="mb-5">
        <label class="block mb-2 text-sm font-bold text-gray-700" for="email">邮箱:</label>
        <input
          class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          type="email"
          id="email"
          v-model="user.email"
          required
        />
      </div>
      <div class="mb-5">
        <label class="block mb-2 text-sm font-bold text-gray-700" for="Id">学号/工号:</label>
        <input
          class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          type="text"
          id="Id"
          v-model="user.Id"
          required
        />
      </div>
      <button
        class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        type="submit"
      >
        注册
      </button>
    </form>
    <div class="absolute bottom-0 left-0 right-0 flex justify-center">
      <Toast position="bottom-center" group="bc" @close="onClose">
        <template #message="slotProps">
          <div class="flex flex-col items-start flex-auto">
            <div class="font-medium text-lg my-4">{{ slotProps.message.summary }}</div>
            <Button size="small" label="去登陆" severity="success" @click="onReply()"></Button>
          </div>
        </template>
      </Toast>
    </div>
  </div>
</template>

<script>
  import Avatar from 'primevue/avatar';
  import Button from 'primevue/button';
  import Toast from 'primevue/toast';

  export default {
    components: {
      Avatar,
      Button,
      Toast
    },
    data() {
      return {
        visible: false,
        user: {
          username: '',
          password: '',
          email: '',
          Id: ''
        }
      };
    },
    methods: {
      submitForm() {
        this.$axios({
          method: 'post',
          url: '/register',
          data: this.user
        })
          .then((response) => {
            if (response && response.status == 200) {
              this.showTemplate();
            }
          })
          .catch((error) => {
            console.error(error);
            // 在这里处理错误
          });
      },
      showTemplate() {
        if (!this.visible) {
          this.$toast.add({ severity: 'success', summary: '注册成功，跳转到登录页？', group: 'bc' });
          this.visible = true;
        }
      },
      onReply() {
        this.$toast.removeGroup('bc');
        this.visible = false;
        this.$router.replace('/login');
      },
      onClose() {
        this.visible = false;
      }
    }
  };
</script>

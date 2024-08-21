<template>
  <div class="flex flex-col h-screen min-w-[300px]">
    <!-- 顶部导航栏 -->
    <div
      class="box-border w-full h-12 relative shadow flex items-center justify-center lg:justify-start flex-shrink-0 bg-gradient-to-r bg-blue-400"
    >
      <div class="absolute top-2 left-4 block lg:hidden">
        <Button
          icon="pi pi-align-justify"
          @click="visible = true"
          class="w-8 h-8 flex items-center justify-center border bg-white hover:bg-gray-100"
          style="color: #6b7280"
        />
      </div>
      <div class="flex items-center">
        <i class="pi pi-book pl-4 pr-1 text-lg lg:pl-8 lg:pr-2 lg:text-2xl text-white"></i>
        <p class="m-0 text-lg lg:text-xl text-white font-bold tracking-widest">图书管理系统</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-grow flex overflow-hidden">
      <!-- 大屏幕固定侧边栏 -->
      <div class="hidden lg:block border-r">
        <Menu :model="items" class="w-60 h-full" />
      </div>

      <!-- 小屏幕弹出抽屉 -->
      <div class="lg:hidden">
        <Drawer v-model:visible="visible" :modal="true" :showCloseIcon="true" class="w-64">
          <Menu :model="items" class="w-full" />
        </Drawer>
      </div>

      <!-- 主要内容 -->
      <div class="flex flex-col flex-grow p-4 overflow-y-auto">
        <div class="bg-[url('@/assets/img/summerbeach.jpg')] bg-cover bg-top bg-no-repeat rounded-xl">
          <div
            class="text-white text-xl lg:text-2xl ml-5 lg:ml-12 mt-4 font-semibold"
            style="text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.8)"
          >
            <span>余额：</span>
            <span>{{ balance }}￥</span>
          </div>
          <div class="flex justify-around lg:pb-3">
            <div
              v-for="(item, index) in buttonItems"
              :key="index"
              class="flex flex-col items-center justify-center"
              @click="navigateTo(item.route)"
            >
              <div
                class="w-16 h-16 my-3 md:w-20 md:h-20 md:my-4 lg:w-24 lg:h-24 lg:mb-2 rounded-full flex items-center text-white cursor-pointer backdrop-filter backdrop-blur-lg relative justify-evenly shadow-lg"
                :class="item.bgClass"
              >
                <i :class="['pi', item.icon, 'text-base md:text-2xl lg:text-3xl text-white hidden mg:block']"></i>
                <span class="lg:hidden text-base md:text-lg font-semibold">{{ item.text }}</span>
              </div>
              <div
                :class="['text-white hidden lg:block lg:text-lg font-semibold cursor-pointer']"
                style="text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.8)"
              >
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex-grow overflow-hidden">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Menu from 'primevue/menu';
  import Drawer from 'primevue/drawer';
  import Button from 'primevue/button';

  export default {
    components: {
      Menu,
      Drawer,
      Button
    },
    data() {
      return {
        visible: false,
        items: [
          {
            label: '主页',
            icon: 'pi pi-home'
          },
          {
            label: '读者设置',
            icon: 'pi pi-user',
            items: [
              {
                label: '个人信息',
                icon: 'pi pi-user-edit'
              },
              {
                label: '退出登录',
                icon: 'pi pi-sign-out'
              }
            ]
          }
        ],
        buttonItems: []
      };
    },
    computed: {
      balance() {
        return this.globalUser.user && this.globalUser.user.balance ? this.globalUser.user.balance : '0.00';
      }
    },
    methods: {
      navigateTo(route) {
        this.$router.replace(route);
      },
      checkAuth() {
        this.$axios({
          method: 'get',
          url: '/home/checkAuth',
          params: {
            userId: this.globalUser.user.id
          }
        })
          .then((response) => {
            if (response && response.status === 200) {
              this.buttonItems = response.message.buttonItems;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    mounted() {
      if (this.$route.path === '/home') {
        this.navigateTo('/home/return');
      }
      this.checkAuth();
    }
  };
</script>

<style>
  .p-5.pt-0.h-full.w-full.grow.overflow-y-auto {
    padding: 0;
  }
</style>

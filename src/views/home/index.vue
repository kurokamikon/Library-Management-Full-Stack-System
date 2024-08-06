<template>
  <div class="flex flex-col h-screen">
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
      <div class="flex flex-col flex-grow p-4 overflow-y-auto bg-slate-100">
        <!-- 这里放置您的主要内容 -->
        <h1 class="text-lg font-bold lg:text-2xl">
          欢迎<span>{{ userName }}</span
          >使用图书管理系统
        </h1>
        <div class="my-4 justify-center grid grid-cols-5 gap-5">
          <div
            v-for="(item, index) in buttonItems"
            :key="index"
            class="flex flex-col items-center justify-center"
            @click="navigateTo(item.route)"
          >
            <div
              class="w-16 h-16 my-3 md:w-20 md:h-20 md:my-4 lg:w-24 lg:h-24 lg:my-6 lg:mb-2 rounded-full flex items-center text-white cursor-pointer backdrop-filter backdrop-blur-lg relative justify-evenly shadow-lg"
              :class="item.bgClass"
            >
              <i :class="['pi', item.icon, 'text-base md:text-2xl lg:text-3xl text-white hidden mg:block']"></i>
              <span class="lg:hidden text-base md:text-lg font-semibold">{{ item.text }}</span>
            </div>
            <div :class="[item.textClass, 'hidden lg:block lg:text-lg font-semibold cursor-pointer']">
              {{ item.text }}
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
        buttonItems: [
          {
            icon: 'pi-clock',
            text: '还书',
            bgClass: 'bg-gradient-to-r from-green-400 to-teal-300 shadow-green-300/50',
            textClass: 'text-green-400',
            route: '/home/return'
          },
          {
            icon: 'pi-book',
            text: '借书',
            bgClass: 'bg-gradient-to-r from-purple-400 to-purple-300 shadow-purple-300/50',
            textClass: 'text-purple-400',
            route: '/home/borrow'
          },
          {
            icon: 'pi-dollar',
            text: '充值',
            bgClass: 'bg-gradient-to-r from-yellow-400 to-orange-300 shadow-yellow-300/50',
            textClass: 'text-orange-400',
            route: '/home/recharge'
          },
          {
            icon: 'pi-user',
            text: '新增',
            bgClass: 'bg-gradient-to-r from-blue-400 to-indigo-300 shadow-blue-300/50',
            textClass: 'text-blue-400',
            route: '/home/add'
          },
          {
            icon: 'pi-plus',
            text: '录入',
            bgClass: 'bg-gradient-to-r from-red-400 to-pink-300 shadow-red-300/50',
            textClass: 'text-red-400',
            route: '/home/input'
          }
        ]
      };
    },
    computed: {
      userName() {
        return this.globalUser.user.username
          ? this.globalUser.user.username
          : JSON.parse(localStorage.getItem('user'))?.username || '您';
      }
    },
    methods: {
      navigateTo(route) {
        this.$router.replace(route);
      }
    },
    mounted() {
      if (this.$route.path === '/home') {
        this.navigateTo('/home/return');
      }
    }
  };
</script>

<style>
  .p-5.pt-0.h-full.w-full.grow.overflow-y-auto {
    padding: 0;
  }
</style>

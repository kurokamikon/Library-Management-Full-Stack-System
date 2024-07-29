<template>
  <div class="flex flex-col h-screen">
    <!-- 顶部导航栏 -->
    <div
      class="box-border w-full h-12 relative shadow flex items-center justify-center lg:justify-start flex-shrink-0 bg-gradient-to-r from-indigo-500 to-pink-500"
    >
      <div class="absolute top-2 left-4 block lg:hidden">
        <Button
          icon="pi pi-align-justify"
          @click="visible = true"
          class="w-8 h-8 flex items-center justify-center border bg-white text-gray-500"
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
      <div class="hidden lg:block w-64 border-r">
        <Menu :model="items" class="w-full h-full" />
      </div>

      <!-- 小屏幕弹出抽屉 -->
      <div class="lg:hidden">
        <Drawer v-model:visible="visible" :modal="true" :showCloseIcon="true" class="w-64">
          <Menu :model="items" class="w-full" />
        </Drawer>
      </div>

      <!-- 主要内容 -->
      <div class="flex-grow p-4 overflow-y-auto">
        <!-- 这里放置您的主要内容 -->
        <h1 class="text-lg font-bold lg:text-2xl">
          欢迎<span>{{ globalUser.user.username }}</span
          >使用图书管理系统
        </h1>
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
            label: '图书管理',
            icon: 'pi pi-book',
            items: [
              {
                label: '新增图书',
                icon: 'pi pi-plus'
              },
              {
                label: '搜索图书',
                icon: 'pi pi-search'
              }
            ]
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
        ]
      };
    },
    methods: {
      // 如果需要添加方法，可以在这里定义
    }
  };
</script>

<style>
  .p-5.pt-0.h-full.w-full.grow.overflow-y-auto {
    padding: 0;
  }
</style>

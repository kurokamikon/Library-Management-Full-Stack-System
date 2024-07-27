<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-xl font-bold">My Project</div>
        <div>
          <a href="#" class="ml-4 hover:underline">Home</a>
          <a href="#" class="ml-4 hover:underline">About</a>
          <a href="#" class="ml-4 hover:underline">Contact</a>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-grow container mx-auto p-4">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">Welcome to My Project</h1>
        <p class="text-lg">This is a responsive homepage using Vue 3 and Tailwind CSS.</p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-blue-600 text-white p-4 text-center">
      <p>&copy; 2024 My Project. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'HomePage'
  };
</script>

<style scoped>
  /* 添加任何特定于此组件的样式 */
</style>

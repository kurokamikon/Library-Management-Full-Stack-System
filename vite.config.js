import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 设置 '@' 符号为 'src' 目录的别名
    }
  },
  server: {
    hmr: {
      overlay: true
    }
  }
});

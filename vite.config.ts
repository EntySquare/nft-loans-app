import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  base: "./",

  plugins: [vue()],
  // 配置项
  resolve: {
    // 配置别名
    alias: {
      // path.resolve：拼接路径
      // __dirname：当得当前文件的绝对路径
      "@": path.resolve(__dirname, "./src"),
      'element-plus$': 'element-plus/lib/index.esm.js',
    },
  },
  // 自动导入 less 文件
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `
          @import '@/assets/styles/variables.less';
          @import '@/assets/styles/mixins.less';
          @import '@/assets/styles/responsive.less';
        `,
      },
    },
  },
  build: {
    outDir: "dist",
    // 9月更新
    assetsDir: "assets", //指定静态资源存放路径
    sourcemap: false, //是否构建source map 文件
    // 10月更新
    minify: "terser", // 混淆器，terser 构建后文件体积更小，'terser' | 'esbuild'
    chunkSizeWarningLimit: 1500, //chunk 大小警告的限制，默认500KB
    rollupOptions: {
      output: {
        // 最小化拆分包
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
        chunkFileNames: "js/[name].[hash].js", // 用于命名代码拆分时创建的共享块的输出命名，[name]表示文件名,[hash]表示该文件内容hash值
      },
    },
    terserOptions: {
      // 生产环境移除console
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      // 10月更新
      output: {
        comments: true, // 去掉注释内容
      },
    },
  },
  server: {
    https: false, // 是否开启 https
    open: false, // 是否自动在浏览器打开
    cors: true, // 允许跨域  8月更新
    port: 3000, // 端口号
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "", // 后台接口
        changeOrigin: true,
        secure: false, // 如果是https接口，需要配置这个参数
        // ws: true, //websocket支持
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  // 引入第三方的配置
  optimizeDeps: {
    include: [],
  },
});

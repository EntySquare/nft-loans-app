import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css'
// 导入 normalize
import router from '@/router'
// 导入 路由
import '@/assets/styles/common.less'
import '@/assets/icons/iconfont.css'
// 导入 公共的样式文件
import ElementPlus from 'element-plus'
// 导入 图标
import 'element-plus/dist/index.css'
// 导入 element-plus 黑夜样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 导入 element-plus 样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入 element-plus 图标
import { createPinia } from 'pinia'
// 导入 pinia
import VueLazyload from 'vue-lazyload'
// 导入 图片懒加载
import i18n from './locale'
// 导入 国际化
import 'element-plus/dist/locale/zh-cn.mjs'
let pinia = createPinia()
// 创建 pinia 实例
const app = createApp(App)
// 创建 vue 实例
import VueSplide from '@splidejs/vue-splide';
// 导入threejs
app.use(ElementPlus)
    .use(i18n)
    .use(VueSplide)
    .use(VueLazyload)
    .use(router)
    .use(pinia)
    .mount('#app')
// 挂载 vue 实例
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 挂载 element-plus 图标
import { createI18n } from 'vue-i18n'; // 导入 vue-i18n

// 导入全局中英文配置对象
import en from './en-US'
import zh from './zh-CN'

const messages = {
    en,
    zh,
}

const language = (navigator.language || 'zh').toLocaleLowerCase() // 这是获取浏览器的语言

const i18n = createI18n({
    locale: localStorage.getItem('upaclang') || language.split('-')[0] || 'zh',// 默认语言
    fallbackLocale: 'zh',// 不存在默认则为英文
    allowComposition: true,// 允许组合式api
    messages,
})
export default i18n
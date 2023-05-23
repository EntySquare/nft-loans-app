// 管理路由
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// 导入 layout
import layout from '@/views/layout/index.vue'
// 导入 store
import MainStore from '@/store'

// 创建路由对象
let router = createRouter({
    // 设置路由模式
    history: createWebHashHistory(),
    // 设置路由对象
    routes: [
        {
            path: '/', redirect: `/Explorer/${'UP'}`,
        },
        {
            path: '/Partners/:id', component: layout,
            children: [
                { path: '', component: () => import('@/views/components/explorer/index.vue') },
                { path: '/Explorer/:id', component: () => import('@/views/components/explorer/index.vue') },
                { path: '/Plan/:id', component: () => import('@/views/components/explorer/index.vue') },
                { path: '/fdsfdsfjklsdjflksdkfjsdfsdfsdfsdafsfdskufdlskjfl/:id', component: () => import('@/views/components/explorer/index.vue') },
                { path: '/fdsfdsfjklsdjflksdkfjsdfsdfsdfsdafsfdskufdfdsjkfkljdlfdslfdlkfklskjfl/:id', component: () => import('@/views/components/explorer/index.vue') },
                { path: '/poh/:id', component: () => import('@/explorer/components/poh/index.vue') },
            ]
        }

    ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // homeStr
    const State = MainStore()
    if (to.fullPath.includes(State.homeStr)) {
        State.homeState = true
    }
    // 判断地址是否包含字符串 UP
    if (to.fullPath.includes(State.acStr)) {
        const rAC = to.params.id as string
        State.referrer = rAC
        State.referrerAC = rAC.split(State.acStr)[1]
    }
    // console.log(to, from)
    next()
})

// 暴露路由对象
export default router

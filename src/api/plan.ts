import request from '@/request' // 引入封装好的 axios 请求

// 获取计划列表
export function getPlanList(params: any) {  // 定义接口函数，参数为 params
    return request({
        url: '/plan/list',  // 请求地址
        method: 'get',  // 请求类型 get/post
        params // get 请求传递的参数
    })
}

// 获取计划详情
export function getPlanDetail(data: any) { // 定义接口函数，参数为 data
    return request({
        url: '/plan/detail', // 请求地址
        method: 'post', // 请求类型 get/post
        data // post 请求传递的参数
    })
}

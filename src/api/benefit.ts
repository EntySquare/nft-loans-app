import request from '@/request' // 引入封装好的 axios 请求
export interface benefitInfo {
    balance: number;
    last_day_benefit: number;
    accumulated_benefit: number;
}
export interface covenantInfo {
    nft_name: string;
    pledge_id: string;
    chain_name: string;
    duration: string;
    hash: string;
    interest_rate: number;
    accumulated_benefit: number;
    pledge_fee: number;
    release_fee: number;
    start_time: number
    expire_time: number;
    nft_release_time: number;
    flag: string;
}
export interface myCovenantFlowRep {
    benefit_info: benefitInfo;
    covenant_flows: covenantInfo[];
}
// 获取计划详情
export function myCovenantFlow(data: any) { // 定义接口函数，参数为 data
    return request({

        url: '/app/myCovenantFlow', // 请求地址
        method: 'post', // 请求类型 get/post
        data // post 请求传递的参数
    })
}
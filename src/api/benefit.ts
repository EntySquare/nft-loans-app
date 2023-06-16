import request from '@/request'
import { getToken } from "@/utils/auth"; // 引入封装好的 axios 请求
export interface benefitInfo {
    balance: number;
    last_day_benefit: number;
    accumulated_benefit: number;
}
export interface covenantInfo {
    covenant_id: number;
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
export interface benefitFlowInfo {
    time: number
    num: string;
    flag: string;
}
export interface myCovenantFlowRep {
    benefit_info: benefitInfo;
    covenant_flows: covenantInfo[];
}
export interface myBenefitFlowRep {
    covenant_info: covenantInfo;
    benefit_flows: benefitFlowInfo[];
}
// 获取计划详情
export function myCovenantFlow() {
    const token = getToken()
    console.log('token:', token)
    return request({
        url: '/app/myCovenantFlow', // 请求地址
        method: 'post', // 请求类型 get/post
        headers: {
            'token': token,
            // Add more headers as needed
        },
    })
}

export function covenantFlowDetail(hash: string) {
    const token = getToken()
    const data = { hash: hash }
    return request({
        url: '/app/getCovenantDetail', // 请求地址
        method: 'post', // 请求类型 get/post
        headers: {
            'token': token,
            // Add more headers as needed
        },
        data
    })
}
export function checkHash(hash: string) {
    const token = getToken()
    const data = { hash }
    return request({
        url: '/app/checkHash', // 请求地址
        method: 'post', // 请求类型 get/post
        headers: {
            'token': token,
            // Add more headers as needed
        },
        data
    })
}

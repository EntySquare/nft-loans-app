import request from '@/request'
import {getToken} from "@/utils/auth"; // 引入封装好的 axios 请求
// type MyInvestmentResp struct {
//     UID                    string               `json:"uid"`
//     Level                  int64                `json:"level"`
//     AccumulatedPledgeCount int64                `json:"accumulated_pledge_count"`
//     InvestmentCount        int64                `json:"investment_count"`
//     InvestmentAddress      string               `json:"investment_address"`
//     InvestmentUsers        []InvestmentUserInfo `json:"investment_users"`
// }
// type InvestmentUserInfo struct {
//     UID         string `json:"uid"`
//     Level       int64  `json:"level"`
//     PledgeCount int64  `json:"pledge_count"`
// }
export interface InvestmentUserInfo {
    uid: string;
    level: number;
    pledge_count: number;
}
export interface myInvestmentRep {
    uid: string;
    level: number;
    accumulated_pledge_count: number;
    investment_count: number;
    investment_address: string;
    accumulated_benefit: number;
    investment_users: InvestmentUserInfo[];
}
// 获取计划详情
export function myInvitee() {
    const token = getToken()
    return request({
        url: '/app/myInvestment', // 请求地址
        method: 'post', // 请求类型 get/post
        headers: {
            'token': token,
            // Add more headers as needed
        },
    })
}
import request from '@/request'
import {getToken} from "@/utils/auth";
// type MyNgtResp struct {
//     BenefitInfo  BenefitInfo       `json:"benefit_info"`
//     Transactions []TransactionInfo `json:"transactions"`
// }
// type TransactionInfo struct {
//     Num             float64    `json:"num"`
//     Chain           string     `json:"chain"`
//     Address         string     `json:"address"`
//     Hash            string     `json:"hash"`
//     AskForTime      *time.Time `json:"ask_for_time"`
//     AchieveTime     *time.Time `json:"achieve_time"`
//     TransactionType string     `json:"transaction_type"`
//     Flag            string     `json:"flag"`
// }
export interface benefitInfo {
    balance: number;
    last_day_benefit: number;
    accumulated_benefit: number;
}
export interface transactionInfo {
    num: number;
    chain: string;
    address: string;
    hash: string;
    ask_for_time: number;
    achieve_time: number;
    transaction_type: string;
    status: string;
}
export interface myTransactionsRep {
    benefit_info: benefitInfo;
    transactions: transactionInfo[];
}
// 获取计划详情
export function myNgt() {
    const token = getToken()
    return request({
        url: '/app/myNgt', // 请求地址
        method: 'post', // 请求类型 get/post
        headers: {
            'token': token,
            // Add more headers as needed
        },
    })
}
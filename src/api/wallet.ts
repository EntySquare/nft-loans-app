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
export interface withdrawNgtReq {
    num: number;
    address: string;
    chain: string;
}
export interface depositNgtReq {
    num: number;
    address: string;
    hash: string;
    chain: string;
}



export function withdrawNgt(data:any) {
    const token = getToken()
    return request({
        url: '/app/withdraw', // 请求地址
        method: 'post', // 请求类型 get/post
        data,
        headers: {
            'token': token,
            // Add more headers as needed
        }
    })
}
export function depositNgt(data:any) {
    const token = getToken()
    return request({
        url: '/app/deposit', // 请求地址
        method: 'post', // 请求类型 get/post
        data,
        headers: {
            'token': token,
            // Add more headers as needed
        }

    })
}
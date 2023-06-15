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
export interface pledgeNftReq {
    nft_id: string;
    duration: string;
    hash: string;
    chain: string;
}


// 获取计划详情
export function pledgeNft(data:any) {
    const token = getToken()
    return request({
        url: '/app/pledgeNft', // 请求地址
        method: 'post', // 请求类型 get/post
        data,
        headers: {
            'token': token,
            // Add more headers as needed
        }
    })
}
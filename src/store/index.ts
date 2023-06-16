// 主要数据
import { defineStore } from 'pinia' //引入pinia
import {login } from '@/api/user' //*获取计划列表
import request from "@/request"; //引入axios
import connectWallet, { UniverseData } from "@/web3/connectWallet";
import { convertEtherUnits, EtherUnit } from "@/utils/etherUnit";
import {setToken} from "@/utils/auth"; //引入连接钱包方法
import {
    benefitFlowInfo, covenantFlowDetail,
    covenantInfo,
    myBenefitFlowRep,
    myCovenantFlow,
    myCovenantFlowRep
  } from "@/api/benefit";
type re = [{
    sub_address: string,
    status: number
}]
//下注记录数据结构体
type be = [{
    wallet_address: string,//下注钱包
    round: number,//轮次
    bet_amount: number,//下注金额
    bet_time: number,//下注时间
    return_rate: number,//收益率
    locked_progress: number,//锁仓进度
    state: number,//数据状态
}]
let MainStore = defineStore('main', {
    state: () => ({
        password: '',
        currentAccount: '', //当前账户
        currentBalance: '', //当前余额
        balanceChain: 0, //链余额
        currentStatus: -3, //当前状态
        isLoading: false, //加载状态
        referrer: 'UP', //介绍
        referrerAC: '',//介绍地址
        baseUrl: 'https://universe.partners/#/Explorer/UP', // 拼接地址
        // baseUrl: 'http://192.168.10.44:3000/Partners/UP', // 拼接地址
        accountStr: 'ACQWERJHKHDWJKHDKJBQNWDJKDHWIJHIHFEWIHDWI', // 分割地址
        homeStr: 'chlketupckgjzlkdufdzdfwefdszilfzsd',
        homeState: false,
        payCount: 0, // 转账次数
        Invitationlink: '', // 邀请链接
        jlList: [{}] as re, // 奖励列表
        bettingList: [{}] as be, // 下注记录
        alertShow: false, // 弹窗
        RewardList: [], // 奖励列表
        passworddd: '',
        currentDa: '',
        subroundXiao: '',
        statusss: 0,
    }),
    actions: {
        setInvitationlink() { //设置邀请链接
            if (this.currentAccount) {
                this.Invitationlink = this.baseUrl + this.accountStr + this.currentAccount; //拼接地址
                // this.router.push(`/Partners/${this.State.referrer}`);
            } else {
                this.Invitationlink = this.baseUrl + this.referrerAC; //拼接地址
            }
        },
        // 转账
        transferUSDT(arg0: string, arg1: number, func: (hash: string) => void) { },
        // 转账
        ToSignfunc(acc: string): any { },
        safeTransferFrom(Faddress: string,Taddress:string,id:string, func: (hash: string) => void) { },
        // 获取奖励列表,
        // async getRewardList() {
        //     // myRecommendList
        //     const res = await request.post(`/myRecommendList`, { //判断是否有转账记录
        //         sender: this.currentAccount,
        //     });
        //     this.RewardList = res.data.json as any
        // },
        async goToSignfunc(acc: any, state: any) {
            if (state) return
            try {
                //定义类型
                type re = {
                    sign: string,
                    res: string
                    dataToSign: string
                }
                let resd: re
                resd = await this.ToSignfunc(acc);  //签名
                console.log('resd:', resd)
                const res = await request.post(`/recommendSign`, { //判断是否有转账记录
                    // address: this.currentAccount, //地址
                    public_key: this.currentAccount,
                    message: acc,
                    signature: resd.sign,
                });
                // const rese = await request.post(`/fetchEarnList`, { //判断是否有转账记录
                //     address: this.currentAccount, //地址
                // });
                // this.jlList = rese.data.json as any
                console.log('resd:', resd)
                console.log('res:', res)
            } catch (error) {

            }
        },
        async extract(acc: any, state: any) {
            // if (state) return
            try {
                //定义类型
                type re = {
                    sign: string,
                    res: string
                    dataToSign: string
                }
                let resd: re
                resd = await this.ToSignfunc(acc);  //签名
                console.log('resd:', resd)
                const res = await request.post(`/buy/withdrawalOfIncome`, { //判断是否有转账记录
                    // address: this.currentAccount, //地址
                    public_key: this.currentAccount,
                    message: this.currentAccount,
                    signature: resd.sign,
                });
            } catch (error) {

            }
        },
        //链查询轮次下标
        async getUniverseApi(): Promise<UniverseData | any> { },
        async universeWithdrawalApi(id: number, func: () => void): Promise<boolean | any> { },
        async universeBuyOneApi(id: number, sender: string, endTime: number, amount: number, signature: string, okFunc: (hash: any) => void) { },
        //连接
        async Connection() {
            console.log('连接')
            if (this.account) return   //判断是否连接
            this.isLoading = true; //打开加载
            return new Promise(async (resolve, reject) => {
                try {
                    await connectWallet().then(async (res: any) => {
                        this.transferUSDT = res.transferUSDT; //赋值转账方法
                        this.safeTransferFrom = res.safeTransferFrom; //赋值转账方法
                        this.getUniverseApi = res.getUniverseApi; //查询轮次下标
                        this.universeWithdrawalApi = res.universeWithdrawalApi; //下注提现
                        this.universeBuyOneApi = res.universeBuyOneApi; //下注
                        this.currentAccount = res.address; //赋值地址
                        this.currentBalance = res.balance; //赋值余额
                        this.balanceChain = res.balanceChain; //赋值链余额
                        this.ToSignfunc = res.dataToSignfunc // 要签名的数据
                        const resLogin = await login({wallet_address:this.currentAccount}) //*使用sync await 异步获取数据
                        setToken(resLogin.data.json);
                        console.log('this.referrerAC:', this.referrerAC)
                        // const { data } = await request.post(`/fetchEarnList`, { //判断是否有转账记录
                        //     address: this.currentAccount, //地址
                        // });
                        // this.jlList = data.json
                        // this.jlList = [{ sub_address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', status: 0 }] as any
                        // const re = await request.post(`/checkCode`, { //判断是否有转账记录
                        //     from: this.currentAccount, //地址
                        //     recommend: this.referrerAC, //介绍地址
                        // });
                        // console.log('re.data.json.status:', re.data)
                        // if (re.data.code == 0) { //有记录
                        //     console.log('1:', 1)
                        //     this.currentStatus = re.data.json.status; //赋值状态
                        // }
                        this.isLoading = false; //关闭加载
                        this.setInvitationlink(); //设置邀请链接
                        // this.getRewardList() //获取奖励列表
                        resolve(res); //返回数据
                    });
                } catch (error) {
                    // alert("please check MetaMask!");
                    this.isLoading = false;
                    reject(error); //返回错误
                }
            });
        },
        //连接
        async DisConnection() {
            console.log('登出')
            if (!this.account) return   //判断是否连接
            this.isLoading = true; //打开加载
            return new Promise(async (resolve, reject) => {
                try {
                    await connectWallet().then(async (res: any) => {

                        this.currentAccount = ""; //赋值地址
                        this.currentBalance = ""; //赋值余额
                        this.balanceChain = 0; //赋值链余额
                        setToken("");
                        //console.log('this.referrerAC:', this.referrerAC)
                        // const { data } = await request.post(`/fetchEarnList`, { //判断是否有转账记录
                        //     address: this.currentAccount, //地址
                        // });
                        // this.jlList = data.json
                        // this.jlList = [{ sub_address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', status: 0 }] as any
                        // const re = await request.post(`/checkCode`, { //判断是否有转账记录
                        //     from: this.currentAccount, //地址
                        //     recommend: this.referrerAC, //介绍地址
                        // });
                        // console.log('re.data.json.status:', re.data)
                        // if (re.data.code == 0) { //有记录
                        //     console.log('1:', 1)
                        //     this.currentStatus = re.data.json.status; //赋值状态
                        // }
                        this.isLoading = false; //关闭加载
                        //this.setInvitationlink(); //设置邀请链接
                        // this.getRewardList() //获取奖励列表
                        resolve(res); //返回数据
                    });
                } catch (error) {
                    // alert("please check MetaMask!");
                    this.isLoading = false;
                    reject(error); //返回错误
                }
            });
        },
        //转账
        async TransferMoney() {
            console.log("转账"); //打印转账
            const re = await request.post(`/getCode`, {}); //获取转账码
            if (!this.currentAccount) return; //判断是否连接
            // const recipient = '0x04cA6512D857249dE95d406fF89EfCe668201B11'; // 收款人地址
            const recipient = "0x544F1AeED1fA8A5d176143b3844432D53Ddebd5E"; // 收款人地址
            const amount = 3000; // 转账金额（以USDT
            const tx = await this.transferUSDT(recipient, amount, (hash: string) => { //调用转账方法
                request
                    .post(`/fromCode`, { //提交转账记录
                        code: re.data.json.code, //转账码
                        from_str: this.currentAccount, //转账地址
                        hash: hash, //交易hash
                    })
                    .then((res: any) => {
                        this.Connection(); //刷新状态
                    });
            });
            console.log(tx); //打印交易hash
        },
        //获取转账次数
        async getPayCount() {
            const re = await request.post(`/selectCode`, {});
            this.payCount = re.data.json.count;
        },
        //格式化地址
        replaceStr(str: string) {
            return str.substring(0, 6) + '...' + str.substring(38)
        },
        //格式化金额
        formatBalance(balance: string) {
            return (+balance / 1000000).toFixed(2)
        },
        //格式化金额
        formatChainBalance(balance: string) {
            return convertEtherUnits(parseInt(balance), EtherUnit.WEI, EtherUnit.ETHER).toFixed(2)
        },
        //申请购买金额 http调用
        authorizeBuyOne(num: string) {
            //获取用户余额
            console.log(this.balanceChain)
        }
    },
    getters: {
        account: state => state.currentAccount,//地址
        balance: state => state.currentBalance,//余额
        status: state => state.currentStatus,//状态
        isLd: state => state.isLoading,//加载状态
        acStr: state => state.accountStr,//分割地址
        bU: state => state.baseUrl,//拼接地址
        Invlink: state => state.Invitationlink,//邀请链接
        jlData: state => state.jlList,//邀请链接
        bList: state => state.bettingList, //用户的下注记录
        ReList: state => state.RewardList, //用户的推荐记录
        password: state => state.passworddd,//密码
        current: state => state.currentDa,//当前轮次
        subroundXi: state => state.subroundXiao,//当前轮次
        stat: state => state.statusss,//当前轮次
    }
})
export default MainStore



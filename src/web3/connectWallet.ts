import { promises } from 'dns';
import Web3 from 'web3'; // 引入Web3
import { AbiItem } from 'web3-utils';
import { convertEtherUnits, EtherUnit } from "@/utils/etherUnit";
import BN from "bn.js"; // 引入AbiItem
import { log } from 'console';
import { ca } from 'element-plus/es/locale';

declare global { // 声明全局变量
    interface Window { // 声明window全局变量
        ethereum: any; // 声明ethereum全局变量
    }
}

// Matic网络ID
const MATIC_CHAIN_ID = '0x89';
// const MATIC_CHAIN_ID = '0x539';

// Matic网络ID
const MATIC_CHAIN_ID_DECIMAL = '137';

// USDT合约地址
const usdtContractAddress = '0x3Bda5e439aF86bbe6B82D8E9eA0B8dE99776B66A';  // *代币合约地址

// ERC20合约ABI（仅包含transfer函数）
const erc20Abi: AbiItem[] = [
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}
];


const universeAbi = `[{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]`
// universe合约地址
// const universeContractAddress = '0xd7f8a069C1A4f93CA332e7356eE4124338B59bD8';
// const universeContractAddress = '0xd7f8a069C1A4f93CA332e7356eE4124338B59bD8';
const universeContractAddress = '0x3Bda5e439aF86bbe6B82D8E9eA0B8dE99776B66A';
// const universeContractAddress = '0x2966cDAdF34F776e08cD29c617453a4CaA6fB501';

export type UniverseData = {
    blockTimestamp: number;
    indexWarehouse: number;
    creationTimeWarehouse: number;
    daysGetInterest: string;
    profitPool: number;
    userBalances: number;//用户余额
    WarehouseBets: [{
        amount: string,
        batAddress: string,
        bettingTime: string,
        extract: string,
        id: string,
        round: string,
        state: string,
        incrementOne:string
    }]; // 这里的类型需要根据具体情况进行调整
    UserBetRecords: [{
        amount: string,
        batAddress: string,
        bettingTime: string,
        extract: string,
        id: string,
        round: string,
        state: string,
        incrementOne:string
    }]; // 这里的类型需要根据具体情况进行调整
}

async function connectWallet() { // 连接钱包
    const { ethereum } = window; // 获取window.ethereum

    if (!ethereum) { // 检查MetaMask是否已安装
        console.log('请安装MetaMask！') // 打印日志
        return;
    }

    const web3 = new Web3(ethereum); // 初始化Web3
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' }); // 获取账户
    const chainId = await ethereum.request({ method: 'eth_chainId' }); // 获取网络ID
    const address = accounts[0]; // 获取账户地址
    const dataToSignfunc = async (acc: any) => { // 请求MetaMask签名数据
        const dataToSign = web3.utils.toHex(acc); // 转换为16进制
        const res = await web3.eth.personal.sign(dataToSign, address, "");
        const msg = `0x${stringToHex(`${acc}`)}`;
        const sign = await ethereum.request({
            method: 'personal_sign',
            params: [msg, address, 'Example password'],
        });
        // console.log(sign);
        return { sign, res, dataToSign }
    }

    function stringToHex(input: string): string {
        const encoder = new TextEncoder();
        const byteArray = encoder.encode(input);

        let hex = '';
        for (const byte of byteArray) {
            hex += byte.toString(16).padStart(2, '0');
        }
        return hex;
    }

    // 转账
    const transferUSDT = async (recipient: string, amount: number, func: (hash: string) => void) => {
        console.log('1:', 1)
        // 检查MetaMask是否已安装
        if (!window.ethereum) {
            console.error('请先安装MetaMask插件');
            return;
        }
        try { // 发起USDT转账交易
            const usdtContract = new web3.eth.Contract(erc20Abi, usdtContractAddress); // 初始化USDT合约
            const decimals = 4;  // 转换金额为最小单位（由于USDT是6位小数，因此需要使用10的6次方作为基数）
            const amountInSmallestUnit = web3.utils.toBN(amount * Math.pow(10, decimals)); // 转换金额为最小单位
            const gasPrice = await web3.eth.getGasPrice(); // 获取当前gas价格
            console.log('usdtContract.methods:', usdtContract.methods)
            const transaction = await usdtContract.methods // 调用USDT合约的transfer函数
                .transfer(recipient, amountInSmallestUnit.toString()) // 调用transfer函数
                .send({ from: address, gasPrice: gasPrice }).on('transactionHash', function (hash: any) { // 监听交易哈希
                    console.log('1:', 1)
                    try {
                        func(hash); // 回调函数
                    }catch(e){
                        
                        func(hash); // 回调函数
                    }
                });
            console.log('USDT转账成功', transaction);
        } catch (error) {
            console.error('USDT转账失败', error);
        }
    };
 
    const NFTaddress = '0x3Bda5e439aF86bbe6B82D8E9eA0B8dE99776B66A'     // * NGT 合约地址
    //质押
    const safeTransferFrom = async (Faddress: string,Taddress:string,id:string, func: (hash: any) => void) => {
        // 检查MetaMask是否已安装
        if (!window.ethereum) {
            console.error('请先安装MetaMask插件');
            return;
        }
        console.log('id:', id)
        try { // 发起USDT转账交易
            const universeContract = new web3.eth.Contract(JSON.parse(universeAbi), NFTaddress); // 初始化universe合约
            const gasPrice = await web3.eth.getGasPrice(); // 获取当前gas价格
            const transaction = await universeContract.methods // 调用USDT合约的transfer函数
                .safeTransferFrom(Faddress,Taddress,id) // 调用transfer函数
                .send({ from: address, gasPrice: gasPrice }).on('transactionHash', function (hash: any) { // 监听交易哈希
                    func(hash); // 回调函数
                });
            console.log('质押成功', transaction);
        } catch (error) {
            console.error('质押失败', error);
        }
    };



    // 查询轮次下标
    const getUniverseApi = async (): Promise<UniverseData | any> => {
        // 检查MetaMask是否已安装
        if (!window.ethereum) {
            console.error('请先安装MetaMask插件');
            return "";
        }
        // const abiItems =universeAbi.decode();
        const universeContract = new web3.eth.Contract(JSON.parse(universeAbi), universeContractAddress); // 初始化universe合约
        try {
            const block = await web3.eth.getBlock(await web3.eth.getBlockNumber()); // 获取当前区块信息

            const indexWarehouse = await universeContract.methods.getIndexWarehouse().call();
            const creationTimeWarehouse = await universeContract.methods.getCreationTimeWarehouse().call();
            // const daysGetInterest = await universeContract.methods.daysGetInterest().call();
            const profitPool = await universeContract.methods.getProfitPool().call();
            const UserBetRecords = await universeContract.methods.getUserBetRecords(address).call();
            const WarehouseBets = await universeContract.methods.getWarehouseBets(indexWarehouse).call();
            const userBalances = await universeContract.methods.getUserBalances(address).call();
            console.log('当前区块时间戳：', block.timestamp);
            console.log("indexWarehouse:", indexWarehouse)
            console.log("creationTimeWarehouse:", creationTimeWarehouse)
            // console.log("daysGetInterest:", daysGetInterest)
            console.log("profitPool:", profitPool)
            console.log("WarehouseBets:", WarehouseBets)
            console.log("UserBetRecords:", UserBetRecords)
            console.log("userBalances:", userBalances)
            return {
                blockTimestamp: Number(block.timestamp),
                indexWarehouse: Number(indexWarehouse),
                creationTimeWarehouse: Number(creationTimeWarehouse),
                userBalances: userBalances,
                // daysGetInterest: Number(daysGetInterest),
                profitPool: Number(profitPool),
                WarehouseBets,
                UserBetRecords,
            };
        } catch (error) {
            console.error('getUniverseApi 失败', error);
            return "";
        }
        return "";
    };
    //投注提现
    const universeWithdrawalApi = async (id: number, okFunc: () => void): Promise<boolean> => {
        console.log(id)
        const universeContract = new web3.eth.Contract(JSON.parse(universeAbi), universeContractAddress); // 初始化universe合约
        // const accounts = await web3.eth.getAccounts();
        const contractMethod = universeContract.methods.withdrawal(id);
        // const gas = await contractMethod.estimateGas();
        // const blockNumber = await web3.eth.getBlockNumber(); // 获取最新的区块编号
        // const block = await web3.eth.getBlock(blockNumber); // 获取最新的区块信息
        // console.log('当前区块的gas限制为:', block.gasLimit);
        // const gas = await web3.eth.getGasPrice(); // 获取当前gas价格
        const gasPrice = await web3.eth.getGasPrice(); // 获取当前gas价格
        const transaction = {
            from: address,
            to: universeContractAddress,
            gasPrice: gasPrice,
            // gas: block.gasLimit,
            data: contractMethod.encodeABI(),
        };
        const receipt = await web3.eth.sendTransaction(transaction);
        if (receipt.status === true) {
            okFunc();
        }
        return receipt.status;
    }
    //下注
    const universeBuyOneApi = async (id: number, sender: string, endTime: number, amount: number, signature: string, okFunc: (hash: string) => void) => {
        const universeContract = new web3.eth.Contract(JSON.parse(universeAbi), universeContractAddress); // 初始化universe合约
        const blockNumber = await web3.eth.getBlockNumber(); // 获取最新的区块编号
        const block = await web3.eth.getBlock(blockNumber); // 获取最新的区块信息
        //投注余额
        //购买金额
        // let payNum = web3.utils.toWei(amount.toString(), "ether")
        const userBalances = await universeContract.methods.getUserBalances(address).call();
        const payNumBN = new BN(web3.utils.toWei(amount.toString(), "ether")); // 1 ETH in Wei
        const userBalancesBN = new BN(userBalances); // 0.5 ETH in Wei
        // 计算差值 支付金额-投注余额
        let result = payNumBN.sub(userBalancesBN);
        // 判断结果是否小于 0
        if (result.cmpn(0) < 0) {
            // console.log('结果小于 0');
            result = new BN("0");
        }

        console.log("id:", id)
        console.log("sender:", sender)
        console.log("endTime:", endTime)
        console.log("amount:", amount)
        console.log("signature:", signature)
        console.log("result", result.toString())

        const gasPrice = await web3.eth.getGasPrice();
        const options = { from: sender, value: web3.utils.toWei(result.toString(), "wei"), gasPrice: gasPrice, }; // 设置交易的发送地址和 ETH 数量
        // universeContract.methods.buyOneTest(id, sender, endTime, amount, signature).send(options).then(function (receipt: any) {
        //     okFunc();
        // });
        const ret = await universeContract.methods.buyOne(id, sender, endTime, amount, signature).send(options).on('transactionHash', function (hash: any) { // 监听交易哈希
            console.log("交易hash", hash);
            okFunc(hash);
        });
        console.log("ret", ret);
        console.log("ret", ret);
        console.log("ret", ret);
        console.log("ret", ret);
    }

    if (chainId !== MATIC_CHAIN_ID) { // 检查当前网络是否为Matic网络
        try { // 切换到Matic网络
            await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: MATIC_CHAIN_ID }] }); // 切换到Matic网络
        } catch (switchError: any) { // 捕获错误
            if (switchError.code === 4902) { // 如果错误码为4902，则尝试添加Matic网络
                try {
                    const res = await ethereum.request({
                        method: 'wallet_addEthereumChain', // 添加Matic网络
                        params: [
                            {
                                chainId: MATIC_CHAIN_ID, // Matic网络ID
                                chainName: 'Polygon (MATIC)', // Matic网络名称
                                nativeCurrency: {
                                    name: 'MATIC', // MATIC代币名称
                                    symbol: 'MATIC', // MATIC代币符号
                                    decimals: 18, // MATIC代币精度
                                },
                                rpcUrls: [
                                    'https://rpc-mainnet.matic.network',
                                    'https://rpc-mainnet.maticvigil.com',
                                    'https://rpc-mainnet.matic.quiknode.pro',
                                    'https://matic-mainnet.chainstacklabs.com',
                                    'https://matic-mainnet-full-rpc.bwarelabs.com'
                                ], // Matic网络RPC节点
                                blockExplorerUrls: [
                                    'https://polygonscan.com/',
                                    'https://explorer-mainnet.maticvigil.com/',
                                    'https://explorer.matic.network/'
                                ], // Matic网络区块浏览器
                            },
                        ],
                    });
                    console.log('res:', res)
                    console.log('Polygon Network added');
                } catch (addError) {
                    alert("添加网络失败! 为你跳转到chainlist.org, 请手动添加Matic网络") // 添加Matic网络失败
                    window.open('https://chainlist.org/chain/137', '_blank'); // 打开Matic网络添加页面
                    console.error('无法添加Matic网络:', addError); // 打印日志
                }
            } else {
                console.error('无法切换到Matic网络:', switchError); // 打印日志
            }
        }
    }
    let balance = 0;
    let balanceChain = "0";
    try {
        const tokenContract = new web3.eth.Contract(erc20Abi, usdtContractAddress); // 初始化USDT合约
        balance = await tokenContract.methods.balanceOf(address).call()  // 获取账户余额
    } catch (e) {

    }
    try {
        balanceChain = await web3.eth.getBalance(address);// 获取账户余额
        // balanceChain = convertEtherUnits(parseInt(balanceChainInt), EtherUnit.WEI, EtherUnit.ETHER)
    } catch (e) {

    }

    return { web3, address, balance, balanceChain, transferUSDT, dataToSignfunc, getUniverseApi, universeWithdrawalApi, universeBuyOneApi,safeTransferFrom }; // 返回web3、账户地址、账户余额、转账函数
}

export default connectWallet;

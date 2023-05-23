import {ref} from "vue";
import {trxSun} from "@/utils/rules";

const getToken = () => {
    return localStorage.getItem("token");
};

const setToken = (token: string) => {
    localStorage.setItem("token", token);
};

const clearAll = () => {
    localStorage.setItem("connectButtonPop", String(true))
    localStorage.removeItem("wallet_addr");
    localStorage.removeItem("token");
};

const ConnectButtonPop = () => {
    if (
        localStorage.getItem("connectButtonPop") === null ||
        localStorage.getItem("connectButtonPop") === ""
    ) {
        localStorage.setItem("connectButtonPop", "true");
    }
    return localStorage.getItem("connectButtonPop");
};

const GetTabName = (TabName: string) => {
    if (
        localStorage.getItem(TabName) === null ||
        localStorage.getItem(TabName) === ""
    ) {
        if (TabName === 'MenuTabName'){
            localStorage.setItem(TabName, "home");
        } else if (TabName === 'PandoraTabName') {localStorage.setItem(TabName, "magicBoxes");}
        else {localStorage.setItem(TabName, "overview");}
    }
    return localStorage.getItem(TabName);
};

const walletAddress = ref(window.localStorage.getItem("wallet_addr")!);
const contractAddress = "TWfdTntMxGiWVSCEigReZjeMdAuf5Ra2tT";
const balance = ref(0);
//TODO 编译报错
// const getRounds = async() => {
//    try {
//        let contract = await window.tronWeb.contract().at(contractAddress)
//        let ans = await contract.showPr().call();
//        return Number(ans[2])
//    }catch (e) {
//
//    }
// };
const connectButtonPop = ref(ConnectButtonPop()!);
const waitingPop = ref(false);
const activeName3 = ref(GetTabName("TribeTabName")!);

const hostName = "192.168.100.72:2133/AvatarHome"

export {
    getToken,
    setToken,
    clearAll,
    GetTabName,
    ConnectButtonPop,
    walletAddress,
    contractAddress,
    balance,
    // getRounds,
    connectButtonPop,
    waitingPop,
    activeName3,
    hostName
};

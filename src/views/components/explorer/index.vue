<script setup lang="ts">
import Card from '@/components/card/index.vue'
import MainStore from "@/store";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { delayExecution, formatDate, formatDateMMDDHHNN, formatDateY } from "@/utils/time";
import { UniverseData } from "@/web3/connectWallet";
import { calculateProfitability, convertEtherUnits, EtherUnit, probability, probabilityUser } from "@/utils/etherUnit";
import { onBeforeRouteLeave } from "vue-router";
import { askForCookieAuthorization, checkCookieAuthorization, getCookieValue, setCookieValue } from "@/utils/cookie";
import { ElMessage, ElMessageBox } from "element-plus";
import { CountDown } from "@/utils/settime";
import request from "@/request"; //引入axios

// 倒计时时间
const countDownTime = 86400 * 7;
// const countDownTime = 900;

///buy/info 接口数据
interface ACInfoRes {
  current_round: number; // 当前轮数
  sub_round: number; // 当前子轮数
  can_apply: boolean; // 当前子轮数是否可以申请,如果申请，是当前子轮数+1的子轮
  can_buy: boolean; // 当前子轮数是否可以购买
  value: number; // 可以买多少，如果不可以购买忽略这个字段,单位是 ETH整数个，不是小数，也不是wei,无脑渲染，第一次买已经设置为100
  end_time: number; // 本子轮结束时间 time unix 秒级
  userBalances: number
}



interface VipInfo {
  vipLevel: '';
  shanAddress: '';
}

//用户下注记录 结构体 提供前端渲染
type UserBet = { id: any; round: any; bet_amount: string; bet_extract: string; betting_time_str: number | string; betting_time_unix: any; return_rate: string; day7_rate: string; state: string; d: number; incrementOne: any; h: number; m: number; s: number; }
const State = MainStore()

//bettingTime 下注时间
//blockTimestamp 当前区块时间
const day7Proportion = (bettingTime: number, blockTimestamp: number): string => {
  if (!bettingTime || !blockTimestamp) {
    return "0";
  }
  const SECONDS_PER_DAY = 86400;
  const sevenDaysInSeconds = SECONDS_PER_DAY * 7;

  // 计算从投注时间到当前区块时间的时间差，单位为秒
  const timeDifference = blockTimestamp - bettingTime;

  // 计算时间差占七天时间的百分比
  const proportion = (timeDifference / sevenDaysInSeconds) * 100;

  // console.log("proportion---------------------------------------------------------------------")
  // console.log("bettingTime:",bettingTime)
  // console.log("blockTimestamp:",blockTimestamp)
  // console.log("proportion.toFixed(0)",proportion.toFixed(0))
  // console.log("proportion",proportion)
  // console.log("proportion---------------------------------------------------------------------")
  // 返回百分比字符串，保留两位小数
  // return proportion.toFixed(2) + '%';
  if (proportion > 100) {
    return "100";
  }
  return proportion.toFixed(0)
}


const universeData = ref<UniverseData | any>({}); // 初始值为null
const blockTimestampStr = ref<string>(""); // 现在区块时间
const creationTimeWarehouseStr = ref<string>(""); // 创建时间
const daysGetInterest = ref<string>(""); // 递增收益
const cookieOk = ref(false);//Cookie 弹窗提示
const empower = ref(100);//授权金额
const aCInfoRes = ref<ACInfoRes | any>({});
const vipInfo = ref({
  vipLevel: '',
  shanAddress: '',
});
cookieOk.value = checkCookieAuthorization();//检查Cookie是否授权

const userBetList = ref<UserBet[]>([]); // 用户订单列表
const fetchData = async () => {
  console.log("fetchData....")
  const data = await State.getUniverseApi();
  universeData.value = data; // 将数据存储到响应式数据中
  blockTimestampStr.value = formatDateY(universeData!.value?.blockTimestamp)
  creationTimeWarehouseStr.value = formatDateY(universeData.value?.creationTimeWarehouse)
  // console.log('creationTimeWarehouseStr.value:', universeData.value?.creationTimeWarehouse)
  const proRet = probability(universeData.value?.creationTimeWarehouse, data.blockTimestamp)
  daysGetInterest.value = proRet.increment;
  let userBetListNew = [];
  for (const { id, round, amount, bettingTime, state, extract, incrementOne } of data!.UserBetRecords) {
    const _round = round;
    const _bet_amount = convertEtherUnits(amount, EtherUnit.WEI, EtherUnit.ETHER);//下注金额
    const _bet_extract = convertEtherUnits(extract, EtherUnit.WEI, EtherUnit.ETHER);//提现金额
    const _betting_time_str = formatDateMMDDHHNN(bettingTime);//下注时间 05/02 00:37:04
    let _return_rate = "0";//收益率 60 = 60%
    let _day7_rate = day7Proportion(bettingTime, data.blockTimestamp);//7日锁仓进度
    let _state = ""
    const time = (+bettingTime + (1 * countDownTime))
    if ((time - Math.round(new Date().getTime() / 1000)) > 0) {
      countDown.getTime(time)
    }
    //当前轮次
    /*
       链上返回数据： 0投注，1=已提现，2=已爆仓提现，
       注：不同轮次下没提现则爆仓，需要锁仓7天才能提币
       视图渲染： 1=投注中 没爆仓 未7天 不可提，
                2=投注中 爆仓了 未7天 不可提，
                3=投注中 爆仓了 锁7天了 可提币
                4=投注中 没爆仓 锁7天了 可提币
                5=已提现 没爆仓
                6=已提现 爆仓了
                7=数据上链中 操作中
     */
    //投注中
    if (state == "0") {
      //当前轮次投注中
      if (round.toString() == data.indexWarehouse) {
        //锁7天了 可提币
        if (_day7_rate == "100") {
          _state = "4";// 4=投注中 没爆仓 锁7天了 可提币
        } else {
          _state = "1";//1=投注中 没爆仓 未7天 不可提， //锁仓未满7天
        }
        // bettingTime, data.blockTimestamp
        // incrementOne /10000 *
        _return_rate = (incrementOne / 10000 * (7 - (+countDown.day + 1))) + '';//计算用户收益率
      }

      //过往轮次投注中
      if (round.toString() != data.indexWarehouse) {
        {
          _day7_rate = "100"
          if (_day7_rate == "100") {
            _state = "3";// 3=爆仓了 锁7天了 可提币
          } else {
            _state = "2";//投注中 爆仓了 未7天 不可提，
          }
          _return_rate = "-40" //只能提取60%保底 所以收益率固定 -40%
        }
      }
    }
    //这里插入特殊判断 cookie 是否有上链中的数据
    const cIdData = getCookieValue(id)//获取cookie 要不要在上链的id数据
    if (cIdData != "") {
      _state = "7";
    }

    //提现
    if (state == "1") {
      _day7_rate = "100"
      _return_rate = calculateProfitability(amount, extract).toString();//更具实际情况计算 收益率
      _state = "5";//5=已提现 没爆仓
    }
    //已爆仓提现
    if (state == "2") {
      _day7_rate = "100"
      _return_rate = calculateProfitability(amount, extract).toString();//更具实际情况计算 收益率
      _state = "6";//6=已提现 爆仓了
    }

    userBetListNew.unshift({
      id: id,
      round: _round,
      bet_amount: _bet_amount.toString(),
      bet_extract: _bet_extract.toString(),
      betting_time_str: _betting_time_str,
      betting_time_unix: bettingTime,//TODO  下注时间秒  倒计时7天
      return_rate: _return_rate.toString(),
      day7_rate: _day7_rate,
      state: _state,
      d: +countDown.day,
      incrementOne: incrementOne,
      h: +countDown.hour,
      m: +countDown.min,
      s: +countDown.second
    })
    userBetList.value = userBetListNew;
  }
}

//页面数据加载完


//请求by接口
const fetchHttpData = async () => {
  if (State.currentAccount != "") {
    const re = await request.post(`/buy/info`, { sender: State.currentAccount });//查看预约和购买信息
    if (re.data.code == 0) {
      aCInfoRes.value = re.data.json;
    }
    const re2 = await request.post(`/vipInfo`, { sender: State.currentAccount });//查看预约和购买信息
    if (re2.data.code == 0) {
      vipInfo.value = re2.data.json;
    }
  }
}

const balanceRes = ref({
  balance: '',
  balance_extract: '',
  balance_lock: '',
  balance_k300: '',
  balance_k300_extract: ''
});//用户余额
// 获取用户余额
const fetchBalance = async () => {
  if (State.currentAccount != "") {
    const re = await request.post(`/buy/dynamicReturns`, { sender: State.currentAccount });//查看预约和购买信息
    // console.log("re----")
    if (re.data.code == 0) {
      balanceRes.value = re.data.json;
    }
  }
}

//提取收益
const extract = async (num: number) => {
  if (State.currentAccount != "") {
    //定义类型
    type re = {
      sign: string,
      res: string
      dataToSign: string
    }
    let resd: re
    // 获取时间戳
    const timestamp = Date.now();
    resd = await State.ToSignfunc(timestamp + '');  //签名
    const re = await request.post(`/buy/withdrawalOfIncome`, {
      public_key: State.currentAccount,
      message: timestamp + '',
      signature: resd.sign,
      types: num + ''
    });//查看预约和购买信息
    // console.log("re----")
    if (re.data.code == 0) {
      console.log('re:', re)
    }
  }
}

//授权Cookie
const askForCookie = () => {
  askForCookieAuthorization();
}

onMounted(async () => {
  await delayExecution(1000);
  console.log("onMounted....");
  await fetchData();
  console.log('1:', 1)
  userBetList.value.forEach((item: any, i: number) => {
    const time = (+item.betting_time_unix + (1 * countDownTime))
    countDown.getTime(time)
    userBetList.value[i].d = +countDown.day
    userBetList.value[i].h = +countDown.hour
    userBetList.value[i].m = +countDown.min
    userBetList.value[i].s = +countDown.second
    timing(item, i)
  })
  fetchHttpData();
  fetchBalance();
});
//设置定时器
const intervalId = setInterval(function () {
  fetchData();
  fetchHttpData();
  fetchBalance();
}, 5000); // 启动轮询函数并保存定时器 ID
// 在组件卸载前清除定时器
onBeforeUnmount(() => {
  clearInterval(intervalId);
  clearInterval(timer);
});

// 在用户离开或切换路由前清除定时器
onBeforeRouteLeave((to, from, next) => {
  console.log("销毁：intervalId", intervalId)
  clearInterval(intervalId);
  next();
});

//链 提现操作
const universeWithdrawal = (id: number) => {
  if (State.account) {
    State.universeWithdrawalApi(id, function () {
      setCookieValue(id.toString(), "send chain", 7)
      fetchData();
    });
  }
}

//申请购买金额 调用后台接口
const authorizeBuyOne = (num: number) => {
  ElMessageBox.confirm(
    '际配额会小于预约金额，实际配额将在下个窗口分配至您，如果下个窗口内没购买配额的计划，或者企图绕过限制，将会受到信用评级违规处罚，限制申请和购买3日',
    '提示',
    {
      confirmButtonText: '确认提交',
      cancelButtonText: '关闭',
    }
  )
    .then(async () => {
      let balance = convertEtherUnits(State.balanceChain, EtherUnit.WEI, EtherUnit.ETHER)
      if (balance < num) {
        ElMessage({
          type: 'error',
          message: '余额不足',
        })
        return;
      }
      const ret = await request.post(`/buy/apl`, { apl: num, sender: State.currentAccount });//查看预约和购买信息
      if (ret.data.code == 0) {
        //成功提示
        ElMessage({
          type: 'success',
          message: '操作成功',
        })
        fetchData();
        fetchHttpData();
      } else {
        //拒绝提示
        ElMessage({
          type: 'info',
          message: '操作失败',
        })
      }
    })
    .catch(() => {
      //拒绝提示
      ElMessage({
        type: 'info',
        message: '操作失败',
      })
    })
}

//链调用合约 下注接口
const fromBuyOne = async () => {
  //判断余额是否够
  let balance = convertEtherUnits(State.balanceChain, EtherUnit.WEI, EtherUnit.ETHER)
  if (balance < aCInfoRes.value.value && aCInfoRes.value.value > 0) {
    ElMessage({
      type: 'error',
      message: '余额不足',
    })
    return;
  }
  //接口提交下注
  const ret = await request.post(`/buy/buy1`, { value: aCInfoRes.value.value, sender: State.currentAccount });
  if (ret.data.code == 0) {
    const retJson = ret.data.json
    console.log(retJson)
    State.universeBuyOneApi(retJson.id, retJson.sender, retJson.end_time, retJson.value, retJson.sign, (hash: any) => {
      request.post(`/buy/orders`, { hash: hash });//查看预约和购买信息
      fetchHttpData();
    });
  }
  // async (id: number,sender:string,endTime:number,amount:number,signature:string, okFunc: () => void) => {
}


const countDown = new CountDown()//初始化
let timer: number | NodeJS.Timer
const timing = (item: any, i: number) => {
  const time = (+item.betting_time_unix + (1 * countDownTime))
  if ((time - Math.round(new Date().getTime() / 1000)) < 0) {
    return
  }
  timer = setInterval(() => {
    countDown.getTime(time)
    if (countDown.hour == '-1' && +countDown.second < 59) {
      clearInterval(timer)
      return
    }
    userBetList.value[i].d = +countDown.day
    userBetList.value[i].h = +countDown.hour
    userBetList.value[i].m = +countDown.min
    userBetList.value[i].s = +countDown.second
  }, 1000)
}
</script>

<template>
  <div style="height: 70px"></div>
  <div class="container" v-if="!State.account">
    <div class="cardthree">
      <Card style="margin-bottom: 10px;" bradius="10px">
        <div class="cardthree-item" style="">
          <p style="color: crimson">{{ $t('explorer.check') }}</p>
        </div>
      </Card>
    </div>
  </div>
  <!-- <div class="container" v-if="!cookieOk">
    <div class="cardthree">
      <Card style="margin-bottom: 10px;" bradius="10px">
        <div class="cardthree-item" style="">
          <div class="cardthree-text">
            <p>{{ $t('explorer.authorization') }}</p>
          </div>
          <div class="cardthree-text">
            <button class="tech-button3" style="width: 100%" @click="askForCookie">{{ $t('explorer.author') }}</button>
          </div>
        </div>
      </Card>
    </div>
  </div> -->
  <div :class="[!State.account ? 'glass-effect' : '']">
    <div style="height: 15px"></div>
    <div class="container">
      <div class="blur-bg"></div>
      <div class="cardthree">
        <Card style="margin-bottom: 10px;" bradius="10px">
          <!-- <div class="cardthree-text" style="text-align: center">
            <div style="font-size: 100px;text-shadow: 0 0 10px #FFF"> {{ universeData?.indexWarehouse }}</div>
            <span style="font-size: 20px;height: 10px">{{ $t('explorer.Currentround') }}</span>
            <div class="cardthree-text" style="height: 10px">
              {{ creationTimeWarehouseStr }}
            </div>
          </div> -->
          <!-- <div class="cardthree-item" style="height: 30px">
          </div> -->
          <!--          <div style="height: 20px"></div>-->
          <!--          <div style="height: 20px"></div>-->
          <div class="cardthree-item" style="">
            <!--            <div style="height: 10px">{{ $t('explorer.Revenuepoolvolume') }}: {{-->
            <!--              convertEtherUnits(universeData?.profitPool, EtherUnit.WEI, EtherUnit.ETHER)-->
            <!--            }} ETH</div>-->
            <!--            <div style="height: 10px">{{ $t('explorer.Revenuepoolvolume') }}: {{-->
            <!--              convertEtherUnits(universeData?.profitPool, EtherUnit.WEI, EtherUnit.ETHER)-->
            <!--            }} ETH</div>-->
            <div style="display: flex;align-items: center;">{{ $t('explorer.Subsidyincome') }}: {{ daysGetInterest }}% /
              {{ $t('explorer.day') }} <i class="hover-text">?
                <div class="text">
                  从每一轮第一日起，当日的补贴收益逐日增长0.005%，越往后收益越高，最高补贴截止0.5%，和静态收益分开计算
                </div>
              </i></div>
          </div>
          <div class="cardthree-item" style="height: 10px">
            <!-- <div style="height: 10px">{{ $t('explorer.Cumulativebet') }}: {{ universeData?.WarehouseBets?.length }}</div> -->
            <div>{{ $t('explorer.staticincome') }}:1%</div>
          </div>
          <div style="height: 20px"></div>
        </Card>
      </div>
      <div style="height: 20px"></div>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div class="cardthree">
            <Card style="margin-bottom: 10px;" bradius="10px">
              <div class="cardthree-item" style="">
                <div class="cardthree-text">
                  <p>{{ $t('explorer.Applicationforpurchasescheme') }}</p>
                </div>
                <div class="cardthree-text">
                  {{ aCInfoRes.can_apply ? $t('explorer.subscribable') : $t('explorer.subscribed') }}
                </div>
              </div>
              <div style="height: 20px"></div>
              <div class="cardthree-item" style="">
                <div class="cardthree-text">
                  <p>{{ $t('explorer.Currentround') }}: {{ aCInfoRes.current_round }}</p>
                </div>
                <div class="cardthree-text">
                  <p>{{ aCInfoRes.sub_round }} :{{ $t('explorer.Totalcirculation') }}</p>
                </div>
              </div>
              <div style="height: 20px"></div>
              <div class="cardthree-text">
                <p>{{ $t('explorer.Subscriptionamount') }}: {{ empower }}</p>
                <p style="padding-left: 0px;">
                  <el-slider v-model="empower" :show-stops="true" :step="100" :max="2000" show-input />
                </p>
              </div>
              <div style="height: 20px"></div>
              <button :disabled="!aCInfoRes.can_apply" class="tech-button" style="width: 100%"
                @click="authorizeBuyOne(empower)">
                {{ aCInfoRes.can_apply ? $t('explorer.Immediateapplication') : $t('explorer.subscribed') }}</button>
            </Card>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div :class="['cardthree', !aCInfoRes.can_buy ? 'whitwbool' : '']">
            <Card style="margin-bottom: 10px;" bradius="10px">
              <div class="cardthree-item" style="">
                <div class="cardthree-text">
                  <p>{{ $t('explorer.Applicationresults') }}</p>
                </div>
                <div class="cardthree-text">
                  {{ aCInfoRes.can_buy ? $t('explorer.available') : "" }}
                </div>

                <!-- <div class="cardthree-text">
                </div> -->
              </div>
              <div style="height: 66px"></div>
              <div class="cardthree-item" style="">
                <div class="cardthree-text">
                  <!--                  <p>轮次: {{aCInfoRes.can_buy}}</p>-->
                  <p>{{ $t('explorer.Subscriptionamount') }}: {{ aCInfoRes.value }}</p>
                  <p>{{ $t('explorer.endtime') }}: {{ formatDateMMDDHHNN(aCInfoRes.end_time) }}</p>
                </div>
                {{ $t('explorer.Balanceofbets') }} :{{ convertEtherUnits(+universeData?.userBalances, EtherUnit.WEI,
                  EtherUnit.ETHER) }}
              </div>

              <div style="height: 20px"></div>
              <button v-if="aCInfoRes.can_buy" class="tech-button" style="width: 100%" @click="fromBuyOne">{{
                $t('explorer.Placeabet') }}</button>
              <button v-if="!aCInfoRes.can_buy" class="tech-button" style="width: 100%;background: #585a86">{{
                $t('explorer.prohibit') }}</button>
            </Card>
          </div>
        </el-col>
      </el-row>
      <div class="cardthree">
        <Card style="margin-bottom: 10px;" bradius="10px">
          <!-- 我的动态收益 -->
          <div class="cardthree-item" style="">
            <div class="cardthree-text">
              <p>{{ $t('explorer.Mydynamicincome') }}</p>
            </div>
          </div>
          <div style="height: 20px"></div>
          <div class="cardthree-item" style="">
            <el-row :gutter="10" style="width: 100%;">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="item-col-one">
                <div class="cardthree-text">
                  {{ $t('explorer.Currentbalance') }}：
                  {{ balanceRes.balance }} MATIC
                </div>
              </el-col>
              <!--              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="item-col-one">-->
              <!--                <div class="cardthree-text">-->
              <!--                  {{ $t('explorer.Withdrawnbalance') }}：-->
              <!--                  {{ balanceRes.balance_extract }} MATIC-->
              <!--                </div>-->
              <!--              </el-col>-->
              <!-- <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="item-col-one">
                <div class="cardthree-text">
                  {{ $t('explorer.Processing') }}：
                  {{ balanceRes.balance_lock }} ETH
                </div>
              </el-col> -->
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="item-col-one">
                <div class="cardthree-btn" @click="extract(1)" style="width: 100px;">
                  {{ $t('explorer.Extract') }}
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="cardthree-item" style=""
            v-if="balanceRes.balance_k300 != '0' && balanceRes.balance_k300_extract != '0'">
            <el-row :gutter="10" style="width: 100%;">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="item-col-one">
                <div class="cardthree-text">
                  {{ $t('explorer.Mydirectpush') }}：
                  {{ balanceRes.balance_k300 }} MATIC
                </div>
              </el-col>
              <!--              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="item-col-one">-->
              <!--                <div class="cardthree-text">-->
              <!--                  {{ $t('explorer.Myteam') }}：-->
              <!--                  {{ balanceRes.balance_k300_extract }} MATIC-->
              <!--                </div>-->
              <!--              </el-col>-->
              <!-- <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="item-col-one">
                <div class="cardthree-text">
                  {{ $t('explorer.Processing') }}：
                  {{ balanceRes.balance_lock }} ETH
                </div>
              </el-col> -->
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="item-col-one">
                <div class="cardthree-btn" style="width: 100px;" @click="extract(2)">
                  {{ $t('explorer.Extract') }}
                </div>
              </el-col>
            </el-row>
          </div>
          <div style="height: 20px"></div>
        </Card>
      </div>
      <div style="height: 20px"></div>


      <div style="height: 30px"></div>
      <Card style="margin-bottom: 10px;" bradius="10px">
        <el-table :data="userBetList" style="width: 100%;background: var(--el-bg-color); border-radius: 9px;">
          <el-table-column prop="round" :label="$t('explorer.rotation')"></el-table-column>
          <el-table-column :label="$t('explorer.Placeabet1')" style="white-space: nowrap;">
            <template #default="scope">
              {{ scope.row.bet_amount }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('partner.Withdrawcash')">
            <template #default="scope">
              {{ scope.row.bet_extract }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('explorer.Bettingtime')">
            <template #default="scope">
              {{ scope.row.betting_time_str }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('explorer.Rateofreturn')">
            <template #default="scope">
              <div v-if="scope.row.return_rate.includes('-')" style="color: #cf4444">{{ scope.row.return_rate + '%' }}
              </div>
              <div v-if="!scope.row.return_rate.includes('-')" style="color: #1dc779">+{{ scope.row.return_rate + '%' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('explorer.Lockupschedule')" width="150">
            <template #default="scope">
              <div v-if="scope.row.h >= 0 && scope.row.day7_rate != '100'">
                {{ +scope.row.d <= 0 ? '' : scope.row.d + $t('explorer.dayTime') }} {{ +scope.row.h < 10 ? '0' +
                  scope.row.h : scope.row.h }}{{ $t('explorer.hourTime') }} {{ +scope.row.m < 10 ? '0' + scope.row.m :
    scope.row.m }}{{ $t('explorer.minuteTime') }} {{ +scope.row.s < 10 ? '0' + scope.row.s : scope.row.s
  }}{{ $t('explorer.secondTime') }} </div>
                  <div v-else>{{ $t('explorer.Over') }}</div>
                  <el-progress :percentage="scope.row.day7_rate" color="#524dfb"></el-progress>

            </template>
          </el-table-column>
          <!--          <el-table-column label="测试提">-->
          <!--            <template #default="scope">-->
          <!--              <div><button class="tech-button2" style="width: 100%;"-->
          <!--                  @click="universeWithdrawal(scope.row.id)">测试提</button></div>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column label="测试提">-->
          <!--            <template #default="scope">-->
          <!--              <div><button class="tech-button2" style="width: 100%;"-->
          <!--                  @click="universeWithdrawal(scope.row.id)">测试提</button></div>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column :label="$t('explorer.Statusoperation')" fixed="right" header-align="center">
            <template #default="scope">
              <!--              视图渲染： 1=投注中 没爆仓 未7天 不可提，-->
              <!--              2=投注中 爆仓了 未7天 不可提，-->
              <!--              3=投注中 爆仓了 锁7天了 可提币-->
              <!--              4=投注中 没爆仓 锁7天了 可提币-->
              <!--              5=已提现 没爆仓-->
              <!--              6=已提现 爆仓了-->
              <!--              7=数据上链中 操作中-->
              <div style="text-align: center">
                <div v-if="scope.row.state === '1'">{{ $t('explorer.Inthebetting') }}</div>
                <div v-if="scope.row.state === '2'">
                  <button class="tech-button2" style="width: 100%;" @click="universeWithdrawal(scope.row.id)">{{
                    $t('explorer.close') }}
                  </button>
                </div>
                <div v-if="scope.row.state === '3'">
                  <button class="tech-button2" style="width: 100%;" @click="universeWithdrawal(scope.row.id)">{{
                    $t('explorer.close') }}
                  </button>
                </div>
                <div v-if="scope.row.state === '4'">
                  <button class="tech-button2" style="width: 100%;" @click="universeWithdrawal(scope.row.id)">{{
                    $t('explorer.Withdrawalofcurrency') }}
                  </button>
                </div>
                <div v-if="scope.row.state === '5'">{{ $t('partner.Alreadymentioned') }}</div>
                <div v-if="scope.row.state === '6'">{{ $t('explorer.closed') }}</div>
                <div v-if="scope.row.state === '7'">
                  <button class="tech-button2" style="width: 100%;">{{
                    $t('explorer.Upperchain')
                  }}
                  </button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </Card>
      <div style="height: 30px"></div>
      <div>
        <Card title="">
          <div class="cardthree-item" style="">
            <div class="cardthree-text">
              <h3> VIP：{{ vipInfo.vipLevel }}</h3>
            </div>
            <div class="cardthree-text">
              <h3>{{ $t('explorer.Recommendedwalletaddress') }}：{{ vipInfo.shanAddress != '' ?
                State.replaceStr(vipInfo.shanAddress)
                :
                $t('explorer.wu') }}</h3>
            </div>
          </div>
        </Card>
        <div style="height: 30px"></div>

        <Card :title="$t('explorer.Relationallist')">
          <el-table :data="State.ReList" style="background: var(--el-bg-color);border-radius: 9px;">
            <el-table-column :label="$t('explorer.Walletaddress')" header-align="center" :align="'center'">
              <template #default="scope">
                {{ State.replaceStr(scope.row.ChainAddress) }}

              </template>
            </el-table-column>
            <el-table-column :label="$t('explorer.performance')" header-align="center" :align="'center'">
              <template #default="scope">
                <i style="color: greenyellow;">
                  {{ scope.row.Achievement }}
                </i>
              </template>
            </el-table-column>
          </el-table>
        </Card>
      </div>
    </div>
    <div style="height: 30px"></div>
  </div>
</template>


<style scoped lang="less">
.explorer {
  background-color: @xtxColor;
  width: 100%;
  height: 100%;
  padding-top: 70px;

  .container {
    position: relative;
    z-index: 1; //三级
    width: 100%;
    height: calc(100vh - 70px);
    color: aliceblue;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

//.el-table {
//  border-radius: 10px;
//  overflow: hidden;
//}

//.el-table thead th {
//  background-image: -webkit-linear-gradient(0deg,
//  rgba(168, 42, 231, 0.88),
//  rgba(83, 77, 251, 0.88));
//}

//.row-bg {
//  background-color: #f0f2f5;
//}

//.el-progress--text {
//  color: #524dfb;
//}
.whitwbool {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: #ffffff4d;
    border-radius: 10px;
    // opacity: 0.5;
  }
}

.cardthree-item {
  width: 100%;
  font-size: 18px;
  display: flex;
  justify-content: space-between;

  .item-col-one {
    display: flex;
    justify-content: center;
    padding: 5px;
  }

  .cardthree-text2 {
    // width: 80%;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: #ffffff37;
    border-radius: 10px;
    padding: 10px;
  }

  .btn-desable {
    min-width: 60px;
    margin-left: 10px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #3e3086;
    border-radius: 10px;
    font-size: 18px;
    color: #c0c048;
    font-family: Manrope-Regular;
    cursor: not-allowed;
    white-space: nowrap;
  }

  .cardthree-btn {
    padding: 5px 10px;
    min-width: 60px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9f840;
    border-radius: 10px;
    font-size: 18px;
    color: #5942d3;
    font-family: Manrope-Regular;
    cursor: pointer;
    white-space: nowrap;
  }

  .hover-text {
    position: relative;
    display: inline-block;
    border: 1px solid #f9f840;
    width: 18px;
    height: 18px;
    font-size: 12px;
    text-align: center;
    border-radius: 15px;
    margin: 0 5px;
    background-color: #f9f840;
    color: #5942d3;

    .text {
      display: none;
      //文字超出换行
      white-space: normal;
      position: absolute;
      background: #000000;
      color: #fff;
      width: 200px;
      height: 100px;
      top: 18px;
      right: 0;
      padding: 10px;
      border-radius: 10px;
      // opacity: 0.5;
    }

    &:hover {
      .text {
        display: block;
      }
    }
  }
}

.container {
  position: relative;
}

//.blur-bg {
//  position: absolute;
//  top: 0;
//  left: 0;
//  right: 0;
//  bottom: 0;
//  background-image: url("path/to/your/image.jpg");
//  filter: blur(5px);
//  z-index: -1;
//}

@media screen and (max-width: 768px) {
  .watchhead {
    font-size: 12px;
  }

  .el-table-column {
    min-width: 100px !important;
  }
}

.tech-button {
  background: linear-gradient(to right, #0071c5, #8A2BE2);
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 18px;
  border-radius: 8px;
  width: auto;
  transition: background-color 0.3s ease;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.69);
}

.tech-button:hover {
  border: 2px solid #5656af;
  background: linear-gradient(to right, #6a1cd3, #0056b3);
}

.tech-button2 {
  background: linear-gradient(to right, #0071c5, #8A2BE2);
  color: rgba(255, 255, 255, 0.78);
  border: none;
  padding: 8px 0px;
  font-size: 14px;
  border-radius: 8px;
  width: auto;
  transition: background-color 0.3s ease;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.tech-button2:hover {
  background: linear-gradient(to right, #034372, #361059);
}

.tech-button3 {
  background: linear-gradient(to right, #0071c5, #8A2BE2);
  color: #fff;
  border: none;
  padding: 5px 20px;
  font-size: 15px;
  border-radius: 8px;
  width: auto;
  transition: background-color 0.3s ease;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.69);
}

.tech-button3:hover {
  border: 2px solid #5656af;
  background: linear-gradient(to right, #6a1cd3, #0056b3);
}

.glass-effect {
  position: relative;
  z-index: 999;
}

.glass-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 80vh;
  backdrop-filter: blur(8px);
  z-index: 99999;
  pointer-events: none;
}
</style>

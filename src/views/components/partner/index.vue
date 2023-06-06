<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { onMounted, ref } from 'vue'
import { formatDateY } from '@/utils/time'
import { myNgt, myTransactionsRep, transactionInfo } from '@/api/flow'
import {
  depositNgt,
  withdrawNgt,
  withdrawNgtReq,
  depositNgtReq
} from '@/api/wallet'
import Clipboard from 'vue-clipboard3'
import { ElMessage } from 'element-plus'
import MainStore from '@/store'
const { toClipboard } = Clipboard()
const State = MainStore() //获取store
let chainValue = ref('')
const navValue = ref(0)
const navList = ['全部', '充值', '提现']
const txsRes = ref({
  benefit_info: {
    balance: 0,
    last_day_benefit: 0,
    accumulated_benefit: 0
  },
  transactions: [] as transactionInfo[]
} as myTransactionsRep)

const num = ref(0)
let depositList = ref({ transactions: [] as transactionInfo[] })
let withdrawList = ref({ transactions: [] as transactionInfo[] })
async function dataInit() {
  try {
    // config.headers = { 'Access-Control-Allow-Origin': '*' };
    // config.headers = {
    //   'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
    // };
    // config.headers = {
    //   'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    // };
    // config.headers = {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    // };
    const res = await myNgt()
    console.log(res.data)
    txsRes.value.benefit_info = res.data.json.benefit_info
    txsRes.value.transactions = res.data.json.transactions
    for (let i = 0; i < res.data.json.transactions.length; i++) {
      if (res.data.json.transactions[i].transaction_type == '1') {
        depositList.value.transactions.push(res.data.json.transactions[i])
      }
      if (res.data.json.transactions[i].transaction_type == '2') {
        withdrawList.value.transactions.push(res.data.json.transactions[i])
      }
    }
  } catch (err) {
    console.log('query myNgt err-------------------')
    console.log(err)
  }
}
const copy = async (hash: string) => {
  try {
    const res = await toClipboard(hash)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const deposit = async () => {
  try {
    if (chainValue.value == '') {
      ElMessage.error('请选择公链')
      return
    }
    if (num.value == 0) {
      ElMessage.error('请输入数量')
      return
    }
    let req = {
      num: num.value,
      address: State.account,
      hash: '0x63c48fe0c1f4b60f6ae90b86ea91051b06fb8b371068db84c0ad68a54e9a466c',
      chain: chainValue.value
    } as depositNgtReq
    const res = await depositNgt(req)
    if (res.data.code == 0) {
      ElMessage.success('充值成功')
      return
    } else {
      ElMessage.error('充值失败')
      return
    }
  } catch (error) {
    ElMessage.error('充值失败')
    return
  }
}
const withdraw = async () => {
  try {
    if (chainValue.value == '') {
      ElMessage.error('请选择公链')
      return
    }
    if (num.value == 0) {
      ElMessage.error('请输入数量')
      return
    }
    let req = {
      num: num.value,
      address: State.account,
      chain: chainValue.value
    } as depositNgtReq
    const res = await depositNgt(req)
    if (res.data.code == 0) {
      ElMessage.success('充值成功')
      return
    } else {
      ElMessage.error('充值失败')
      return
    }
  } catch (error) {
    ElMessage.error('提现失败')
    return
  }
}
onMounted(() => {
  dataInit()
})
</script>
<script lang="ts">
export default {
  name: 'Partner'
}
</script>
<template>
  <div class="partner">
    <!-- 居中 -->
    <div class="container">
      <div class="main">
        <!-- 我的NGT--start -->
        <Card>
          <div class="partner_one_box">
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_top alive-light">
                {{ $t('explorer.balance') }}
              </div>
              <div class="partner_one_box_item_bom alive-light">
                {{ txsRes.benefit_info.balance }} <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_top alive-light">
                {{ $t('explorer.yesterdayIncome') }}
              </div>
              <div class="partner_one_box_item_bom alive-light">
                {{ txsRes.benefit_info.last_day_benefit }} <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_top alive-light">
                {{ $t('explorer.accumulateIncome') }}
              </div>
              <div class="partner_one_box_item_bom alive-light">
                {{ txsRes.benefit_info.accumulated_benefit }} <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item" style="margin-top: 10px">
              <div class="partner_one_box_item_btn">
                <span @click="navValue = 3">{{ $t('partner.navList2') }}</span>
                <span @click="navValue = 4">{{ $t('partner.navList3') }}</span>
              </div>
            </div>
          </div>
        </Card>
        <!-- 我的NGT--end -->
        <!-- 质押订单--start -->
        <div class="alive-light" style="font-size: 20px; margin-top: 20px">
          {{ $t('partner.znzz') }}
        </div>
        <Card class="partner_two_box">
          <div class="partner_two_box_nav">
            <div
              :class="[
                'partner_two_box_nav_btn',
                navValue == index ? 'active' : ''
              ]"
              v-for="(item, index) in navList"
              :key="index"
              @click="navValue = index"
            >
              <span class="alive-light" v-if="index == 0">{{
                $t('partner.navList1')
              }}</span>
              <span class="alive-light" v-if="index == 1">{{
                $t('partner.navList2')
              }}</span>
              <span class="alive-light" v-if="index == 2">{{
                $t('partner.navList3')
              }}</span>
            </div>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 0">
            <Card v-for="(item, index) in txsRes.transactions" :key="index">
              <div class="box_body_item_top">
                <span v-if="item.transaction_type == '1'">{{
                  $t('partner.navList2')
                }}</span>
                <span v-if="item.transaction_type == '2'">{{
                  $t('partner.navList3')
                }}</span>
                <span>{{ item.num }}NGT</span>
                <span>{{ item.chain }}</span>
                <span v-if="item.status == '1'" class="alive-light">{{
                  $t('partner.confirming')
                }}</span>
                <span v-if="item.status == '2'" class="alive-light">{{
                  $t('partner.confirmed')
                }}</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.address') }}</span>
                  <span class="addres">{{ item.address }}</span>
                </div>
                <div
                  class="box_body_item_bom__item"
                  style="display: flex; align-items: center"
                >
                  <span>{{ $t('partner.hash') }}</span>
                  <span class="addres"
                    >{{ item.hash.slice(0, 32) }}********
                  </span>
                  <div class="copyBtn" @click="copy(item.hash)">
                    <img src="../../../assets/images/VectorMini.png" alt="" />
                  </div>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.applicationTime') }}</span>
                  <span>{{ formatDateY(item.ask_for_time) }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.timeOfReceipt') }}</span>
                  <span>{{ formatDateY(item.achieve_time) }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.commission') }}</span>
                  <span>641 NGT</span>
                </div>
              </div>
            </Card>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 1">
            <Card
              v-for="(item, index) in depositList.transactions"
              :key="index"
            >
              <div class="box_body_item_top">
                <span>{{ $t('partner.navList2') }}</span>
                <span>{{ item.num }}NGT</span>
                <span>{{ item.chain }}</span>
                <span v-if="item.status == '1'" class="alive-light">{{
                  $t('partner.confirming')
                }}</span>
                <span v-if="item.status == '2'" class="alive-light">{{
                  $t('partner.confirmed')
                }}</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.address') }}</span>
                  <span class="addres">{{ item.address }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.hash') }}</span>
                  <span class="addres"
                    >{{ item.hash.slice(0, 32) }}********
                    <div class="copyBtn" @click="copy(item.hash)">
                      <img src="../../../assets/images/VectorMini.png" alt="" />
                    </div>
                  </span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.applicationTime') }}</span>
                  <span>{{ formatDateY(item.ask_for_time) }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.timeOfReceipt') }}</span>
                  <span>{{ formatDateY(item.achieve_time) }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.commission') }}</span>
                  <span>641 NGT</span>
                </div>
              </div>
            </Card>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 2">
            <Card
              v-for="(item, index) in withdrawList.transactions"
              :key="index"
            >
              <div class="box_body_item_top">
                <span>{{ $t('partner.navList3') }}</span>
                <span>{{ item.num }}NGT</span>
                <span>{{ item.chain }}</span>
                <span v-if="item.status == '1'" class="alive-light">{{
                  $t('partner.confirming')
                }}</span>
                <span v-if="item.status == '2'" class="alive-light">{{
                  $t('partner.confirmed')
                }}</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.address') }}</span>
                  <span class="addres">{{ item.address }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.hash') }}</span>
                  <span class="addres"
                    >{{ item.hash.slice(0, 32) }}********
                    <div class="copyBtn" @click="copy(item.hash)">
                      <img src="../../../assets/images/VectorMini.png" alt="" />
                    </div>
                  </span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.applicationTime') }}</span>
                  <span>{{ formatDateY(item.ask_for_time) }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.timeOfReceipt') }}</span>
                  <span>{{ formatDateY(item.achieve_time) }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('partner.commission') }}</span>
                  <span>641 NGT</span>
                </div>
              </div>
            </Card>
          </div>
          <div
            class="partner_cross_box_body"
            style="height: auto"
            v-if="navValue == 3"
          >
            <Card>
              <div class="partner_cross_middle">
                <div class="partner_cross_input">
                  <input
                    class="partner_cross_input_text"
                    type="number"
                    v-model="num"
                    placeholder="请输入数量"
                  />
                </div>
                <el-dropdown trigger="click">
                  <div class="partner_cross_select">
                    <div
                      class="partner_cross_select_text"
                      v-if="chainValue != ''"
                    >
                      {{ chainValue }}
                    </div>
                    <div
                      class="partner_cross_select_text"
                      v-if="chainValue == ''"
                    >
                      {{ $t('plan.chainSelect') }}
                    </div>
                    <div class="partner_cross_select_tri">
                      <img src="../../../assets/images/select.png" />
                    </div>
                  </div>

                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="chainValue = 'Polygon'"
                        >Polygon</el-dropdown-item
                      >
                      <el-dropdown-item @click="chainValue = 'ETH'">
                        ETH
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <div class="partner_cross_button">
                  <div class="partner_cross_button_text" @click="deposit()">
                    {{ $t('partner.deposit') }}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div class="partner_cross_box_body" v-if="navValue == 4">
            <Card>
              <div class="partner_cross_middle">
                <div class="partner_cross_input">
                  <input
                    class="partner_cross_input_text"
                    type="number"
                    v-model="num"
                    placeholder="   请输入数量"
                  />
                </div>
                <el-dropdown trigger="click">
                  <div class="partner_cross_select">
                    <div
                      class="partner_cross_select_text"
                      v-if="chainValue != ''"
                    >
                      {{ chainValue }}
                    </div>
                    <div
                      class="partner_cross_select_text"
                      v-if="chainValue == ''"
                    >
                      {{ $t('plan.chainSelect') }}
                    </div>
                    <div class="partner_cross_select_tri">
                      <img src="../../../assets/images/select.png" />
                    </div>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="chainValue = 'Polygon'"
                        >Polygon</el-dropdown-item
                      >
                      <el-dropdown-item @click="chainValue = 'ETH'"
                        >ETH</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <div class="partner_cross_button">
                  <div class="partner_cross_button_text" @click="withdraw">
                    {{ $t('partner.withdraw') }}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Card>
        <!-- 质押订单--end -->
      </div>
    </div>
    <!-- 居中 -->
  </div>
</template>

<style scoped lang="less">
.button {
  border: 1px solid;
  border-image-source: linear-gradient(
    98.93deg,
    #aafac0 0%,
    rgba(198, 75, 255, 0) 100%
  );
}

.partner {
  // background-color: @xtxColor;
  width: 100%;
  height: 100%;
  padding-top: 70px;

  .container {
    padding-bottom: 30px;
    width: 100%;
    // height: calc(100vh - 70px);
    height: 100%;

    //主体区域
    .main {
      width: 100%;
      height: calc(100% - 70px);
      display: flex;
      flex-direction: column;
      // align-items: center;
      // justify-content: center;
      position: relative;
      z-index: 1; //三级
      // background: pink;
      padding-top: 50px;

      .partner_one_box {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        padding: 20px 0;
        .partner_one_box_item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
          .partner_one_box_item_top {
            font-size: 20px;
          }
          .partner_one_box_item_btn {
            display: flex;
            gap: 20px;
            span {
              font-size: 20px;
              text-align: center;
              line-height: 50px;
              width: 120px;
              height: 50px;
              background: linear-gradient(
                  261.07deg,
                  rgba(255, 255, 255, 0.213) 0%,
                  rgba(0, 0, 0, 0.12) 100%
                ),
                linear-gradient(
                  98.93deg,
                  rgba(23, 183, 69, 0.206) 0%,
                  rgba(44, 62, 198, 0.485) 100%
                );
              border-radius: 50px;
              border: 1px solid #2299de5a;
            }
          }
          .partner_one_box_item_bom {
            font-size: 32px;
            span {
              font-size: 20px;
            }
          }
        }
      }
      .partner_two_box {
        margin-top: 20px;
        .partner_two_box_nav {
          line-height: 34px;
          div {
            font-size: 20px;
            span {
              font-size: 20px;
              margin-left: 0;
            }
          }
          display: flex;
          gap: 20px;
          .partner_two_box_nav_btn {
            width: 100px;
            height: 34px;
            text-align: center;
            line-height: 34px;
            background-color: #ffffff21;
            border-radius: 15px;
            border: 1px solid #38de2266;
          }
          .active {
            background: -webkit-linear-gradient(
                261.07deg,
                #ffffff1b 0%,
                rgba(0, 0, 0, 0) 100%
              ),
              linear-gradient(
                98.93deg,
                #aafac193 0%,
                rgba(198, 75, 255, 0.71) 100%
              ) !important;
            span {
              -webkit-text-fill-color: white !important;
              -webkit-background-clip: none !important;
            }
          }
        }
        .addres {
          //超出省略号
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .partner_two_box_body {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          padding-top: 20px;
          .box_body_item_top {
            display: flex;
            justify-content: space-between;
            span {
              font-size: 16px;
            }
          }
          .box_body_item_bom {
            margin: 20px 0;
            display: flex;
            flex-direction: column;
            gap: 6px;
            .box_body_item_bom__item {
              display: flex;
              span {
                font-size: 16px;
                &:first-child {
                  width: 100px;
                  margin-right: 30px;
                  color: #f5fff8;
                }
                &:last-child {
                  color: #ffffff50;
                }
              }
              .copyBtn {
                width: 30px;
                height: 30px;
                background: #ffffff1a;
                border-radius: 50%;
                border: 1px solid #ffffff1a;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                &:hover {
                  background: #ffffff3d;
                }
              }
            }
          }
          .box_body_item_bom_two {
            display: flex;
            justify-content: space-between;
            span {
              font-size: 16px;
            }
          }
        }
        .partner_cross_box_body {
          margin-top: 20px;
          border-radius: 24px;
          .partner_cross_middle {
            display: flex;
            gap: 25px;
            border-radius: 24px;
            align-items: center;
            .partner_cross_input {
              height: 40px;

              /* border line */

              /* InnerShadow-Box */

              input {
                height: 40px;
                border-radius: 24px;
                background: none;
                font-weight: 400;
                font-size: 16px;
                line-height: 16px;
                display: flex;
                align-items: center;
                padding: 0 20px;
                color: rgb(252, 252, 252);
                &::placeholder {
                  color: #ffffff50;
                }
              }
            }
            .partner_cross_select {
              /* Kinsta */
              display: flex;
              align-items: center;
              justify-content: space-around;
              box-sizing: border-box;

              width: 167px;
              height: 40px;

              background: rgba(144, 79, 79, 0.2);
              backdrop-filter: blur(50px);
              /* Note: backdrop-filter has minimal browser support */

              border-radius: 12px;

              /* Inside auto layout */

              flex: none;
              order: 1;
              flex-grow: 0;
              .partner_cross_select_text {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 18px;
                line-height: 16px;
                /* identical to box height, or 80% */

                display: flex;
                align-items: center;

                color: #ffffff;
              }
              .partner_cross_select_tri {
                width: 22.08px;
                height: 22.08px;

                /* Font-Fill-Bright */

                background: transparent;
                border-radius: 2px;
              }
            }
            .partner_cross_button {
              /* Kinsta */

              box-sizing: border-box;

              /* button-fill */
              background: linear-gradient(
                98.28deg,
                #66a39b 10.61%,
                rgba(97, 112, 252, 0.99) 54.84%,
                rgba(158, 99, 205, 0.994896) 100%
              );
              border-radius: 12px;

              /* 开始质押 */

              width: 167px;
              height: 40px;
              border-radius: 12px;

              /* Inside auto layout */
              line-height: 40px;
              text-align: center;
              .partner_cross_button_text {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 18px;
                /* identical to box height, or 80% */
                color: #ffffff;
              }
            }
          }
        }
      }
    }

    //hover
    .hover {
      &:hover {
        background-color: #ffffffea !important;
        color: @xtxColor !important;
      }
    }
  }
}
</style>

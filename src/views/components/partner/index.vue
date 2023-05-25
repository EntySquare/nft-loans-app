<script setup lang="ts">
import Card from '@/components/card/index.vue'
import {onMounted, ref} from 'vue'
import {myNgt, myTransactionsRep} from "@/api/flow";

const navValue = ref(0)
let isModal1Visible = false
let isModal2Visible = false
const navList = ['全部', '充值', '提现']
const txsRes = ref({
  benefit_info: {
    balance: 0,
    last_day_benefit: 0,
    accumulated_benefit: 0,
  },
  transactions: [],
} as myTransactionsRep);
let depositList = ref({transactions: []} )
let withdrawList = ref({transactions: []} )
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
    const res = await myNgt();
    console.log(res.data)
    txsRes.value.benefit_info = res.data.json.benefit_info;
    txsRes.value.transactions = res.data.json.transactions;
    for (let i = 0; i < res.data.json.transactions.length; i++) {
      if (res.data.json.transactions[i].transaction_type == "1"){
        depositList.value.transactions.push(res.data.json.transactions[i])
      }
      if (res.data.json.transactions[i].transaction_type == "2"){
        withdrawList.value.transactions.push(res.data.json.transactions[i])
      }
    }

  } catch (err) {
    console.log("query myNgt err-------------------");
    console.log(err);
  }
}
const deposit = () => {
  isModal1Visible = true;
  console.log("deposit");
};
const withdraw = () => {
  isModal2Visible = true;
  console.log("withdraw");
};
const closeModal1 = () => {
  isModal1Visible = false;
};
const closeModal2 = () => {
  isModal2Visible = false;
};
onMounted(() => {
  dataInit();
});
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
              <div class="partner_one_box_item_top alive-light">持有</div>
              <div class="partner_one_box_item_bom alive-light">
                {{ txsRes.benefit_info.balance }} <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_top alive-light">昨日收益</div>
              <div class="partner_one_box_item_bom alive-light">
                {{ txsRes.benefit_info.last_day_benefit }} <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_top alive-light">累计总收益</div>
              <div class="partner_one_box_item_bom alive-light">
                {{ txsRes.benefit_info.accumulated_benefit }} <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_btn">
                <span @click="deposit">充值</span>
                <div class="modal" v-if="isModal1Visible">
                  <div class="modal-content">
                    <span class="close" @click="closeModal1">&times;</span>
                    <h2>弹窗标题</h2>
                    <p>这是弹窗的内容。</p>
                  </div>
                </div>
                <span @click="withdraw">提现</span>
                <div class="modal" v-if="isModal2Visible">
                  <div class="modal-content">
                    <span class="close" @click="closeModal2">&times;</span>
                    <h2>弹窗标题</h2>
                    <p>这是弹窗的内容。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <!-- 我的NGT--end -->
        <!-- 质押订单--start -->
        <div class="alive-light" style="font-size: 20px; margin-top: 20px">
          转账记录
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
              <span class="alive-light">{{ item }}</span>
            </div>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 0">
            <Card v-for="(item, index) in txsRes.transactions" :key="index">
              <div class="box_body_item_top">
                <span v-if="item.transaction_type == 1">充值</span>
                <span v-if="item.transaction_type == 2">提现</span>
                <span>{{ item.num }}NGT</span>
                <span >{{  item.chain }}</span>
                <span v-if="item.status == 1" class="alive-light">确认中</span>
                <span v-if="item.status == 2" class="alive-light">已完成</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>充值地址</span>
                  <span>{{  item.address }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>交易哈希</span>
                  <span>{{  item.hash }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>申请时间</span>
                  <span>18/05/2023 12:00:00</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>到账时间</span>
                  <span>23/05/2023 12:00:00</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>手续费</span>
                  <span>641 NGT</span>
                </div>
              </div>
            </Card>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 1">
            <Card v-for="(item, index) in depositList.transactions" :key="index">
              <div class="box_body_item_top">
                <span>充值</span>
                <span>{{ item.num }}NGT</span>
                <span >{{  item.chain }}</span>
                <span v-if="item.status == 1" class="alive-light">确认中</span>
                <span v-if="item.status == 2" class="alive-light">已完成</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>充值地址</span>
                  <span>{{  item.address }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>交易哈希</span>
                  <span>{{  item.hash }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>申请时间</span>
                  <span>18/05/2023 12:00:00</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>到账时间</span>
                  <span>23/05/2023 12:00:00</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>手续费</span>
                  <span>641 NGT</span>
                </div>
              </div>
            </Card>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 2">
            <Card v-for="(item, index) in withdrawList.transactions" :key="index">
              <div class="box_body_item_top">
                <span>提现</span>
                <span>{{ item.num }}NGT</span>
                <span >{{  item.chain }}</span>
                <span v-if="item.status == 1" class="alive-light">确认中</span>
                <span v-if="item.status == 2" class="alive-light">已完成</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>充值地址</span>
                  <span>{{  item.address }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>交易哈希</span>
                  <span>{{  item.hash }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>申请时间</span>
                  <span>18/05/2023 12:00:00</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>到账时间</span>
                  <span>23/05/2023 12:00:00</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>手续费</span>
                  <span>641 NGT</span>
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
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
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

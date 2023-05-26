<script setup lang="ts">
import Card from '@/components/card/index.vue'
import {onMounted, ref} from 'vue'
import {myNgt, myTransactionsRep} from "@/api/flow";
import Clipboard from "vue-clipboard3";
import {ElMessage} from "element-plus";
import MainStore from "@/store";
const { toClipboard } = Clipboard()
const State = MainStore() //获取store
const navValue = ref(0)
const navList = ['全部', '充值', '提现']
const txsRes = ref({
  benefit_info: {
    balance: 0,
    last_day_benefit: 0,
    accumulated_benefit: 0,
  },
  transactions: [],
} as myTransactionsRep);
let chainValue =  ref("选择公链")
const num = ref(0)
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
const copy = async (hash) => {
  try {
    const res = await toClipboard(hash)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const deposit = async () => {
  try {
    console.log(num.value)
    console.log(State.account.toString())
    console.log(chainValue.value.toString())
    ElMessage.success('充值成功')
  } catch (error) {
    ElMessage.error('充值失败')
  }
}
const withdraw = async () => {
  try {
    console.log(num.value)
    console.log(State.account.toString())
    console.log(chainValue.value.toString())
    ElMessage.success('提现成功')
  } catch (error) {
    ElMessage.error('提现失败')
  }
}
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
                <span @click="navValue = 3">充值</span>
                <span @click="navValue = 4">提现</span>
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
                  <span>{{ item.hash.slice(0, 32)  }}********
                  <el-button class="copyBtn" @click="copy(item.hash)" round><img
                      src="../../../assets/images/VectorMini.png"
                      alt=""
                  /></el-button>
                  </span>
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
                  <span>{{ item.hash.slice(0, 32)  }}********
                  <el-button class="copyBtn" @click="copy(item.hash)" round><img
                      src="../../../assets/images/VectorMini.png"
                      alt=""
                  /></el-button>
                  </span>
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
                  <span>{{ item.hash.slice(0, 32)  }}********
                  <el-button class="copyBtn" @click="copy(item.hash)" round><img
                      src="../../../assets/images/VectorMini.png"
                      alt=""
                  /></el-button>
                  </span>
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
          <div class="partner_cross_box_body" v-if="navValue == 3">
            <Card >
              <div class="partner_cross_middle">
                  <div class="partner_cross_input">
                    <input class = "partner_cross_input_text" type="text" v-model="num" placeholder="   请输入数量" />
                  </div>
                <el-dropdown
                    trigger="click"
                >
                  <div  class="partner_cross_select">
                    <div
                        class="partner_cross_select_text"
                    >
                      {{chainValue}}
                    </div>
                  </div>
                    <div class="partner_cross_select_tri"></div>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="chainValue = 'Polygon'" >Polygon</el-dropdown-item>
                        <el-dropdown-item @click="chainValue = 'ETH'"> ETH </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                  <div class="partner_cross_button">
                    <div class="partner_cross_button_text" @click="deposit()">立即充值</div>
                  </div>
              </div>
            </Card>
          </div>
          <div class="partner_cross_box_body" v-if="navValue == 4">
            <Card >
              <div class="partner_cross_middle">
                <div class="partner_cross_input">
                  <input class = "partner_cross_input_text" type="text" v-model="num" placeholder="   请输入数量" />
                </div>
                <el-dropdown

                    trigger="click"
                >
                  <div  class="partner_cross_select">
                  <div
                      class="partner_cross_select_text"
                  >
                    {{chainValue}}
                  </div>
                  </div>
                  <div class="partner_cross_select_tri"></div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="chainValue = 'Polygon'">Polygon</el-dropdown-item>
                      <el-dropdown-item @click="chainValue = 'ETH'">ETH</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <div class="partner_cross_button">
                  <div class="partner_cross_button_text" @click="withdraw">立即提现</div>
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
  border-image-source: linear-gradient(98.93deg, #AAFAC0 0%, rgba(198, 75, 255, 0) 100%);
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
              .copyBtn{
                width: 40px;
                height: 40px;
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
          box-sizing: border-box;

          position: absolute;
          width: 1180px;
          height: 210px;
          top: 60px;

          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(50px);
          /* Note: backdrop-filter has minimal browser support */

          border-radius: 24px;
          .partner_cross_middle {
            height: 60px;
            display: flex;
            gap: 15px;
            align-items: center;
            .partner_cross_input {
              width: 629px;
              height: 67px;

              /* border line */

              background: linear-gradient(98.28deg, rgba(102, 163, 155, 0.3) 10.61%, rgba(97, 112, 252, 0.297) 54.84%, rgba(158, 99, 205, 0.298469) 100%);
              background-blend-mode: overlay;
              /* InnerShadow-Box */
              box-shadow: 2px 2px 3px 0px rgba(101, 0, 118, 0.25) inset;


              border-radius: 12px;


              order: 0;
              flex-grow: 0;
              .partner_cross_input_text {
                position: fixed;
                width: 569px;
                left: 30px;
                height: 67px;
                border-radius: 12px;
                background: none;
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 20px;
                line-height: 16px;
                /* identical to box height, or 80% */

                display: flex;
                align-items: center;

                /* Font-Light-Inactive */

                color: rgba(255, 255, 255, 0.8);

                opacity: 0.8;
              }
            }
            .partner_cross_select{
              /* Kinsta */


              box-sizing: border-box;

              width: 167px;
              height: 63px;

              background: rgba(255, 255, 255, 0.2);
              backdrop-filter: blur(50px);
              /* Note: backdrop-filter has minimal browser support */

              border-radius: 12px;

              /* Inside auto layout */

              flex: none;
              order: 1;
              flex-grow: 0;
              .partner_cross_select_text{
                position: absolute;
                width: 80px;
                height: 12px;
                left: 31px;
                top: 26px;

                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 20px;
                line-height: 16px;
                /* identical to box height, or 80% */

                display: flex;
                align-items: center;

                color: #FFFFFF;
              }
              .partner_cross_select_tri{
                /* Rectangle 18251 */

                position: absolute;
                width: 22.08px;
                height: 22.08px;
                left: 135px;
                top: 25.62px;

                /* Font-Fill-Bright */
                background: linear-gradient(98.28deg, #ADFFF5 10.61%, rgba(155, 165, 255, 0.99) 54.84%, rgba(216, 166, 255, 0.994896) 100%);
                border-radius: 2px;
                transform: rotate(-45deg);

              }

            }
            .partner_cross_button{
              /* Kinsta */

              box-sizing: border-box;

              position: fixed;

              /* button-fill */
              background: linear-gradient(98.28deg, #66A39B 10.61%, rgba(97, 112, 252, 0.99) 54.84%, rgba(158, 99, 205, 0.994896) 100%);
              border-radius: 12px;


              /* 开始质押 */

              position: absolute;
              width: 167px;
              height: 63px;
              left:840px;
              top: 6px;
              border-radius: 12px;

              /* Inside auto layout */

              flex: none;
              order: 1;
              flex-grow: 0;
              .partner_cross_button_text{
                position: absolute;
                width: 80px;
                height: 12px;
                left: 31px;
                top: 26px;

                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 20px;
                line-height: 16px;
                /* identical to box height, or 80% */

                display: flex;
                align-items: center;

                color: #FFFFFF;
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

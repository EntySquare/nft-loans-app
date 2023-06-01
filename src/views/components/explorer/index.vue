<script setup lang="ts">
import {getToken} from "@/utils/auth";
import {
  benefitFlowInfo, covenantFlowDetail,
  covenantInfo,
  myBenefitFlowRep,
  myCovenantFlow,
  myCovenantFlowRep
} from "@/api/benefit";
import Card from '@/components/card/index.vue'
import {onMounted, ref} from "vue";
import { formatDateY } from '@/utils/time'
import {ElMessage} from "element-plus";
import Clipboard from "vue-clipboard3";
const { toClipboard } = Clipboard()
const navValue = ref(0)
const navList = ['全部', '质押中', '已完成']

const cfRes = ref({
  benefit_info: {
    balance: 0,
    last_day_benefit: 0,
    accumulated_benefit: 0,
  },
  covenant_flows: []as covenantInfo[],
} as myCovenantFlowRep);
const cdRes = ref({
  covenant_info: {
    nft_name: "",
    pledge_id: "",
    chain_name: "",
    duration: "",
    hash: "",
    interest_rate: 0,
    accumulated_benefit: 0,
    pledge_fee: 0,
    release_fee: 0,
    start_time: 0,
    expire_time: 0,
    nft_release_time: 0,
    flag: "",
  },
  benefit_flows: []as benefitFlowInfo[],
} as myBenefitFlowRep);
let coinList = ref({covenant_flows: []as covenantInfo[]} )
let cooutList = ref({covenant_flows: []as covenantInfo[]} )
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
    const res = await myCovenantFlow();
    console.log(res.data)
    cfRes.value.benefit_info = res.data.json.benefit_info;
    cfRes.value.covenant_flows = res.data.json.covenant_flows;
    for (let i = 0; i < res.data.json.covenant_flows.length; i++) {
      if (res.data.json.covenant_flows[i].flag == "1"){
        coinList.value.covenant_flows.push(res.data.json.covenant_flows[i])
      }
      if (res.data.json.covenant_flows[i].flag == "2"){
        cooutList.value.covenant_flows.push(res.data.json.covenant_flows[i])
      }
    }

  } catch (err) {
    console.log("queryMyCovenantFlow err-------------------");
    console.log(err);
  }
}
const covenantDetail = async (item:covenantInfo) => {
  try {
    navValue.value = 3
    console.log(item.hash)
    const res = await covenantFlowDetail(item.hash)
    cdRes.value.covenant_info = item
    cdRes.value.benefit_flows = res.data.json.benefit_flows
  } catch (error) {
    console.log("queryCovenantFlowDetail err-------------------");
    console.log(error);
  }
}
const copy = async (hash:string) => {
  try {
    const res = await toClipboard(hash)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
onMounted(() => {
  dataInit();
});
</script>
<script lang="ts">
export default {
  name: 'Explorer'
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
              <div class="partner_one_box_item_top alive-light">{{ $t('explorer.balance') }}</div>
              <div class="partner_one_box_item_bom alive-light">
                {{ cfRes.benefit_info.balance }} <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_top alive-light">{{ $t('explorer.yesterdayIncome') }}</div>
              <div class="partner_one_box_item_bom alive-light">
                {{ cfRes.benefit_info.last_day_benefit }} <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_top alive-light">{{ $t('explorer.accumulateIncome') }}</div>
              <div class="partner_one_box_item_bom alive-light">
                {{ cfRes.benefit_info.accumulated_benefit }} <span>NGT</span>
              </div>
            </div>
          </div>
        </Card>
        <!-- 我的NGT--end -->
        <!-- 质押订单--start -->
        <div class="partner_two_box">
          <div class="partner_two_box_nav">
            <div class="alive-light">{{ $t('explorer.pledgeOrder') }}</div>
            <div
              :class="[
                'partner_two_box_nav_btn',
                navValue == index ? 'active' : ''
              ]"
              v-for="(item, index) in navList"
              :key="index"
              @click="navValue = index"
            >
              <span class="alive-light" v-if="index == 0">{{ $t('explorer.navList1') }}</span>
              <span class="alive-light" v-if="index == 1">{{ $t('explorer.navList2') }}</span>
              <span class="alive-light" v-if="index == 2">{{ $t('explorer.navList3') }}</span>
            </div>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 0">
            <Card v-for="(item, index) in cfRes.covenant_flows" :key="index" @click="covenantDetail(item)">
              <div class="box_body_item_top">
                <span>{{  item.chain_name }}</span>
                <span>{{ item.duration }}{{ $t('explorer.day') }}</span>
                <span>{{ $t('explorer.dailyIncome') }}{{ item.interest_rate }}%</span>
                <span class="alive-light">{{ $t('explorer.navList1') }}</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.nftName') }}</span>
                  <span>{{ item.nft_name }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.nftID') }}</span>
                  <span>{{ item.pledge_id }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.hash') }}</span>
                  <span>{{ item.hash.slice(0, 32)  }}********
                  <el-button class="copyBtn" @click="copy(item.hash)" round><img
                      src="../../../assets/images/VectorMini.png"
                      alt=""
                  /></el-button>
                  </span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.expirationTime') }}</span>
                  <span>{{ formatDateY(item.expire_time)  }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.pledgeTime') }}</span>
                  <span>{{ formatDateY(item.start_time)  }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.pledgeFee') }}</span>
                  <span>{{ item.pledge_fee }} NGT</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.releaseFee') }}</span>
                  <span>{{ item.release_fee }} NGT</span>
                </div>
              </div>
              <div class="box_body_item_bom_two">
                <span class="alive-light">{{ $t('explorer.cancelOrder') }}</span>
                <div>
                  <span class="alive-light">{{ $t('explorer.orderIncome') }}</span>
                  <span class="alive-light">{{ item.accumulated_benefit }} NGT</span>
                </div>
              </div>
            </Card>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 1">
            <Card v-for="(item, index) in coinList.covenant_flows" :key="index" @click="covenantDetail(item)">
              <div class="box_body_item_top">
                <span>{{ item.chain_name }}</span>
                <span>{{ item.duration }}{{ $t('explorer.day') }}</span>
                <span>{{ $t('explorer.dailyIncome') }}{{ item.interest_rate }}%</span>
                <span class="alive-light">{{ $t('explorer.navList2') }}</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.nftName') }}</span>
                  <span>{{ item.nft_name }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.nftID') }}</span>
                  <span>{{ item.pledge_id }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.hash') }}</span>
                  <span>{{ item.hash.slice(0, 32)  }}********
                  <el-button class="copyBtn" @click="copy(item.hash)" round><img
                      src="../../../assets/images/VectorMini.png"
                      alt=""
                  /></el-button>
                  </span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.expirationTime') }}</span>
                  <span>{{ formatDateY(item.expire_time)  }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.pledgeTime') }}</span>
                  <span>{{ formatDateY(item.start_time)  }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.pledgeFee') }}</span>
                  <span>{{ item.pledge_fee }} NGT</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.releaseFee') }}</span>
                  <span>{{ item.release_fee }} NGT</span>
                </div>
              </div>
              <div class="box_body_item_bom_two">
                <span class="alive-light">{{ $t('explorer.cancelOrder') }}</span>
                <div>
                  <span class="alive-light">{{ $t('explorer.orderIncome') }}</span>
                  <span class="alive-light">{{ item.accumulated_benefit }} NGT</span>
                </div>
              </div>
            </Card>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 2">
            <Card v-for="(item, index) in cooutList.covenant_flows" :key="index" @click="covenantDetail(item)">
              <div class="box_body_item_top" >
                <span>{{ item.chain_name }}</span>
                <span>{{ item.duration }}{{ $t('explorer.day') }}</span>
                <span>{{ $t('explorer.dailyIncome') }}{{ item.interest_rate }}%</span>
                <span class="alive-light">{{ $t('explorer.navList3') }}</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.nftName') }}</span>
                  <span>{{ item.nft_name }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.nftID') }}</span>
                  <span>{{ item.pledge_id }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.hash') }}</span>
                  <span>{{ item.hash.slice(0, 32)  }}********
                  <el-button class="copyBtn" @click="copy(item.hash)" round><img
                      src="../../../assets/images/VectorMini.png"
                      alt=""
                  /></el-button>
                  </span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.expirationTime') }}</span>
                  <span>{{ formatDateY(item.expire_time)  }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.pledgeTime') }}</span>
                  <span>{{ formatDateY(item.start_time)  }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.pledgeFee') }}</span>
                  <span>{{ item.pledge_fee }} NGT</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>{{ $t('explorer.releaseFee') }}</span>
                  <span>{{ item.release_fee }} NGT</span>
                </div>
              </div>
              <div class="box_body_item_bom_two">
                <span class="alive-light">{{ $t('explorer.cancelOrder') }}</span>
                <div>
                  <span class="alive-light">{{ $t('explorer.orderIncome') }}</span>
                  <span class="alive-light">{{ item.accumulated_benefit }} NGT</span>
                </div>
              </div>
            </Card>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 3">
            <div class="covenant_detail">
            <i style="float: left; margin-left: 10px; line-height: 50px" @click="navValue = 0">
              <img src="../../../assets/images/Vector2Mini.png" alt=""
              />
            </i>
              <div class="covenant_detail_top">
                <covenant_detail_span1 class="detail_alive-light1">{{  cdRes.covenant_info.chain_name }}</covenant_detail_span1>
                <covenant_detail_span1 class="detail_alive-light1">{{ cdRes.covenant_info.duration }}{{ $t('explorer.day') }}</covenant_detail_span1>
                <covenant_detail_span1 class="detail_alive-light1">{{ $t('explorer.dailyIncome') }}{{ cdRes.covenant_info.interest_rate }}%</covenant_detail_span1>

                <covenant_detail_span2 class="detail_alive-light2" v-if="cdRes.covenant_info.flag=='1'">{{ $t('explorer.navList2') }}</covenant_detail_span2>
                <covenant_detail_span2 class="detail_alive-light2" v-if="cdRes.covenant_info.flag=='2'">{{ $t('explorer.navList3') }}</covenant_detail_span2>
                <covenant_detail_span2 class="detail_alive-light2">{{ cdRes.covenant_info.accumulated_benefit }} NGT</covenant_detail_span2>
                <covenant_detail_span2 class="detail_alive-light2">{{ $t('explorer.orderIncome') }}</covenant_detail_span2>
                <div class="covenant_detail_bom">
                  <div class="covenant_detail_bom_item">
                    <covenant_detail_bom_span><detail_title1>{{ $t('explorer.nftName') }}:</detail_title1><detail_inner1>{{ cdRes.covenant_info.nft_name }}</detail_inner1></covenant_detail_bom_span>
                    <covenant_detail_bom_span> <detail_title2>{{ $t('explorer.nftID') }}:</detail_title2><detail_inner2>{{ cdRes.covenant_info.pledge_id }}</detail_inner2></covenant_detail_bom_span>
                    <covenant_detail_bom_span><detail_title3>{{ $t('explorer.hash') }}:</detail_title3><detail_inner3>{{ cdRes.covenant_info.hash.slice(0, 32)  }}********<el-button class="copyBtn" @click="copy(cdRes.covenant_info.hash)" round><img
                        src="../../../assets/images/VectorMini.png"
                        alt=""
                    /></el-button></detail_inner3>
                  </covenant_detail_bom_span>
                  </div>
                  <div class="covenant_detail_bom_item">
                    <covenant_detail_bom_span ><detail_title4>{{ $t('explorer.expirationTime') }}:</detail_title4><detail_inner4>{{ formatDateY(cdRes.covenant_info.expire_time)  }}</detail_inner4></covenant_detail_bom_span>
                    <covenant_detail_bom_span ><detail_title5>{{ $t('explorer.pledgeTime') }}:</detail_title5><detail_inner5>{{ formatDateY(cdRes.covenant_info.start_time)  }}</detail_inner5></covenant_detail_bom_span>
                    <covenant_detail_bom_span ><detail_title6>{{ $t('explorer.pledgeFee') }}:</detail_title6><detail_inner6>{{ cdRes.covenant_info.pledge_fee }} NGT</detail_inner6></covenant_detail_bom_span>
                    <covenant_detail_bom_span ><detail_title7>{{ $t('explorer.releaseFee') }}:</detail_title7><detail_inner7>{{ cdRes.covenant_info.release_fee }} NGT</detail_inner7></covenant_detail_bom_span>
                  </div>
                </div>
                <div class="detail_list">
                  <div class="alive-light">{{ $t('explorer.incomeList') }}</div>
                </div>
                <div class="list" >
                  <table class="table">
                    <tbody>
                    <tr v-for="(item, index) in cdRes.benefit_flows" :key="index">
                      <td>{{ formatDateY(item.time)  }}</td>
                      <td style="text-align: center">{{ item.num }}NGT</td>
                      <td style="text-align: right" v-if="item.flag=='1'">已发放</td>
                      <td style="text-align: right" v-if="item.flag=='0'">未发放</td>

                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 质押订单--end -->
      </div>
    </div>
    <!-- 居中 -->
  </div>
</template>

<style scoped lang="less">
.partner {
  // background-color: @xtxColor;
  width: 100%;
  height: 100%;
  padding-top: 70px;

  .container {
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
          gap: 20px;
          .partner_one_box_item_top {
            font-size: 20px;
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
        padding: 30px;
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
          .covenant_detail {
            box-sizing: border-box;

            position: absolute;
            width: 100%;
            height: 670px;
            left: 0%;
            top: 85%;

            /* Order-Fill */

            background: rgba(255, 255, 255, 0.2);
            background-blend-mode: overlay;
            backdrop-filter: blur(50px);
            /* Note: backdrop-filter has minimal browser support */

            border-radius: 24px;
            .covenant_detail_top {
              justify-content: space-between;
              covenant_detail_span1 {
                font-size: 22px;
              }
              covenant_detail_span2 {
                font-size: 22px;
              }
              .detail_alive-light1{
                float: left;
                width: 115px;
                height: 150px;
                margin-left: 0px;
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 20px;
                line-height: 130px;
                /* identical to box height */


                /* Font-Fill-Bright */

                background: linear-gradient(98.28deg, #ADFFF5 10.61%, rgba(155, 165, 255, 0.99) 54.84%, rgba(216, 166, 255, 0.994896) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-fill-color: transparent;
                /* Inside auto layout */
                flex: none;
                order: 1;
                flex-grow: 0;
              }
              .detail_alive-light2{
                float: right;
                width: 100px;
                height: 150px;
                margin-right: 1px;
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 20px;
                line-height: 130px;
                /* identical to box height */


                /* Font-Fill-Bright */

                background: linear-gradient(98.28deg, #ADFFF5 10.61%, rgba(155, 165, 255, 0.99) 54.84%, rgba(216, 166, 255, 0.994896) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-fill-color: transparent;
                /* Inside auto layout */
                flex: none;
                order: 1;
                flex-grow: 0;
              }
            }
            .covenant_detail_bom {
              position: absolute;
              width: 100%;
              height: 70px;
              top: 110px;
                .covenant_detail_bom_item {
                  left: 10px;
                  covenant_detail_bom_span {
                    margin-left: 40px;
                    detail_title1 {
                      position: absolute;
                      width: 100px;
                      height: 28px;
                      display: flex;
                      left: 20px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 400;
                      font-size: 20px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }
                    detail_title2 {
                      position: absolute;
                      width: 120px;
                      height: 28px;
                      display: flex;
                      left:260px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 400;
                      font-size: 22px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }
                    detail_title3 {
                      position: absolute;
                      width: 120px;
                      height: 28px;
                      display: flex;
                      left: 470px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 400;
                      font-size: 22px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }
                    detail_title4 {
                      position: absolute;
                      width: 100px;
                      height: 28px;
                      display: flex;
                      left: 20px;
                      top:45px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 400;
                      font-size: 20px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }
                    detail_title5 {
                      position: absolute;
                      width: 100px;
                      height: 28px;
                      display: flex;
                      left: 280px;
                      top:45px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 400;
                      font-size: 20px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }
                    detail_title6 {
                      position: absolute;
                      width: 100px;
                      height: 28px;
                      display: flex;
                      left: 560px;
                      top:45px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 400;
                      font-size: 20px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }
                    detail_title7 {
                      position: absolute;
                      width: 100px;
                      height: 28px;
                      display: flex;
                      left: 780px;
                      top:45px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 400;
                      font-size: 20px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }
                    detail_inner1 {
                      position: absolute;
                      width: 100px;
                      height: 28px;
                      left: 120px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 200;
                      font-size: 16px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }

                    detail_inner2 {
                      position: absolute;
                      width: 200px;
                      height: 28px;
                      left: 340px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 200;
                      font-size: 16px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }

                    detail_inner3 {
                      position: absolute;
                      width: 2000px;
                      height: 28px;
                      left: 590px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 200;
                      font-size: 16px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }
                    detail_inner4 {
                      position: absolute;
                      width: 1020px;
                      height: 28px;
                      left: 110px;
                      top:45px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 200;
                      font-size: 16px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }
                    detail_inner5 {
                      position: absolute;
                      width: 1020px;
                      height: 28px;
                      left: 370px;
                      top:45px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 200;
                      font-size: 16px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }
                    detail_inner6 {
                      position: absolute;
                      width: 600px;
                      height: 28px;
                      left: 650px;
                      top:45px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 200;
                      font-size: 16px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }
                    detail_inner7 {
                      position: absolute;
                      width: 600px;
                      height: 28px;
                      left: 870px;
                      top:45px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 200;
                      font-size: 16px;
                      line-height: 28px;
                      /* identical to box height */
                      color: #FFFFFF;
                    }

              }

                .copyBtn{
                  width: 40px;
                  height: 40px;
                }
              }
            }
            .detail_info {
              box-sizing: border-box;
              position: absolute;
              width: 1176px;
              height: 50px;
              left: calc(50% - 1176px / 2 - 0.5px);
              top: calc(50% - 40px / 2 - 148.5px);

              background: rgba(255, 255, 255, 0.2);
              backdrop-filter: blur(50px);
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
    .detail_list{
      position: absolute;
      width: 240px;
      height: 28px;
      left: 15px;
      top: 220px;

      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 300;
      font-size: 14px;
      line-height: 28px;
      /* identical to box height */


      /* Font-Fill-Bright */

      background: linear-gradient(98.28deg, #ADFFF5 10.61%, rgba(155, 165, 255, 0.99) 54.84%, rgba(216, 166, 255, 0.994896) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-fill-color: transparent;

    }
    .list {
      width: 100%;
      height: 650px;

      .table {
        width: 60%;
        margin-left: 20%;
        font-size: 16px;

        tbody {
          display: block;
          overflow-x: hidden;
          overflow-y: auto;
          height: 500px;
        }

        tbody tr {
          display: table;
          width: 98%;
          margin-top: 82px;
          border: #66a39b solid 1px;
          table-layout: fixed;
          word-break: break-all;
          height: 40px;
          border-radius: 20px;
          background-blend-mode: overlay;
          background: linear-gradient(
              98.93deg,
              #aafac0 0%,
              rgba(198, 75, 255, 0) 100%
          );
          background-blend-mode: overlay;
          background: linear-gradient(
              261.07deg,
              #ffffff 0%,
              rgba(0, 0, 0, 0) 100%
          );
          background: rgba(255, 255, 255, 0.2);
        }
        tbody td {
          position: relative;
          left: 0px;

          color: #ffffff;
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 40px;
        }
      }
      /* 滚动条样式 */
      table tbody::-webkit-scrollbar {
        width: 10px;
      }
      table tbody::-webkit-scrollbar-thumb {
        background-color: #01f5f1;
        border-radius: 5px;
      }
      table tbody::-webkit-scrollbar-track {
        background: linear-gradient(
            98.28deg,
            #66a39b 10.61%,
            rgba(97, 112, 252, 0.99) 54.84%,
            rgba(158, 99, 205, 0.994896) 100%
        );
      }
      table tbody::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(
            98.28deg,
            #66a39b 10.61%,
            rgba(97, 112, 252, 0.99) 54.84%,
            rgba(158, 99, 205, 0.994896) 100%
        );
      }
      table tbody::-webkit-scrollbar-thumb:active {
        background: linear-gradient(
            98.28deg,
            #66a39b 10.61%,
            rgba(97, 112, 252, 0.99) 54.84%,
            rgba(158, 99, 205, 0.994896) 100%
        );
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

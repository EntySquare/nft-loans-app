<script setup lang="ts">
import {getToken} from "@/utils/auth";
import {covenantInfo, myCovenantFlow, myCovenantFlowRep} from "@/api/benefit";
import Card from '@/components/card/index.vue'
import {onMounted, ref} from "vue";
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
  covenant_flows: [],
} as myCovenantFlowRep);
let coinList = ref({covenant_flows: []} )
let cooutList = ref({covenant_flows: []} )
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
const copy = async (hash) => {
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
                {{ cfRes.benefit_info.balance }} <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_top alive-light">昨日收益</div>
              <div class="partner_one_box_item_bom alive-light">
                {{ cfRes.benefit_info.last_day_benefit }} <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_top alive-light">累计总收益</div>
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
            <div class="alive-light">质押订单</div>
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
            <Card v-for="(item, index) in cfRes.covenant_flows" :key="index">
              <div class="box_body_item_top">
                <span>{{  item.chain_name }}</span>
                <span>{{ item.duration }}</span>
                <span>日利率{{ item.interest_rate }}%</span>
                <span class="alive-light">全部</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>NFT名称</span>
                  <span>{{ item.nft_name }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>质押ID</span>
                  <span>{{ item.pledge_id }}</span>
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
                  <span>到期时间</span>
                  <span>18/05/2023 12:00:00</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>质押时间</span>
                  <span>23/05/2023 12:00:00</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>质押费用</span>
                  <span>{{ item.pledge_fee }} NGT</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>释放费用</span>
                  <span>{{ item.release_fee }} NGT</span>
                </div>
              </div>
              <div class="box_body_item_bom_two">
                <span class="alive-light">取消订单</span>
                <div>
                  <span class="alive-light">订单收益</span>
                  <span class="alive-light">{{ item.accumulated_benefit }} NGT</span>
                </div>
              </div>
            </Card>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 1">
            <Card v-for="(item, index) in coinList.covenant_flows" :key="index">
              <div class="box_body_item_top">
                <span>{{ item.chain_name }}</span>
                <span>{{ item.duration }}</span>
                <span>日利率{{ item.interest_rate }}%</span>
                <span class="alive-light">全部</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>NFT名称</span>
                  <span>{{ item.nft_name }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>质押ID</span>
                  <span>{{ item.pledge_id }}</span>
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
                  <span>到期时间</span>
                  <span>18/05/2023 12:00:00</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>质押时间</span>
                  <span>23/05/2023 12:00:00</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>质押费用</span>
                  <span>{{ item.pledge_fee }} NGT</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>释放费用</span>
                  <span>{{ item.release_fee }} NGT</span>
                </div>
              </div>
              <div class="box_body_item_bom_two">
                <span class="alive-light">取消订单</span>
                <div>
                  <span class="alive-light">订单收益</span>
                  <span class="alive-light">{{ item.accumulated_benefit }} NGT</span>
                </div>
              </div>
            </Card>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 2">
            <Card v-for="(item, index) in cooutList.covenant_flows" :key="index" >
              <div class="box_body_item_top" >
                <span>{{ item.chain_name }}</span>
                <span>{{ item.duration }}</span>
                <span>日利率{{ item.interest_rate }}%</span>
                <span class="alive-light">全部</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>NFT名称</span>
                  <span>{{ item.nft_name }}</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>质押ID</span>
                  <span>{{ item.pledge_id }}</span>
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
                  <span>到期时间</span>
                  <span>18/05/2023 12:00:00</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>质押时间</span>
                  <span>23/05/2023 12:00:00</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>质押费用</span>
                  <span>{{ item.pledge_fee }} NGT</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>释放费用</span>
                  <span>{{ item.release_fee }} NGT</span>
                </div>
              </div>
              <div class="box_body_item_bom_two">
                <span class="alive-light">取消订单</span>
                <div>
                  <span class="alive-light">订单收益</span>
                  <span class="alive-light">{{ item.accumulated_benefit }} NGT</span>
                </div>
              </div>
            </Card>
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

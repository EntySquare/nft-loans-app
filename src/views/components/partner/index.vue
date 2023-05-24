<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { ref } from 'vue'

const navValue = ref(0)
const navList = ['全部', '充值', '提现']
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
                213482742 <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_top alive-light">昨日收益</div>
              <div class="partner_one_box_item_bom alive-light">
                324 <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_top alive-light">累计总收益</div>
              <div class="partner_one_box_item_bom alive-light">
                231324 <span>NGT</span>
              </div>
            </div>
            <div class="partner_one_box_item">
              <div class="partner_one_box_item_btn">
                <span>充值</span>
                <span>提现</span>
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
            <Card v-for="(item, index) in 4" :key="index">
              <div class="box_body_item_top">
                <span>Polygon</span>
                <span>7天</span>
                <span>日利率0.7%</span>
                <span class="alive-light">全部</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>NFT名称</span>
                  <span>Vermillion Bird</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>质押ID</span>
                  <span>asd**35asda</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>交易哈希</span>
                  <span>01dfae6e5d4d90d9892622325959afbe:7050461</span>
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
                  <span>122 NGT</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>释放费用</span>
                  <span>641 NGT</span>
                </div>
              </div>
              <div class="box_body_item_bom_two">
                <span class="alive-light">取消订单</span>
                <div>
                  <span class="alive-light">订单收益</span>
                  <span class="alive-light">2734 NGT</span>
                </div>
              </div>
            </Card>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 1">
            <Card v-for="(item, index) in 3" :key="index">
              <div class="box_body_item_top">
                <span>Polygon</span>
                <span>7天</span>
                <span>日利率0.7%</span>
                <span class="alive-light">质押中</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>NFT名称</span>
                  <span>Vermillion Bird</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>质押ID</span>
                  <span>asd**35asda</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>交易哈希</span>
                  <span>01dfae6e5d4d90d9892622325959afbe:7050461</span>
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
                  <span>122 NGT</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>释放费用</span>
                  <span>641 NGT</span>
                </div>
              </div>
              <div class="box_body_item_bom_two">
                <span class="alive-light">取消订单</span>
                <div>
                  <span class="alive-light">订单收益</span>
                  <span class="alive-light">2734 NGT</span>
                </div>
              </div>
            </Card>
          </div>
          <div class="partner_two_box_body" v-if="navValue == 2">
            <Card v-for="(item, index) in 5" :key="index">
              <div class="box_body_item_top">
                <span>Polygon</span>
                <span>7天</span>
                <span>日利率0.7%</span>
                <span class="alive-light">已完成</span>
              </div>
              <div class="box_body_item_bom">
                <div class="box_body_item_bom__item">
                  <span>NFT名称</span>
                  <span>Vermillion Bird</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>质押ID</span>
                  <span>asd**35asda</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>交易哈希</span>
                  <span>01dfae6e5d4d90d9892622325959afbe:7050461</span>
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
                  <span>122 NGT</span>
                </div>
                <div class="box_body_item_bom__item">
                  <span>释放费用</span>
                  <span>641 NGT</span>
                </div>
              </div>
              <div class="box_body_item_bom_two">
                <span class="alive-light">取消订单</span>
                <div>
                  <span class="alive-light">订单收益</span>
                  <span class="alive-light">2734 NGT</span>
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

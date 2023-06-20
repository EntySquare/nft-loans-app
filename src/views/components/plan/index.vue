<script setup lang="ts">
import Card from '@/components/card/index.vue'
import MainStore from '@/store'
//import {login } from '@/api/user' //*获取计划列表
import { ref } from 'vue'
import { useI18n } from 'vue-i18n' //国际化
// import { fr } from 'element-plus/es/locale'
import { ElMessage } from 'element-plus'
import { pledgeNftReq, pledgeNft } from '@/api/pledge'
const { t, locale } = useI18n() //国际化
const State = MainStore() //获取store
let chainValue = ref('')
let durationValue = ref('')
const imgData = [
  'https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5711684853279_.pic.jpg',
  'https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5701684853267_.pic.jpg',
  'https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5691684853125_.pic.jpg'
]
const id = ref('')
const pledgeNftById = async (id: string) => {
  try {
    if (id == '') {
      ElMessage.error('请输入id')
      return
    }
    if (durationValue.value == '') {
      ElMessage.error('请选择时间')
      return
    }
    if (chainValue.value == '') {
      ElMessage.error('请选择公链')
      return
    }
    State.safeTransferFrom(State.currentAccount, '0x5FBD164B333A007013f0C2d933004FE8D222e58f', id, (hash) => {
      const pledgeReq = {
        nft_id: id,
        duration: durationValue.value,
        hash,
        chain: chainValue.value
      } as pledgeNftReq
      pledgeNft(pledgeReq)
    })
    // const res = await pledgeNft(pledgeReq)
    // if (res.data.code == 0) {
    //   ElMessage.success('质押成功')
    //   return
    // } else {
    //   ElMessage.error('质押失败')
    //   return
    // }
  } catch (error) {
    ElMessage.error('质押失败')
  }
}
// const loginRequest = async () => {
//   //*获取计划列表
//   const data = {address:State.account}
//   const res = await login(data) //*使用sync await 异步获取数据
//   console.log(res) //*打印数据
// }
</script>
<script lang="ts">
export default {
  name: 'Plan'
}
</script>
<template>
  <div class="plan">
    <!-- 居中 -->
    <div class="container">
      <Card bgc="#000" padding="0px">
        <div class="plan_one_body">
          <div class="plan_one_body_text_box">
            <div class="plan_one_body_text">
              <span class="alive-light" style="font-weight: 600; font-size: 32px">Mystical Creatures
              </span>
            </div>
            <div class="plan_one_body_text" style="margin-left: 80px">
              <div class="dodo"></div>
              <span class="alive-light" style="font-weight: 600; font-size: 20px">Black Tortoise
              </span>
            </div>
            <div class="plan_one_body_text" style="margin-left: 120px">
              <div class="dodo"></div>
              <span class="alive-light" style="font-weight: 600; font-size: 20px">Vermilion Bird
              </span>
            </div>
            <div class="plan_one_body_text" style="margin-left: 160px">
              <div class="dodo"></div>
              <span class="alive-light" style="font-weight: 600; font-size: 20px">White Tiger
              </span>
            </div>
          </div>
          <div class="imgbgc">
            <div v-for="(item, index) in imgData" :key="index">
              <img :src="item" alt="" :style="{ right: (2 - index) * -50 + 'px' }" />
            </div>
          </div>
        </div>
      </Card>
      <Card bradius="100px">
        <p class="hometoos" style="font-weight: 400; font-size: 20px; margin-left: 20px">
          {{ $t('plan.news') }}
        </p>
      </Card>
      <Card>
        <div class="plan_three_body">
          <div class="three_top">
            <img width="50" height="50" src="https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/423i4423746.png" alt="" />
            <span class="alive-light" style="font-weight: 600; font-size: 20px">{{ $t('plan.pledgeTitle') }}
            </span>
          </div>
          <div class="three_middle">
            <div style="
                                                            background: linear-gradient(
                                                              98.28deg,
                                                              #66a39b90 10.61%,
                                                              rgba(97, 112, 252, 0.3) 54.84%,
                                                              rgba(158, 99, 205, 0.3) 100%
                                                            );
                                                          " class="three_middle_input border_my">
              <input type="text" v-model="id" :placeholder="$t('plan.input')" />
            </div>
            <div style="
                                                            display: flex;
                                                            gap: 10px;
                                                            justify-content: space-between;
                                                            flex-wrap: wrap;
                                                          " class="plan_box_my">
              <el-dropdown class="three_middle_dropdown border_my" trigger="click">
                <div style="
                                                                height: 100%;
                                                                width: 100%;
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                              " v-if="chainValue != ''">
                  {{ chainValue }}
                </div>
                <div style="
                                                                height: 100%;
                                                                width: 100%;
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                              " v-if="chainValue == ''">
                  {{ $t('plan.chainSelect') }}
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="chainValue = 'Polygon'">Polygon</el-dropdown-item>
                    <el-dropdown-item @click="chainValue = 'ETH'">
                      ETH
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-dropdown class="three_middle_dropdown border_my" trigger="click">
                <div style="
                                                                height: 100%;
                                                                width: 100%;
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                              " v-if="durationValue == ''">
                  {{ $t('plan.pledgeDays') }}
                </div>
                <div style="
                                                                height: 100%;
                                                                width: 100%;
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                              " v-if="durationValue != ''">
                  {{ durationValue }} {{ $t('plan.day') }}
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="durationValue = '30'">30 {{ $t('plan.day') }}</el-dropdown-item>
                    <el-dropdown-item @click="durationValue = '60'">60 {{ $t('plan.day') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="durationValue = '90'">90 {{ $t('plan.day') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="durationValue = '120'">120 {{ $t('plan.day') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="durationValue = '180'">180 {{ $t('plan.day') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <div style="
                                                              background: linear-gradient(
                                                                98.28deg,
                                                                #66a39b 10.61%,
                                                                rgba(97, 112, 252, 0.99) 54.84%,
                                                                rgba(158, 99, 205, 0.994896) 100%
                                                              );
                                                            " class="three_middle_dropdown border_my">
                <div @click="pledgeNftById(id)">
                  {{ $t('plan.pledgeButton') }}
                </div>
              </div>
            </div>
          </div>
          <div class="three_bom">
            <div class="three_bom_left_text alive-light">
              {{ $t('plan.dayBenefit') }}：
            </div>
            <div class="three_bom_box">
              <div class="three_bom_box_itemt">
                <div class="three_bom_box_itemt_text alive-light">
                  {{ $t('plan.btTitle') }}
                </div>
                <img src="https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5721684853355_.pic.jpg" alt="" />
                <div class="three_bom_box_itemt_desc">
                  0.5% {{ $t('plan.per') }}
                </div>
              </div>
              <div class="three_bom_box_itemt">
                <div class="three_bom_box_itemt_text alive-light">
                  {{ $t('plan.wtTitle') }}
                </div>
                <img src="https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5741684853386_.pic.jpg" alt="" />
                <div class="three_bom_box_itemt_desc">
                  0.6% {{ $t('plan.per') }}
                </div>
              </div>
              <div class="three_bom_box_itemt">
                <div class="three_bom_box_itemt_text alive-light">
                  {{ $t('plan.vbTitle') }}
                </div>
                <img src="https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5731684853378_.pic.jpg" alt="" />
                <div class="three_bom_box_itemt_desc">
                  0.7% {{ $t('plan.per') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <!-- 居中 -->
  </div>
</template>
<style scoped lang="less">
.plan {
  padding-top: 90px;

  .container {
    position: relative;
    z-index: 1; //三级
    width: 100%;
    padding-bottom: 20px;
    color: aliceblue;
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: center;

    .plan_one_body {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      min-height: 280px !important;
      overflow: hidden;

      .plan_one_body_text_box {
        position: absolute;
        z-index: 2;
        padding-left: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 15px;

        .plan_one_body_text {
          display: flex;

          .dodo {
            width: 15px;
            height: 15px;
            margin-right: 5px;
            background: linear-gradient(98.28deg,
                #adfff5 10.61%,
                rgba(155, 165, 255, 0.99) 54.84%,
                rgba(216, 166, 255, 0.994896) 100%;
              );
            border-radius: 50%;
          }
        }
      }

      .imgbgc {
        position: relative;
        display: flex;
        width: 100%;
        justify-content: end;

        img {
          position: relative;
          // right: 0;
          // top: 0;
          width: 315px;
          height: 315px;
        }
      }
    }

    .plan_three_body {
      .three_top {
        margin-bottom: 25px;
      }

      .three_middle {
        min-height: 60px;
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        align-items: center;

        .three_middle_input {
          min-width: 400px;
          height: 60px;
          flex: 2;
          padding: 0 10px;
          box-sizing: border-box;

          input {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            background-color: transparent;
            color: aliceblue;
            font-weight: 400;
            font-size: 24px;
            // text-align: center;
          }
        }

        .three_middle_dropdown {
          min-width: 190px;
          max-width: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60px;
          text-align: center;
          font-weight: 400;
          font-size: 24px;
          flex: 1;
        }
      }

      .three_bom {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 40px;
        padding-bottom: 20px;

        .three_bom_left_text {
          font-weight: 400;
          font-size: 20px;
        }

        .three_bom_box {
          margin-top: 20px;
          display: flex;
          gap: 20px;

          .three_bom_box_itemt {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;

            .three_bom_box_itemt_text {
              margin-left: 0 !important;
              text-align: center;
              box-sizing: border-box;
              width: 100px;
              font-size: 20px;
            }

            .three_bom_box_itemt_desc {
              font-weight: 100;
            }

            img {
              height: 120px;
              border-radius: 30px;
            }
          }
        }
      }
    }
  }
}

.border_my {
  border: 1px solid greenyellow;
  border-radius: 12px;
}
</style>

<script setup lang="ts">
import Card from '@/components/card/index.vue'
import MainStore from '@/store'
//import {login } from '@/api/user' //*获取计划列表
import { ref } from 'vue'
import { fr } from 'element-plus/es/locale'
import {ElMessage} from "element-plus";
const State = MainStore() //获取store
let chainValue =  ref("选择公链")
let durationValue =  ref("质押天数")
const imgData = [
  'https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5711684853279_.pic.jpg',
  'https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5701684853267_.pic.jpg',
  'https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5691684853125_.pic.jpg'
]
const pledgeNft = async (id) => {
  try {
    console.log('质押nft id:'+id)
    ElMessage.success('质押成功')
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
              <span
                class="alive-light"
                style="font-weight: 600; font-size: 32px"
                >Mystical Creatures
              </span>
            </div>
            <div class="plan_one_body_text" style="margin-left: 80px">
              <div class="dodo"></div>
              <span
                class="alive-light"
                style="font-weight: 600; font-size: 20px"
                >Black Tortoise
              </span>
            </div>
            <div class="plan_one_body_text" style="margin-left: 120px">
              <div class="dodo"></div>
              <span
                class="alive-light"
                style="font-weight: 600; font-size: 20px"
                >Vermilion Bird
              </span>
            </div>
            <div class="plan_one_body_text" style="margin-left: 160px">
              <div class="dodo"></div>
              <span
                class="alive-light"
                style="font-weight: 600; font-size: 20px"
                >Whire Tiger
              </span>
            </div>
          </div>
          <div class="imgbgc">
            <div v-for="(item, index) in imgData" :key="index">
              <img :src="item" alt="" :style="{ right: index * 260 + 'px' }" />
            </div>
          </div>
        </div>
      </Card>
      <Card bradius="100px">
        <p style="font-weight: 400; font-size: 20px; margin-left: 20px">
          消息通知：元旦认购玄武有奖
        </p>
      </Card>
      <Card>
        <div class="plan_three_body">
          <div class="three_top">
            <img
              width="50"
              height="50"
              src="https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/423i4423746.png"
              alt=""
            />
            <span class="alive-light" style="font-weight: 600; font-size: 20px"
              >质押赚取NGT
            </span>
          </div>
          <div class="three_middle">
            <div class="three_middle_input border_my">
              <input type="text" placeholder="请输入ID" />
            </div>

            <el-dropdown
              class="three_middle_dropdown border_my"
              trigger="click"
            >
              <div
                style="
                  height: 100%;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                {{chainValue}}
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="chainValue = 'Polygon'">Polygon</el-dropdown-item>
                  <el-dropdown-item @click="chainValue = 'ETH'"> ETH </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <el-dropdown
              class="three_middle_dropdown border_my"
              trigger="click"
            >
              <div
                style="
                  height: 100%;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                {{durationValue}}
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="durationValue = '7天'">7天</el-dropdown-item>
                  <el-dropdown-item @click="durationValue = '30天'"> 30天 </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <div class="three_middle_dropdown border_my">
              <div style="height: 30px" @click="pledgeNft">开始质押</div>
            </div>
          </div>
          <div class="three_bom">
            <div class="three_bom_left_text alive-light">日收益率：</div>
            <div class="three_bom_box">
              <div class="three_bom_box_itemt">
                <div class="three_bom_box_itemt_text alive-light">玄武</div>
                <img
                  src="https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5721684853355_.pic.jpg"
                  alt=""
                />
                <div class="three_bom_box_itemt_desc">0.5% 每日</div>
              </div>
              <div class="three_bom_box_itemt">
                <div class="three_bom_box_itemt_text alive-light">白虎</div>
                <img
                  src="https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5731684853378_.pic.jpg"
                  alt=""
                />
                <div class="three_bom_box_itemt_desc">0.6% 每日</div>
              </div>
              <div class="three_bom_box_itemt">
                <div class="three_bom_box_itemt_text alive-light">朱雀</div>
                <img
                  src="https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5741684853386_.pic.jpg"
                  alt=""
                />
                <div class="three_bom_box_itemt_desc">0.7% 每日</div>
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
      height: 280px !important;
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
            background: linear-gradient(
              98.28deg,
              #adfff5 10.61%,
              rgba(155, 165, 255, 0.99) 54.84%,
              rgba(216, 166, 255, 0.994896) 100%;
            );
            border-radius: 50%;
          }
        }
      }
      .imgbgc {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        width: 100%;
        height: 315px;
        justify-content: end;
        img {
          position: absolute;
          right: 0;
          top: 0;
          width: 315px !important;
          height: 315px !important;
        }
      }
    }
    .plan_three_body {
      .three_top {
        margin-bottom: 25px;
      }
      .three_middle {
        height: 60px;
        display: flex;
        gap: 15px;
        align-items: center;
        .three_middle_input {
          height: 100%;
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
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          font-weight: 400;
          font-size: 24px;
          flex: 1;
        }
      }
      .three_bom {
        display: flex;
        align-items: center;
        height: 180px;
        margin-top: 40px;
        .three_bom_left_text {
          font-weight: 400;
          font-size: 20px;
        }
        .three_bom_box {
          display: flex;
          gap: 20px;
          .three_bom_box_itemt {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            .three_bom_box_itemt_text {
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

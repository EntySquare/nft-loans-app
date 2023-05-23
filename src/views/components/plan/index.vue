<script setup lang="ts">
import Card from '@/components/card/index.vue'
import MainStore from '@/store'
import { ref } from 'vue'
const State = MainStore() //获取store
const imgData = [
  'https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5711684853279_.pic.jpg',
  'https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5701684853267_.pic.jpg',
  'https://nft-loans-app.oss-cn-shenzhen.aliyuncs.com/5691684853125_.pic.jpg'
]
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
          <div class="imgbgc">
            <div v-for="(item, index) in imgData" :key="index">
              <img :src="item" alt="" :style="{ right: index * 270 + 'px' }" />
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
      .imgbgc {
        position: relative;
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
  }
}
</style>

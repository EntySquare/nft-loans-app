<script setup lang="ts">
import MainStore from '@/store'
import { ref } from 'vue';
const State = MainStore() //获取store
</script>
<script  lang="ts">
export default {
  name: 'Plan'
}
</script>
<template>
  <div class="plan">
    <!-- 居中 -->
    <div class="container">
      <img src="./WechatIMG231.png" alt="Image" />
    </div>
    <!-- 居中 -->
  </div>
</template>
<style scoped lang="less">
.plan {
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
</style>

<script setup lang="ts">
import MainStore from '@/store'
import request from "@/request";
import { ElTable, ElMessage } from 'element-plus'
import { onMounted, ref, computed, nextTick } from 'vue';
import Card from '@/components/card/index.vue'
const State = MainStore()
onMounted(() => {
})
nextTick(() => {
})
</script>
<script  lang="ts">
export default {
  name: 'Poh'
}
</script>
<template>
  <div class="poh">
    <!-- 居中 -->
    <!-- <div style="height: 50px"></div> -->
    <div class="container">
      <h1 class="poh_title">
        {{ $t('poh.title1') }}
      </h1>
    </div>
    <!-- 居中 -->
  </div>
</template>
<style scoped lang="less">
.poh {
  @keyframes glowing {
    0% { color: #fff; text-shadow: 0 0 5px #fff; }
    50% { color: #48ff00; text-shadow: 0 0 20px #00ffd0; }
    100% { color: #fff; text-shadow: 0 0 5px #fff; }
  }

  .glow-text {
    font-size: 24px;
    animation: glowing 1.5s infinite;
  }
  .container {
    display: flex;
    align-items: center;
    height: 100vh;
    justify-content: center;

    .poh_title {
      animation: glowing 1.5s infinite;
      text-align: center;
      font-size: 3em;
      font-weight: bold;
      // background: radial-gradient(circle, rgba(235, 237, 238, 1) 0%, rgba(206, 228, 235, 1) 17%, rgba(181, 217, 232, 1) 35%, rgba(156, 207, 229, 1) 53%, rgba(128, 196, 226, 1) 72%, rgba(98, 185, 223, 1) 90%, rgba(63, 174, 220, 1) 100%);
      // background-clip: text;
      // -webkit-background-clip: text;
      // color: transparent;
      // -webkit-text-fill-color: transparent;
      // text-shadow: 0px 0px 5px rgba(63, 174, 220, 0.5), 0px 0px 10px rgba(63, 174, 220, 0.5), 0px 0px 15px rgba(63, 174, 220, 0.5), 0px 0px 20px rgba(63, 174, 220, 0.5);
      //background: -webkit-linear-gradient(left, #f1c40f, #f39c12, #e74c3c);
      -webkit-background-clip: text;
      color: transparent;
      font-weight: bold;
    }
  }
}
</style>

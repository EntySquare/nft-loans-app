<script setup lang="ts">
// import PandoraBeneficiaries from './PandoraBeneficiaries.vue'
</script>
<script  lang="ts">
export default {
  name: 'Explorer'
}
</script>
<template>
  <div class="explorer">
    <!-- 居中 -->
    <div class="container">
<!--      <h1>-->
<!--        Explorer-->
<!--      </h1>-->
<!--      <PandoraBeneficiaries></PandoraBeneficiaries>-->
    </div>
    <!-- 居中 -->
  </div>
</template>
<style scoped lang="less">
.explorer {
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

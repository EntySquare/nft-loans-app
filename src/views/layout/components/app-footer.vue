<script lang="ts" setup name="AppFooter"></script>
<script lang="ts">
export default { name: 'AppFooter' }
</script>

<template>
  <footer class="app_footer">
    <div class="container">
      <div class="item_top">
        <div>
          <div class="item_top_text">{{ $t('footer.myBenefit') }}</div>
          <div class="item_top_text">{{ $t('footer.myNgt') }}</div>
          <div class="item_top_text">{{ $t('footer.personalCenter') }}</div>
        </div>
        <div>
          <div class="item_top_text">{{ $t('footer.aboutUs') }}</div>
          <div class="item_top_text">{{ $t('footer.serve') }}</div>
          <div class="item_top_text">{{ $t('footer.agreements') }}</div>
        </div>
      </div>
      <div class="item_bom">
        <div class="item_bom_left">@ All Rights Reserved</div>
        <div class="item_bom_right">MetaGalaxy</div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="less">
.app_footer {
  position: absolute;
  z-index: 2; //最高级
  bottom: 0;
  left: 0;
  margin-top: 30px;
  height: 155px;
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(50px);
  .container {
    padding-top: 20px;
    .item_top {
      display: flex;
      justify-content: center;
      gap: 20px;
      .item_top_text {
        font-size: 14px;
        color: #ffffff;
        margin-top: 10px;
      }
    }
    .item_bom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      .item_bom_left {
        font-size: 14px;
        color: #ffffff;
      }
      .item_bom_right {
        font-size: 14px;
        color: #ffffff;
      }
    }
  }
}
</style>

<script setup lang="ts">
import Card from '@/components/card/index.vue'
import MainStore from '@/store' //引入store
import useClipboard from 'vue-clipboard3' //复制
import { useI18n } from 'vue-i18n' //国际化
import { ElMessage } from 'element-plus' //消息提示
const { t } = useI18n() //国际化
const State = MainStore() //使用store
State.getPayCount() //获取支付数量
const { toClipboard } = useClipboard() // 复制
const copy = async () => {
  State.setInvitationlink() //设置邀请链接
  try {
    await toClipboard(State.Invlink) //实现复制
    ElMessage({
      message: t('cope.success'),
      type: 'success'
    })
    window.location.href = State.Invitationlink
    console.log('复制成功')
  } catch (e) {
    ElMessage({
      message: t('cope.error'),
      type: 'success'
    })
    console.error(e)
  }
}
State.setInvitationlink() //设置邀请链接
function share () {
  console.log('State.Invlink:', State.Invlink)
  // State.setInvitationlink() //设置邀请链接
  window.open(
    `https://twitter.com/intent/tweet?text=Quick%20summon%20${State.Invlink}`,
    '_blank'
  )
}
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
      <div class="alive-light">dkjflksdjfg</div>
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

      .cardone {
        margin-top: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        flex-wrap: wrap;

        .cardone-item {
          width: 49%;
          height: 100%;
          margin-bottom: 20px;

          .cardone-item-body {
            height: 60px;
            padding: 0px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .cardone-body-item {
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-around;

              .cardone-body-item-title {
                font-size: 18px;
                color: #fff;
                font-family: Manrope-Regular;
                white-space: nowrap;
              }

              .cardone-body-item-desc {
                font-size: 20px;
                color: #fffe00;
                font-family: Manrope-Regular;
              }
            }

            .cardone-Share {
              background-color: #ffffff37;
              min-width: 50%;
              padding: 10px;
              border-radius: 10px;
              font-size: 16px;
              color: #fffe00;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-family: Manrope-Regular;
            }

            .cardone-btn {
              margin-left: 10px;
              display: flex;
              align-items: center;
              white-space: nowrap;
              cursor: pointer;

              .iconfont {
                font-size: 26px;
                color: #fffe00;
              }

              span {
                margin-left: 5px;
                font-size: 16px;
                color: #fffe00;
                font-family: Manrope-Regular;
              }
            }

            .icontwitter {
              margin-left: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
              min-width: 30px;
              height: 30px;
              box-sizing: border-box;
              border-radius: 5px;
              background-color: #e8f1f8;
              cursor: pointer;

              .iconfont {
                font-size: 26px;
                color: #5197eb;
              }
            }
          }
        }
      }

      .cardtwo {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        flex-wrap: wrap;

        .cardtwo-item-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;

          .cardtwo-item {
            width: 32%;
            margin-bottom: 20px;
            height: 100%;

            span {
              display: inline-block;
              width: 30px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              border-radius: 50%;
              background-color: #fffe00;
              font-size: 20px;
              color: #913fe3;
            }

            div {
              display: inline-block;
              margin-left: 10px;
              text-align: center;
              font-size: 16px;
              color: #fff;
            }
          }
        }
      }

      .cardthree {
        max-width: 50%;
        width: 100%;
        margin: 0 auto 200px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // flex-wrap: wrap;

        .cardthree-item {
          width: 100%;
          font-size: 18px;
          display: flex;
          justify-content: space-between;

          .cardthree-text {
            // width: 80%;
            height: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background-color: #ffffff37;
            border-radius: 10px;
            padding: 10px;
          }

          .btn-desable {
            min-width: 60px;
            margin-left: 10px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #3e3086;
            border-radius: 10px;
            font-size: 18px;
            color: #c0c048;
            font-family: Manrope-Regular;
            cursor: not-allowed;
            white-space: nowrap;
          }

          .cardthree-btn {
            padding: 0 10px;
            min-width: 60px;
            margin-left: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f9f840;
            border-radius: 10px;
            font-size: 18px;
            color: #5942d3;
            font-family: Manrope-Regular;
            cursor: pointer;
            white-space: nowrap;
          }
        }
      }

      .main-title {
        width: 100%;
        text-align: center;
        text-shadow: 0 0 10px black;
        white-space: nowrap;
        font-size: 5.375rem;
        color: #fff;
        font-family: Manrope-Regular;
        margin-bottom: 20px;
      }

      .main-desc {
        // white-space: nowrap;
        text-shadow: 0 0 10px black;
        text-align: center;
        font-size: 28px;
        color: #fff;
        font-family: Manrope-Regular;
        margin-bottom: 20px;
      }

      .main-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        gap: 20px;
      }

      .main-btn-item {
        white-space: nowrap;
        height: 35px;
        line-height: 35px;
        padding: 0px 15px;
        font-size: 18px;
        border-radius: 10px;
        color: #524dfb;
        background-color: #fff;
        cursor: pointer;
      }

      .btn-bgc {
        background: #776dff !important;
        box-shadow: 0px 0px 10px 0px #000000;
        color: #fff !important;

        &:hover {
          background-color: #645cdbeb !important;
          color: @hoverColor !important;
        }
      }

      .btn-bgc-two {
        background: #e67bd9 !important;
        box-shadow: 0px 0px 10px 0px #000000;
        color: #fff;

        &:hover {
          background-color: #e67bd9eb !important;
          color: @hoverColor !important;
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

<script setup lang="ts">
import MainStore from '@/store'
import request from '@/request'
import Card from '@/components/card/index.vue'
</script>
<script lang="ts">
export default {
  name: 'Record'
}
</script>
<template>
  <div class="home">
    <!-- 居中 -->
    <div class="container">
      <div class="card">
        <div class="card_title">
          <div class="card_left">
            <div class="card_left_dj">
              <div>我的等级 &nbsp;&nbsp;&nbsp;<span>V1</span></div>
              <div style="margin-top: 11px">
                我的UID &nbsp;&nbsp;&nbsp;<span>132**lidfap</span>
              </div>
            </div>
          </div>
          <div class="card_right">
            <div class="card_right_rh">
              <div>邀请人数&nbsp;&nbsp;&nbsp;<span>2314人</span></div>
              <div style="margin-top: 11px">
                累计质押次数 &nbsp;&nbsp;&nbsp;<span>21478132</span>
              </div>
            </div>
          </div>
        </div>

        <Card bradius="30px" padding="0px" style="margin-top: 20px">
          <div class="address">
            <div class="address_text">
              <span>邀请地址:</span> <input type="text" />
              <el-button class="address_text_btu" round>点击复制</el-button>
            </div>
          </div>
        </Card>
        <div class="title">邀请列表</div>
        <div class="list">
          <table class="table">
            <tbody>
              <tr v-for="(item, index) in 10" :key="index">
                <td>UID:&nbsp;&nbsp;&nbsp;23145***fsdkjf</td>
                <td style="text-align: center">当前等级:&nbsp;&nbsp;V3</td>
                <td style="text-align: right">质押次数&nbsp;&nbsp;123213次</td>

                <i
                  class="el-icon-arrow-right"
                  style="float: right; margin-right: 17px"
                  >></i
                >
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 居中 -->
  </div>
</template>
<style scoped lang="less">
.home {
  // background-color: @xtxColor;
  width: 100%;
  height: 100%;
  padding-top: 100px;

  .container {
    position: relative;
    z-index: 1; //三级
    max-width: 1390px;
    width: 100%;
    height: calc(100vh - 100px);
    color: aliceblue;
    display: flex;
    justify-content: center;
    align-items: center;
    .card {
      width: 100%;
      // border: red solid 1px;
      .card_title {
        width: 100%;
        height: 118px;
        border: rgba(173, 255, 245, 1) solid 1px;
        background: rgb(16, 6, 62);
        border-radius: 24px;
        .card_left {
          width: 50%;
          height: 100%;
          float: left;
          // border: rgb(208, 255, 0) solid 1px;
          .card_left_dj {
            margin-top: 20px;
            margin-left: 35px;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 500;
            font-size: 20px;
            line-height: 28px;
            color: #ffffff;
          }
        }
        .card_right {
          width: 50%;
          height: 100%;
          float: left;
          // border: rgb(208, 255, 0) solid 1px;

          .card_right_rh {
            margin-top: 20px;
            margin-left: 35px;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 500;
            font-size: 20px;
            line-height: 28px;
            color: #ffffff;
          }
        }
      }

      .address {
        width: 100%;
        height: 47px;
        display: flex;
        align-items: center;
        .address_text {
          // margin-top: 11px;
          margin-left: 35px;
          width: 100%;
          height: 24px;
          font-family: 'PingFang SC';
          font-weight: 400;
          font-size: 20px;
          line-height: 24px;
        }
        .address_text_btu {
          width: 182px;
          height: 47px;
          font-size: 20px;
          margin-top: -12px;
          // margin-right: 35px;

          font-style: normal;
          background: linear-gradient(
            98.28deg,
            #66a39b 10.61%,
            rgba(97, 112, 252, 0.99) 54.84%,
            rgba(158, 99, 205, 0.994896) 100%
          );
          float: right;
        }
      }
      .title {
        width: 100%;
        height: 54px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        // line-height: 28px;
        position: relative;
        top: 22px;
        color: #adfff5 10.61%, rgba(155, 165, 255, 0.99) 54.84%,
          rgba(216, 166, 255, 0.994896);
      }
      .list {
        width: 100%;
        height: 550px;
        border-radius: 24px;
        border: rgb(208, 255, 0) solid 1px;

        .table {
          margin-top: 28px;
          margin-left: 32.59px;
          font-size: 16px;

          tbody {
            display: block;
            overflow-x: hidden;
            overflow-y: auto;
            height: 480px;
          }
          tbody tr {
            display: table;
            width: 98%;
            margin-top: 12px;
            border: #66a39b solid 1px;
            table-layout: fixed;
            word-break: break-all;
            height: 40px;
            border-radius: 24px;
            background-blend-mode: overlay;
            background: linear-gradient(
              98.93deg,
              #aafac0 0%,
              rgba(198, 75, 255, 0) 100%
            );
            background-blend-mode: overlay;
            background: linear-gradient(
              261.07deg,
              #ffffff 0%,
              rgba(0, 0, 0, 0) 100%
            );
            background: rgba(255, 255, 255, 0.2);
          }
          tbody td {
            position: relative;
            left: 15px;
            color: #ffffff;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
          }
        }
        /* 滚动条样式 */
        table tbody::-webkit-scrollbar {
          width: 10px;
        }
        table tbody::-webkit-scrollbar-thumb {
          background-color: #01f5f1;
          border-radius: 5px;
        }
        table tbody::-webkit-scrollbar-track {
          background-color: #004453;
        }
        table tbody::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            98.28deg,
            #66a39b 10.61%,
            rgba(97, 112, 252, 0.99) 54.84%,
            rgba(158, 99, 205, 0.994896) 100%
          );
        }
        table tbody::-webkit-scrollbar-thumb:active {
          background: linear-gradient(
            98.28deg,
            #66a39b 10.61%,
            rgba(97, 112, 252, 0.99) 54.84%,
            rgba(158, 99, 205, 0.994896) 100%
          );
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
import MainStore from '@/store'
import request from '@/request'
import Card from '@/components/card/index.vue'
import Clipboard from 'vue-clipboard3'
import { ElMessage } from 'element-plus'
import {onMounted, ref} from "vue";
import {myInvestmentRep, myInvitee} from "@/api/invitee";
const { toClipboard } = Clipboard() // 复制

const inviteeRes = ref({
  uid: "",
  level: 0,
  accumulated_pledge_count: 0,
  investment_count: 0,
  investment_address: "",
  accumulated_benefit: 0,
  investment_users: [],
} as myInvestmentRep);
const copy = async () => {
  try {
    const res = await toClipboard(inviteeRes.value.investment_address)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
async function dataInit() {
  try {
    // config.headers = { 'Access-Control-Allow-Origin': '*' };
    // config.headers = {
    //   'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
    // };
    // config.headers = {
    //   'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    // };
    // config.headers = {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    // };
    const res = await myInvitee();
    let hiddenPart1 = res.data.json.uid.slice(0, 3);
    let hiddenPart2 = res.data.json.uid.slice(5, 10);//
    res.data.json.uid = hiddenPart1 + "**" + hiddenPart2// 截取除了最后两位的部分
    for (let i = 0; i < res.data.json.investment_users.length; i++) {
      let hiddenPart1 = res.data.json.investment_users[i].uid.slice(0, 3);
      let hiddenPart2 = res.data.json.investment_users[i].uid.slice(5, 10);//
      res.data.json.investment_users[i].uid = hiddenPart1 + "**" + hiddenPart2// 截取除了最后两位的部分
    }
    inviteeRes.value.uid = res.data.json.uid
    inviteeRes.value.level = res.data.json.level
    inviteeRes.value.accumulated_pledge_count = res.data.json.accumulated_pledge_count
    inviteeRes.value.investment_count = res.data.json.investment_count
    inviteeRes.value.investment_address = res.data.json.investment_address
    inviteeRes.value.accumulated_benefit = res.data.json.accumulated_benefit
    inviteeRes.value.investment_users = res.data.json.investment_users
    console.log(res.data)

  } catch (err) {
    console.log("queryMyCovenantFlow err-------------------");
    console.log(err);
  }
}
onMounted(() => {
  dataInit();
});
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
        <Card bradius="24px">
          <div class="card_title">
            <div class="card_left">
              <div class="card_left_dj">
                <div>我的等级 &nbsp;&nbsp;&nbsp;<span>V{{ inviteeRes.level}}</span></div>
                <div style="margin-top: 11px">
                  我的UID &nbsp;&nbsp;&nbsp;<span>{{ inviteeRes.uid}}</span>
                </div>
              </div>
            </div>
            <div class="card_right">
              <div class="card_right_rh">
                <div>邀请人数&nbsp;&nbsp;&nbsp;<span>{{ inviteeRes.investment_count}}人</span></div>
                <div style="margin-top: 11px">
                  累计质押次数 &nbsp;&nbsp;&nbsp;<span>{{ inviteeRes.accumulated_pledge_count}}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card bradius="24px" padding="0px" style="margin-top: 20px">
          <div class="address">
            <div class="address_text">
              <span>邀请地址:</span> <span>{{ inviteeRes.investment_address}} </span>
              <el-button class="address_text_btu" @click="copy" round>
                点击复制&nbsp;<img
                  src="../../../assets/images/Vector.png"
                  alt=""
              /></el-button>
            </div>
          </div>
        </Card>
        <div class="title">邀请列表</div>
        <Card bradius="24px">
          <div class="list">
            <table class="table">
              <tbody>
                <tr v-for="(item, index) in inviteeRes.investment_users" :key="index">
                  <td>UID:&nbsp;&nbsp;&nbsp;{{ item.uid}}</td>
                  <td style="text-align: center">当前等级:&nbsp;&nbsp;V{{ item.level}}</td>
                  <td style="text-align: right">
                    质押次数&nbsp;&nbsp;{{ item.pledge_count}}次
                  </td>

                  <i style="float: right; margin-right: 10px; line-height: 40px"
                    ><img src="../../../assets/images/Vector1.png" alt=""
                  /></i>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
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

        .table {
          margin-top: 28px;
          margin-left: 32.59px;
          font-size: 16px;

          tbody {
            display: block;
            overflow-x: hidden;
            overflow-y: auto;
            height: 500px;
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
            line-height: 40px;
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
          background: linear-gradient(
            98.28deg,
            #66a39b 10.61%,
            rgba(97, 112, 252, 0.99) 54.84%,
            rgba(158, 99, 205, 0.994896) 100%
          );
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

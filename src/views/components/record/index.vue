<script setup lang="ts">
import MainStore from '@/store'
import request from '@/request'
import Card from '@/components/card/index.vue'
import Clipboard from 'vue-clipboard3'
import { ElMessage } from 'element-plus'
import { formatDateY } from '@/utils/time'
import {onMounted, ref} from "vue";
import {myInvestmentRep, myInvitee, inviteeInfoRep,getThisInviteeInfo} from "@/api/invitee";
import {covenantInfo} from "@/api/benefit";
const { toClipboard } = Clipboard() // 复制
const inviteeUid = ref("0")
const inviteeRes = ref({
  uid: "",
  level: 0,
  accumulated_pledge_count: 0,
  investment_count: 0,
  investment_address: "",
  accumulated_benefit: 0,
  investment_users: [],
} as myInvestmentRep);
const inviteeInfoRes = ref({
  uid: "",
  level: 0,
  pledge_count: 0,
  create_time: 0,
  covenant_flows: [],
} as inviteeInfoRep);
const copy = async () => {
  try {
    const res = await toClipboard(inviteeRes.value.investment_address)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
async function getInviteeInfo(uid: string){
  try {
    let data = {
      uid: uid
    }
    console.log(uid)
    inviteeUid.value = uid
   const res = await getThisInviteeInfo(data)
    inviteeInfoRes.value.uid = res.data.json.uid
    inviteeInfoRes.value.level = res.data.json.level
    inviteeInfoRes.value.pledge_count = res.data.json.pledge_count
    inviteeInfoRes.value.create_time = res.data.json.create_time
    inviteeInfoRes.value.covenant_flows = res.data.json.covenant_flows
    console.log(res.data)
  } catch (err) {
    console.log("queryMyCovenantFlow err-------------------");
    console.log(err);
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
                <div>{{ $t('record.level') }}: <span>V{{ inviteeRes.level}}</span></div>
                <div style="margin-top: 11px">
                  {{ $t('record.uid') }}: &nbsp;<span>{{ inviteeRes.uid.slice(0, 3)}}**{{ inviteeRes.uid.slice(5, 12)  }}</span>
                </div>
              </div>
            </div>
            <div class="card_right">
              <div class="card_right_rh">
                <div>{{ $t('record.noi') }}: <span>{{ inviteeRes.investment_count}}人</span></div>
                <div style="margin-top: 11px">
                  {{ $t('record.anop') }}: &nbsp<span>{{ inviteeRes.accumulated_pledge_count}}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card bradius="24px" padding="0px" style="margin-top: 20px">
          <div class="address">
            <div class="address_text">
              <span>{{ $t('record.invitationAddress') }}:</span> <span>{{ inviteeRes.investment_address}} </span>
              <el-button class="address_text_btu" @click="copy" round>
                {{ $t('record.copy') }}<img
                  src="../../../assets/images/Vector.png"
                  alt=""
              /></el-button>
            </div>
          </div>
        </Card>
        <div class="title" v-if="inviteeUid == '0'"><span class="alive-light">{{ $t('record.invitationList') }}</span></div>
        <div class="title" v-if="inviteeUid != '0'"><span class="alive-light">{{ $t('record.invitationInfo') }}</span></div>
        <Card bradius="24px">
          <div class="list" v-if="inviteeUid == '0'">
            <table class="table">
              <tbody>
                <tr v-for="(item, index) in inviteeRes.investment_users" :key="index">
                  <td>UID:&nbsp;&nbsp;&nbsp;{{ item.uid.slice(0, 3)}}**{{ item.uid.slice(5, 12)  }}</td>
                  <td style="text-align: center">{{ $t('record.nowLevel') }}:&nbsp;&nbsp;V{{ item.level}}</td>
                  <td style="text-align: right">
                    {{ $t('record.nop') }}&nbsp;&nbsp;{{ item.pledge_count}}次
                  </td>

                  <i style="float: right; margin-right: 10px; line-height: 40px" @click="getInviteeInfo(item.uid)">
                    <img src="../../../assets/images/Vector1.png" alt=""
                  />
                  </i>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="list" v-if="inviteeUid != '0'">
            <i style="float: left; margin-left: 10px; line-height: 20px" @click="inviteeUid = '0'">
              <img src="../../../assets/images/Vector2.png" alt=""
              />
            </i>
            <div class="detail_info">
              <td class="td1">UID:&nbsp;&nbsp;&nbsp;{{ inviteeUid.slice(0, 3)}}**{{ inviteeUid.slice(5, 12)  }}</td>
                <td style="text-align: center" class="td2">{{ $t('record.nowLevel') }}:&nbsp;&nbsp;V{{ inviteeInfoRes.level}}</td>
                <td style="text-align: right" class="td3">
                {{ $t('record.nop') }}&nbsp;&nbsp;{{ inviteeInfoRes.pledge_count}}次
              </td>
              <td style="text-align: right" class="td4">
                {{ $t('record.inviteTime') }}&nbsp;&nbsp;{{ formatDateY(inviteeInfoRes.create_time)}}
              </td>
            </div>
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
        // line-height: 28px;
        position: relative;
        top: 22px;
        .alive-light {
          font-size: 20px;
          margin-left: 8px;
          white-space: nowrap;
          background-image: -webkit-linear-gradient(
              98.28deg,
              #adfff5 10.61%,
              rgba(155, 165, 255, 0.99) 54.84%,
              rgba(216, 166, 255, 0.994896) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .list {
        width: 100%;
        height: 550px;
        .detail_info {
          box-sizing: border-box;

          position: absolute;
          width: 1176px;
          height: 50px;
          left: calc(50% - 1176px/2 - 0.5px);
          top: calc(50% - 40px/2 - 148.5px);

          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(50px);
          /* Note: backdrop-filter has minimal browser support */

          border-radius: 24px;
          .td1{
            position: absolute;
            width: 154px;
            height: 22px;
            left: 25px;
            top: 11px;

            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 22px;

            color: #FFFFFF;

            opacity: 0.8;
          }
          .td2{
            position: absolute;
            width: 150px;
            height: 22px;
            left: 220px;
            top: 11px;

            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 22px;

            color: #FFFFFF;
          }
          .td3{
                       position: absolute;
                       width: 350px;
                       height: 22px;
                       left: 300px;
                       top: 11px;

                       font-family: 'PingFang SC';
                       font-style: normal;
                       font-weight: 400;
                       font-size: 16px;
                       line-height: 22px;

                       color: #FFFFFF;
           }
          .td4{
            position: absolute;
            width: 383px;
            height: 22px;
            right: 80.5px;
            top: 11px;

            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 22px;

            color: #FFFFFF;
          }
        }
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

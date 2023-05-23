<script setup lang="ts">
import MainStore from '@/store'
import request from "@/request";
import { ElTable, ElMessage } from 'element-plus'
import { onMounted, ref, computed, nextTick } from 'vue';
import Card from '@/components/card/index.vue'
const State = MainStore()
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const list = ref([{ ID: 0, Buyer: '', Round: '', SeRound: '', AplValue: 0, UpdateValue: 0, BuyNum: 0, Select: false }])
const count_value_arr = ref([100])
const count_arrs = ref([1])
// 获取列表
const fetchBalance = async (password :string) => {
  const re = await request.post(`/admin/orderList`, { password:password});//查看预约和购买信息
  if (re.data.code == 0) {
    list.value = re.data.json.list;
    // list.value = [
    //   {
    //     "ID": 67,
    //     "Buyer": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c0",
    //     "AplValue": 1000,
    //     "UpdateValue": 1000,
    //     "Round": "2",
    //     "SeRound": "2",
    //     "BuyNum": 1,
    //     "Select": false
    //   },
    //   {
    //     "ID": 69,
    //     "Buyer": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c0",
    //     "AplValue": 1000,
    //     "UpdateValue": 1000,
    //     "Round": "2",
    //     "SeRound": "2",
    //     "BuyNum": 1,
    //     "Select": false
    //   },
    //   {
    //     "ID": 65,
    //     "Buyer": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c0",
    //     "AplValue": 1000,
    //     "UpdateValue": 1000,
    //     "Round": "2",
    //     "SeRound": "2",
    //     "BuyNum": 2,
    //     "Select": false
    //   },
    //   {
    //     "ID": 68,
    //     "Buyer": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c0",
    //     "AplValue": 1000,
    //     "UpdateValue": 1000,
    //     "Round": "2",
    //     "SeRound": "2",
    //     "BuyNum": 2,
    //     "Select": false
    //   },
    //   {
    //     "ID": 64,
    //     "Buyer": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c0",
    //     "AplValue": 1000,
    //     "UpdateValue": 1000,
    //     "Round": "2",
    //     "SeRound": "2",
    //     "BuyNum": 3,
    //     "Select": false
    //   },
    //   {
    //     "ID": 60,
    //     "Buyer": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c0",
    //     "AplValue": 0,
    //     "UpdateValue": 0,
    //     "Round": "2",
    //     "SeRound": "2",
    //     "BuyNum": 3,
    //     "Select": false
    //   },
    //   {
    //     "ID": 66,
    //     "Buyer": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c0",
    //     "AplValue": 1000,
    //     "UpdateValue": 1000,
    //     "Round": "2",
    //     "SeRound": "2",
    //     "BuyNum": 4,
    //     "Select": false
    //   },
    //   {
    //     "ID": 63,
    //     "Buyer": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c0",
    //     "AplValue": 1000,
    //     "UpdateValue": 1000,
    //     "Round": "2",
    //     "SeRound": "2",
    //     "BuyNum": 4,
    //     "Select": false
    //   },
    //   {
    //     "ID": 62,
    //     "Buyer": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c0",
    //     "AplValue": 1000,
    //     "UpdateValue": 1000,
    //     "Round": "2",
    //     "SeRound": "2",
    //     "BuyNum": 5,
    //     "Select": false
    //   },
    //   {
    //     "ID": 61,
    //     "Buyer": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c0",
    //     "AplValue": 0,
    //     "UpdateValue": 0,
    //     "Round": "2",
    //     "SeRound": "2",
    //     "BuyNum": 5,
    //     "Select": false
    //   }
    // ];
    list.value.forEach((item) => {
      AplValueSum.value += item.AplValue
      item.Select = true
    })
    count_arrs.value = re.data.json.count_arr;
    count_value_arr.value = re.data.json.count_value_arr;
    console.log('re:', re);
  }
}

//次数总额
const constStr = ref(0) //单选框
const count_arr = ref([1, 30]) //次数
const count_value = ref(100) //次数总额
const AplValueSum = ref(0) //预约总额
//计算值
const constSum = computed(() => {
  if (!constStr.value) {
    let sum = 0
    list.value.forEach((item) => {
      if (item.Select) {
        sum += +item.UpdateValue
      }
    })
    return sum
  } else {
    let sum = 0
    list.value.forEach((item) => {
      if (+item.BuyNum >= count_arr.value[0] && +item.BuyNum <= count_arr.value[1]) {
        sum += +item.UpdateValue
      }
    })
    return sum
  }
});
// 次数改变
function countArrChange(i: any) {
  if (i) {
    list.value.forEach((item) => {
      if (+item.BuyNum >= count_arr.value[0] && +item.BuyNum <= count_arr.value[1]) {
        multipleTableRef.value!.toggleRowSelection(item, true)
        item.Select = true
      } else {
        multipleTableRef.value!.toggleRowSelection(item, false)
        item.Select = false
      }
    })
  } else {
    list.value.forEach((item) => {
      multipleTableRef.value!.toggleRowSelection(item, true)
      item.Select = true
    })
  }
}

//金额调整
function countValueChange() {
  list.value.forEach((item) => {
    if (item.Select) {
      console.log('1:', 1)
      item.UpdateValue = +(item.AplValue * count_value.value / 100).toFixed(0)
    }
  })
}

//提交调整后的金额
async function submit() {
  // if (State.password != '123456') {
  //   await ElMessage.error('没有数据,请输刷新页面后重新输入正确密码')
  //   // alertFun()
  //   return
  // }
  let password = prompt('请输入提交密码') || ''
  // if (password != '123456') {
  //   ElMessage.error('密码错误')
  //   return
  // }
  const re = await request.post(`/admin/fromOrderList`, {
    password, list: list.value
  });//查看预约和购买信息
  if (re.data.code == 0) {
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 2000
    })
  } else {
    ElMessage.error('提交失败')
  }
}

//次数总价
function countValueSum(index: any) {
  let sum = 0
  list.value.forEach((item) => {
    if (count_arrs.value[index] == item.BuyNum) {
      sum += +item.UpdateValue
    }
  })
  return sum
}

// 单个勾选改变
function selectChange(selection: any, row: any) {
  row.Select = !row.Select
}

let one = ref()
//弹窗
function alertFun() {
  // if (State.alertShow) return
  let password = prompt('请输入获取数据密码') || ''
  // if (State.password == '123456') {
  //   ElMessage({
  //     message: '密码正确',
  //     type: 'success',
  //   })
  //   State.alertShow = true
    setTimeout(() => {
      fetchBalance(password)
      countArrChange(0)
    }, 1000);
  // } else {
  //   ElMessage.error('密码错误')
  // }
}

//获取屏幕高度
const getScreenHeight = () => {
  return window.screen.height - 500
}
const height = ref()

onMounted(() => {
  alertFun()
  height.value = getScreenHeight()
  // fetchBalance()
})
nextTick(() => {
})
</script>
<script  lang="ts">
export default {
  name: 'Home'
}
</script>
<template>
  <div class="home">
    <!-- 居中 -->
    <!-- <div style="height: 50px"></div> -->
    <div class="container">
      <Card style="margin-bottom: 10px;" bradius="10px">
        <div class="list_box-center">
          <div class="list_box">
            <el-table :data="count_arrs" :height="height">
              <el-table-column label="次数" header-align="center" :align="'center'">
                <template #default="scope">
                  {{ scope.row }}
                </template>
              </el-table-column>
              <el-table-column label="初始总额" header-align="center" :align="'center'">
                <template #default="scope">
                  <i style="color: yellow;">
                    {{ count_value_arr[scope.$index] }}
                  </i>
                </template>
              </el-table-column>
              <el-table-column label="调后总额" header-align="center" :align="'center'">
                <template #default="scope">
                  <i style="color: red;">
                    {{ countValueSum(scope.$index) }}
                  </i>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="list_box" style="flex: 1;">
            <div class="calculation_box">
              <div class="radio-box">
                选中：
                <el-radio-group v-model="constStr" @change="countArrChange">
                  <el-radio :label="0">所有</el-radio>
                  <el-radio :label="1">
                    区间：
                    <el-input-number v-model="count_arr[0]" @change="countArrChange" size="small" :max="count_arr[1]"
                      min="1" style="width: 105px" /> ~
                    <el-input-number v-model="count_arr[1]" @change="countArrChange" size="small" max="30"
                      :min="count_arr[0]" style="width: 105px" /> 次
                  </el-radio>
                </el-radio-group>
              </div>
              <div class="radio-box">
                金额调整(%)：<el-input-number v-model="count_value" @change="countValueChange" :step="10" :max="100" min="0"
                  style="width: 140px;margin-right: 6px;" />
                <span style="margin-left: 20px;">申请总额：<i style="color: yellow;">{{ AplValueSum }}</i></span>
                <span style="margin-left: 20px;">购买总额：<i style="color: red;">{{ constSum.toFixed(0) }}</i></span>
              </div>
            </div>
            <el-table :data="list" style="width: 100%" :height="height" ref="multipleTableRef" @select="selectChange">
              <el-table-column label="全选" type="index" width="60" header-align="center" :align="'center'" />
              <el-table-column type="selection" header-align="center" :align="'center'" width="50" />
              <el-table-column label="钱包" header-align="center" :align="'center'" width="380">
                <template #default="scope">
                  <div class="list_box_item_one">{{ scope.row.Buyer }}</div>
                </template>
              </el-table-column>
              <el-table-column label="购买次数" header-align="center" :align="'center'">
                <template #default="scope">
                  <div class="list_box_item">{{ scope.row.BuyNum }}</div>
                </template>
              </el-table-column>
              <el-table-column label="轮数" header-align="center" :align="'center'">
                <template #default="scope">
                  <div class="list_box_item">{{ scope.row.Round }}</div>
                </template>
              </el-table-column>
              <el-table-column label="子轮数" header-align="center" :align="'center'">
                <template #default="scope">
                  <div class="list_box_item">{{ scope.row.SeRound }}</div>
                </template>
              </el-table-column>
              <el-table-column label="预约金额" header-align="center" :align="'center'">
                <template #default="scope">
                  <div class="list_box_item">{{ scope.row.AplValue }}</div>
                </template>
              </el-table-column>
              <el-table-column label="购买金额" header-align="center" :align="'center'" width="150">
                <template #default="scope">
                  <el-input-number v-model="scope.row.UpdateValue" size="small" :step="100" max="2000" min="100" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="height: 10px"></div>
        <div style="text-align: center;">
          <button @click="submit"
            style="width: 100px; height: 40px; background-color: #6d3ccd; border-radius: 8px; color: aliceblue;">提交</button>
        </div>
      </Card>
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
    max-width: 1400px;
    width: 100%;
    height: calc(100vh - 100px);
    color: aliceblue;
    display: flex;
    justify-content: center;
    align-items: center;

    .list_box-center {
      display: flex;
      gap: 5px;

      .list_box {
        background-color: #141414;
        padding: 15px 0;
        border-radius: 10px;


        .list_box_item,
        .list_box_item_one {
          padding: 5px 5px;
          text-align: center;
        }

        .list_box_item_one {
          background: #1e1e1e;
          width: 380px;
        }

        .calculation_box {
          padding: 5px 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid #6f3ccd;
          display: flex;
          justify-content: space-between;

          .radio-box {
            // flex: 1;
            // border-left: 1px solid #6f3ccd;
            // border-right: 1px solid #6f3ccd;
            padding-left: 10px;
            padding-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

  }
}
</style>

<script setup lang="ts">
import MainStore from '@/store'
import request from "@/request";
import { ElTable, ElMessage } from 'element-plus'
import { onMounted, ref, computed, nextTick } from 'vue';
import Card from '@/components/card/index.vue'
const State = MainStore()
// const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const list = ref([{ ID: 0, Buyer: '', Round: '', SeRound: '', AplValue: 0, UpdateValue: 0, BuyNum: 0, Select: false }])

const AplValueSum =ref(0)
//提交调整后的金额
async function getData(password: string, currentDa: string, subroundXiao: string, status: number) {
  const re = await request.post(`/admin/selectOrderList`, {
    password, currentDa, subroundXiao, status
  });//查看预约和购买信息
  if (re.data.code == 0) {
    console.log('re:', re)
    list.value = re.data.json.list

    AplValueSum.value = 0;
    list.value.forEach((item) => {
      AplValueSum.value += item.AplValue
    })

    ElMessage({
      message: '成功获取数据',
      type: 'success',
      duration: 2000
    })
  } else {
    ElMessage.error('～～～')
  }
}

//获取屏幕高度
const getScreenHeight = () => {
  return window.screen.height - 500
}

const successFun = () => {
  dialogVisible.value = false
  getData(State.password, State.current, State.subroundXi, status.value)
  State.statusss = status.value
}

const height = ref()
const dialogVisible = ref(false)
const status = ref(0)
function handleClose(done: any) {
  console.log('done:', done)
}

onMounted(() => {
  height.value = getScreenHeight()
  if (State.passworddd) {
    getData(State.passworddd, State.current, State.subroundXi, State.stat)
  }
})
nextTick(() => {
})
</script>
<script  lang="ts">
export default {
  name: 'Record'
}
</script>
<template>
  <div class="home">
    <!-- 居中 -->
    <!-- <div style="height: 50px"></div> -->
    <div class="container">
      <Card style="margin-bottom: 10px;" bradius="10px">
        <el-button @click="dialogVisible = true">
          获取数据
        </el-button>


         <h3 style="padding: 20px">总申请金额 {{AplValueSum}}</h3>
        <el-dialog v-model="dialogVisible" title="" width="30%">
          <div style="height: 10px;"></div>
          <el-input v-model="State.passworddd" placeholder="密码" />
          <div style="height: 10px;"></div>
          <el-input v-model="State.currentDa" placeholder="大轮次" />
          <div style="height: 10px;"></div>
          <el-input v-model="State.subroundXiao" placeholder="小轮次" />
          <div style="height: 10px;"></div>
          <el-radio-group v-model="status">
            <el-radio :label="0">申请中</el-radio>
            <el-radio :label="1">申请通过</el-radio>
            <el-radio :label="4">成功</el-radio>
          </el-radio-group>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="successFun">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
        <div class="list_box-center">
          <div class="list_box" style="flex: 1;">
            <el-table :data="list" style="width: 100%" :height="height" ref="multipleTableRef">
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
            </el-table>
          </div>
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

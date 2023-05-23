<script setup lang="ts">
import AppTopNavVue from './components/app-topnav.vue'
import MainStore from '@/store'
const State = MainStore()



//检查MetaMask是否已安装
if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask已安装!')
  //检查当前网络
  window.ethereum.on('accountsChanged', (accounts: any) => {
    window.location.reload()
  })
  //检查当前网络
  window.ethereum.on('chainChanged', (chainId: any) => {
    window.location.reload()
  })

  //页面加载 自动调用这个 连接钱包
  if (window.ethereum.selectedAddress != undefined) {
    State.Connection()
    State.setInvitationlink(); //设置邀请链接
  }
} else {
  console.log('MetaMask未安装!')
}

</script>
<script lang="ts">
export default {
  name: 'layout'
}
</script>
<template>
  <!-- 顶部通栏组件 -->
  <AppTopNavVue></AppTopNavVue>
  <!-- 二级路由的出口 -->
  <router-view></router-view>

</template>
<style scoped lang="less"></style>

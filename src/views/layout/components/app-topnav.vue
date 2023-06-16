<script lang="ts" setup>
import Spline from '@splinetool/vue-spline'
import Loading from 'vue-loading-overlay' // 导入加载组件
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css' // 导入加载组件样式
import vueQr from 'vue-qr/src/packages/vue-qr.vue' //引入组件
import useClipboard from 'vue-clipboard3' //复制
import { ElMessage } from 'element-plus' //消息提示
import MainStore from '@/store' // 导入store
import { ref, nextTick, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n' //国际化
const State = MainStore() //获取store
const { t, locale } = useI18n() //国际化
const router = useRouter()
const changeLang = (lang: string) => {
  locale.value = lang
  localStorage.setItem('upaclang', lang)
}
const dropdown = ref(false) //下拉菜单
const dropdown2 = ref(false) //下拉菜单
const setLang = () => {
  if (locale.value === 'en') {
    changeLang('zh')
  } else {
    changeLang('en')
  }
}
const createShow = ref(false) //是否自动生成二维码
// 连接钱包
const Connection = async () => {
  if (State.account) return
  await State.Connection()
}
const DisConnection = async () => {
  if (!State.account) return
  await State.DisConnection()
}
let download: HTMLAnchorElement
nextTick(() => {
  download = document.getElementById('download') as HTMLAnchorElement
})
// 配置下载二维码
function test(dataUrl: any, id: any) {
  download.href = dataUrl
  download.download = 'image.png'
}
// 生成二维码
function create() {
  createShow.value = true
}
// 弹框
const popoverRef = ref()
const onClickOutside = () => {
  create()
  State.setInvitationlink() //设置邀请链接
  unref(popoverRef).popperRef?.delayHide?.()
}
const { toClipboard } = useClipboard() // 复制
const copy = async () => {
  try {
    await toClipboard(State.Invitationlink) //实现复制
    ElMessage({
      message: t('cope.success'),
      type: 'success'
    })
    console.log('复制成功')
  } catch (e) {
    ElMessage({
      message: t('cope.error'),
      type: 'success'
    })
    console.error(e)
  }
}

console.log('router:', router)
const golink = (id: any, name: any) => {
  router.push({
    path: `${name}/${id}`
  })
}

function loaded(Spline: any) {
  // 小球轨道动画加载完成后执行
  // Spline.setZoom(1.9); // 设置缩放比例
  // Spline.setSize(3440, 1329); // 设置缩放比例
  // Spline.setBackgroundColor('#00000000'); // 设置缩放比例
  // console.log('Spline:', Spline)
}

//窗口大小改变监听
window.onresize = () => {
  // document.getElementById('ivEMfk9ulAFRBn22')!.style.width = document.body.clientWidth + 'px'
  // const h = document.body.clientWidth * (1329 / 3440)
  // document.getElementById('ivEMfk9ulAFRBn22')!.style.height = h + 'px'
}

setTimeout(() => {
  // document.addEventListener("DOMContentLoaded", () => {
  //   const video = document.getElementById("myVideo") as HTMLVideoElement;
  //   const videoIcon = document.getElementById("videoIcon") as HTMLElement;
  //
  //   videoIcon.style.display = "none"; // 隐藏视频图标
  //
  //   video.addEventListener("ended", () => {
  //     video.currentTime = 0; // 将视频播放位置重置为 0
  //     video.play(); // 重新播放视频
  //   });
  //
  //   video.addEventListener("play", () => {
  //     videoIcon.style.display = "none"; // 隐藏视频图标
  //   });
  //
  //   video.addEventListener("pause", () => {
  //     videoIcon.style.display = "block"; // 显示视频图标
  //   });
  // });
}, 1000)
let splineLink = ref('')
let mqList = ref(150)
let show1 = ref(false)
const getWindowInfo = () => {
  show1.value = false
  mqList.value = window.matchMedia('(min-width: 558px)').matches ? 108 : 150
  if (mqList.value == 108) {
    show1.value = true
  }
  // if (show1.value) {
  //   splineLink.value = 'https://prod.spline.design/CafFU2sx4yUXj15i/scene.splinecode'
  // } else {
  //   splineLink.value = 'https://prod.spline.design/Vwi6NjIkX4kQ3Rux/scene.splinecode'
  // }
}
window.addEventListener('resize', getWindowInfo)
getWindowInfo()

function handclose() {
  // show1.value = false
}
</script>
<script lang="ts">
export default { name: 'AppTopnav' }
</script>
<template>
  <!-- 导航栏 -->
  <nav>
    <div class="logo">
      <div style="display: flex; align-items: center">
        <img class="nav-item" src="../../../assets/logo.png" alt="logo" />
      <span class="alive-light">{{ $t('nav.logoName') }}</span>
    </div>
      <div class="nftboxnone" style="margin-left: auto;" @click="dropdown2 = !dropdown2">
        <div class="alive-light" style="font-size: 16px;"> {{ $t('nav.partner') }}</div>
        <div class="pool2" style="background: transparent;" v-show="dropdown2"></div>
        <div v-show="dropdown2" class="Dropdownbox" style="top: 40px;padding: 0;">
          <div class="nftLinkBox">
            <a class="Dropdownbox_item"
              href="https://newgalaxy.io/nft-details/0x3bda5e439af86bbe6b82d8e9ea0b8de99776b66a/9999"
              target="_blank">玄武</a>
            <a class="Dropdownbox_item"
              href="https://newgalaxy.io/nft-details/0x3bda5e439af86bbe6b82d8e9ea0b8de99776b66a/20" target="_blank">朱雀</a>
            <a class="Dropdownbox_item"
              href="https://newgalaxy.io/nft-details/0x3bda5e439af86bbe6b82d8e9ea0b8de99776b66a/998"
              target="_blank">白虎</a>
          </div>
        </div>
      </div>
      <div class="nav_more" @click="dropdown = !dropdown">
        <i v-for="(item, index) in 3" :key="index"></i>
        <div v-show="dropdown" class="Dropdownbox" style="right: 0;">
          <div class="Dropdownbox_item">
            <RouterLink class="nav_item_s alive-light" :to="`/Plan/${State.referrer}`">{{ $t('nav.home') }}</RouterLink>
          </div>
          <div class="Dropdownbox_item">
            <RouterLink class="nav_item_s alive-light" :to="`/Explorer/${State.referrer}`">{{ $t('nav.benefit') }}
            </RouterLink>
          </div>
          <div class="Dropdownbox_item">
            <RouterLink class="nav_item_s alive-light" :to="`/Partners/${State.referrer}`">{{ $t('nav.wallet') }}
            </RouterLink>
          </div>
          <div class="Dropdownbox_item">
            <RouterLink class="nav_item_s alive-light" :to="`/record/${State.referrer}`">{{ $t('nav.invitee') }}
            </RouterLink>
          </div>
          <div class="Dropdownbox_item">
            <div @click="setLang" class="nav_item_s alive-light">
              {{ locale == 'zh' ? '中文' : 'EN' }}
              <div v-if="locale == 'zh'"></div>
              <div v-else></div>
            </div>
          </div>
          <div class="log_out Dropdownbox_item" @click="DisConnection" v-if="State.account">
            <img src="../../../assets/log_out.png" />
            登出
          </div>
        </div>
        <div class="pool" v-show="dropdown"></div>
      </div>
    </div>
    <div class="nav">
      <RouterLink v-if="!State.homeState" class="nav-item" :to="`/Plan/${State.referrer}`">{{ $t('nav.home') }}
      </RouterLink>
      <div class="nav-item" @click="dropdown2 = !dropdown2">
        {{ $t('nav.partner') }}
        <div class="pool2" style="background: transparent;" v-show="dropdown2"></div>
        <div v-show="dropdown2" class="Dropdownbox" style="top: 70px;padding: 0;">
          <div class="nftLinkBox">
            <a class="Dropdownbox_item"
              href="https://newgalaxy.io/nft-details/0x3bda5e439af86bbe6b82d8e9ea0b8de99776b66a/9999"
              target="_blank">玄武</a>
            <a class="Dropdownbox_item"
              href="https://newgalaxy.io/nft-details/0x3bda5e439af86bbe6b82d8e9ea0b8de99776b66a/20" target="_blank">朱雀</a>
            <a class="Dropdownbox_item"
              href="https://newgalaxy.io/nft-details/0x3bda5e439af86bbe6b82d8e9ea0b8de99776b66a/998"
              target="_blank">白虎</a>
          </div>
        </div>
      </div>
      <RouterLink class="nav-item" :to="`/Explorer/${State.referrer}`">{{
        $t('nav.benefit')
      }}</RouterLink>
      <RouterLink class="nav-item" :to="`/Partners/${State.referrer}`">{{
        $t('nav.wallet')
      }}</RouterLink>
      <RouterLink class="nav-item" :to="`/record/${State.referrer}`">{{
        $t('nav.invitee')
      }}</RouterLink>
      <!-- 弹框 -->
      <a href="" id="download"></a>
      <el-popover ref="popoverRef" trigger="click" persistent>
        <vue-qr @click="download.click()" :text="State.Invitationlink" :callback="test" :bindElement="createShow"
          :size="512"></vue-qr>
        <div class="nav-item-popover-text" @click="copy">
          <div>{{ $t('nav.copeone') }}</div>
          <div>{{ $t('nav.copetwo') }}</div>
        </div>
        <template #reference>
          <div @click="onClickOutside" class="nav-item">
            <i class="iconfont icon-share"></i>
          </div>
        </template>
      </el-popover>
      <!-- 弹框 -->
      <!-- 国际化 -->
      <div @click="setLang" class="nav-item">
        {{ locale == 'zh' ? '中文' : 'EN' }}
        <div v-if="locale == 'zh'"></div>
        <div v-else></div>
      </div>
      <!-- 国际化 -->
      <div class="nav-btn">
        <div v-if="!State.account">
          <loading :height="35" :width="20" transition="none" color="#44c9b0" :active="State.isLd && !State.account">
            <template #before>
              <div class="loading">
                {{ State.isLd ? $t('nav.loading') : '' }}
              </div>
            </template>
          </loading>
        </div>
        <div v-if="!State.isLd || State.account" @click="Connection" :class="[
          'connection-btn',
          State.account ? 'connection-btn-nav' : 'hover'
        ]">
          <div class="balance">
            {{ State.account ? `${State.formatBalance(State.balance)}` : '' }}

            {{
              State.account
              ? `| ${State.formatChainBalance(State.balanceChain.toString())}`
              : ''
            }}
          </div>
          <span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
              State.account
              ? State.replaceStr(State.account)
              : $t('nav.connect')
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
        <div class="log_out nonel" v-if="State.account" style="margin-left: 10px">
          <img src="../../../assets/log_out.png" @click="DisConnection" />
        </div>
      </div>
    </div>
  </nav>
  <!-- 背景图 -->
  <div class="container">
    <!-- <Spline claid="ivEMfk9ulAFRBn22" @spline-loaded="loaded" :scene="splineLink" /> -->
    <!-- <Spline v-if="!show1" claid="ivEMfk9ulAFRBn22" @spline-loaded="loaded"
                                                                                                                                                                                            scene="https://prod.spline.design/CafFU2sx4yUXj15i/scene.splinecode" />
                                                                                                                                                                                          <Spline v-else scene="https://prod.spline.design/Vwi6NjIkX4kQ3Rux/scene.splinecode" /> -->

    <!--    <div class="" style="background: #1dc779;width: 100%;height: 100%;min-height: ">-->

    <!--    </div>-->

    <div class="bg-img">
      <!--            <div class="container sky text #CODEVEMBER stars stars1 stars2 shooting-stars"></div>-->
      <!--       <img v-lazy="'/src/assets/images/earth.png'" />-->

      <!--      <video id="myVideo" loop autoplay style="width: 100vw;height: 100vh">-->
      <!--        <source src="./ArcticYellowishJuliabutterfly.mp4" type="video/mp4">-->
      <!--      </video>-->
      <!--      <div class="gif-container">-->
      <!--        <img src="./ArcticYellowishJuliabutterfly.gif" alt="Animated GIF" />-->
      <!--      </div>-->

      <!--      <div class="earth-img"></div>-->
      <!--      <div id="wrap">-->
      <!--        <canvas id="canvas"></canvas>-->
      <!--      </div>-->
    </div>
  </div>
  <div class="topnav"></div>
</template>

<style scoped lang="less">
.nftboxnone {
  display: none;
}

.nftLinkBox {
  display: flex;
  flex-direction: column;

  a {
    margin-left: 0;
    font-size: 16px !important;
    font-weight: 500;
    height: 50px;
    font-size: 14px;
    white-space: nowrap;
    padding: 0px 20px;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #272745db;
    }
  }
}

.topnav {
  position: fixed;
  z-index: 2; //最高级
  top: 0;
  left: 0;
  height: 70px;
  width: 100vw;
  backdrop-filter: blur(10px) !important;
  // 浏览器兼容
  -webkit-backdrop-filter: blur(10px) !important;
  background: #0005178e;
}

//导航栏
nav {
  position: fixed;
  padding: 0 20px;
  z-index: 100; //最高级
  width: 100%;
  max-width: 1560px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 70px;
  // font-family: Manrope-ExtraBold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background: #00051774;
  // backdrop-filter: blur(10px) !important;

  .logo {
    min-width: 202px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    height: 70px;

    img {
      height: 50px;
      width: 50px;
    }

    .nav_more {
      position: relative;
      // display: flex;
      display: none;
      align-items: center;
      height: 50px;
      padding: 20px;
      gap: 2px;
      margin-right: 10px;

      i {
        height: 5px !important;
        width: 5px !important;
        background: #bea7fa;
        border-radius: 50%;

        &:nth-child(1) {
          background: #b7e0f6;
        }

        &:nth-child(2) {
          background: #9ca3f8;
        }
      }

    }
  }

  .Dropdownbox {
    position: relative;
    z-index: 2030;
    transition: all 0.3s ease-in-out;
    position: absolute;
    top: 30px;
    // right: 0;
    backdrop-filter: blur(100px) !important;
    -webkit-backdrop-filter: blur(100px) !important;
    background: rgba(255, 255, 255, 0.229);
    border-radius: 10px;
    padding: 10px;
    overflow: hidden;
    border: 1px solid #08aabc;

    .Dropdownbox_item {
      display: flex;
      align-items: center;
      gap: 10px;
      white-space: nowrap;

      .nav_item_s {
        margin-left: 0;
        font-size: 16px !important;
        font-weight: 500;
        height: 50px;
        font-size: 14px;
        white-space: nowrap;
        padding: 0px 20px;
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
      }

      img {
        height: 15px !important;
        width: 15px !important;
      }
    }
  }

  .pool {
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 2029;
    backdrop-filter: blur(10px) !important;
    // 浏览器兼容
    -webkit-backdrop-filter: blur(10px) !important;
    background: #00051729;
  }

  .pool2 {
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 2029;
  }

  .nav {
    display: flex;

    // width: 960px;
    .nav-item {
      height: 70px;
      font-size: 14px;
      white-space: nowrap;
      padding: 0px 20px;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;

      img {
        height: 20px;
        width: 20px;
      }

      &:hover {
        background: -webkit-linear-gradient(0deg, #3b535a45, #534dfb45);
      }

      .alive-light {
        font-size: 20px;
        width: 140px;
        margin-left: 8px;
        white-space: nowrap;
        background-image: -webkit-linear-gradient(98.28deg,
            #adfff5 10.61%,
            rgba(155, 165, 255, 0.99) 54.84%,
            rgba(216, 166, 255, 0.994896) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .nav-item-popover {
      height: 70px;
      font-size: 14px;
      padding: 0px 20px;
      color: #fff;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        background: -webkit-linear-gradient(0deg, #3b535a45, #534dfb45);
      }
    }

    .nav-btn {
      min-width: 100px;
      height: 70px;
      margin-left: 70px;
      display: flex;
      align-items: center;

      .connection-btn,
      .connection-btn-nav {
        height: 35px;
        line-height: 35px;
        padding: 0px 1px;
        font-size: 16px;
        border-radius: 10px;
        color: #524dfb;
        background-color: #fff;
        cursor: pointer;

        .balance {
          font-family: Manrope-Bold;
          white-space: nowrap;
        }
      }

      .connection-btn {
        min-width: 95px;
      }

      .connection-btn-nav {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        background: -webkit-linear-gradient(0deg, #3b535a, #524dfb);
        color: #fff;
        padding-left: 10px;
        padding-right: 0px;

        span {
          border-radius: 10px;
          padding: 0 10px;
          white-space: nowrap;
          background: -webkit-linear-gradient(0deg, #a82ae7, #524dfb);
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 500;
        }
      }
    }
  }
}

.log_out {
  margin-left: 0;
  font-size: 16px !important;
  height: 50px;
  font-size: 14px;
  white-space: nowrap;
  padding: 0px 20px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;

  img {
    width: 22px;
    max-height: 22px;
  }
}

.container {
  position: fixed;
  max-width: 100vw;
  background-image: url('@/assets/images/img.png');
  display: flex;
  justify-content: center;
  // background-color: pink;
  z-index: 0; //最低级
  width: 100vw;
  height: 100vh;
  padding: 0 !important; //背景图

  .bg-img {
    box-sizing: border-box;
    position: absolute;
    // top: 50%;
    // transform: translateY(-30%) translateX(10%) rotate(15deg);
    // left: -10%;
    // max-width: 60vh;
    // max-height: 60vh;
    // width: 50vw;
    // height: 50vw;
    // overflow: hidden;

    .earth-img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
}

.Vwi6NjIkX4kQ3Ruxcen {
  display: none;
}

//加载动画
.loading {
  display: inline-block;
  // background: #a82ae7;
  transform: translateY(-11px);
  margin-right: 8px;
}

//弹框文字
.nav-item-popover-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #fff;
  margin-top: 10px;
  text-decoration: underline;

  div {
    text-align: center;
  }

  &:hover {
    color: #e67bd9 !important;
  }
}

//下拉菜单
.dropdown {
  .dropdown-item {
    display: flex;
    padding: 10px 20px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    justify-content: center;
    white-space: nowrap;

    img {
      height: 20px;
      width: 20px;
    }

    .img {
      height: 20px;
      width: 20px;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 5px;
    }

    &:hover {
      background: -webkit-linear-gradient(0deg, #3b535a45, #534dfb45);
    }
  }
}

//--------------------------------------------------------

#webgl-canvas {
  background: radial-gradient(circle farthest-corner at center top,
      #071021,
      #19324a);
}

html,
body {
  height: 100%;
  max-width: 100%;
  margin: 0;
  overflow: hidden;
  background: rgba(0, 10, 20, 1) url(https://i.imgur.com/r838U7u.jpg) center no-repeat;
  background-size: cover;
  image-rendering: pixelated;
  font-family: sans-serif;
}

#space {
  width: 100%;
}

#warp {
  position: absolute;
  z-index: 9;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 20px auto;
  color: rgba(209, 255, 255, 1);
  border: 2px solid;
  padding: 1em;
  width: 10em;
  text-align: center;
  font-weight: 700;
  font-size: 1.2em;
  display: inline-block;
  text-decoration: none;
  background: rgba(0, 0, 0, 0.8);
}

/* follow me @nodws */
#btn-twtr {
  clear: both;
  color: #fff;
  border: 2px solid;
  border-radius: 3px;
  text-align: center;
  text-decoration: none;
  display: block;
  font-family: sans-serif;
  font-size: 14px;
  width: 13em;
  padding: 5px 10px;
  font-weight: 600;
  position: absolute;
  top: 0;
  right: 10%;
  margin: 90vh 0;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 0px 3px rgba(0, 0, 0, 0.2);
  opacity: 0.3;
}

#btn-twtr:hover {
  color: #fff;
  opacity: 1;
}
</style>

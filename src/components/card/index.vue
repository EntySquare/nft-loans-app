<script setup lang='ts'>
import { defineProps } from 'vue'
import P from './props'
const props = defineProps(P)
</script>
<template>
    <div class="card">
        <div class="title" :style="{ 'margin-bottom': props.title ? '10px' : 0 }">{{ props.title }}</div>
        <div class="body"
            :style="{ background: props.bgc, 'box-shadow': props.boxshow ? '0px 0px 10px 0px #000000' : '', padding: props.padding, borderRadius: props.bradius }">
            <slot></slot>
        </div>
    </div>
</template>
<style scoped lang='less'>
.card {
    width: 100%;
    height: 100%;

    .title {
        text-shadow: 0 0 10px black;
        white-space: nowrap;
        font-size: 26px;
        color: #fff;
        // font-family: Manrope-Regular;
    }

    .body {
        //模糊半径
        // background: -webkit-linear-gradient(0deg, #a82ae746, #534dfb42) !important;
        backdrop-filter: blur(10px)
    }
}
</style>
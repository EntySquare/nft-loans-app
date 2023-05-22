<!--<script setup lang="ts">-->
<!--import { onMounted, ref } from 'vue'-->
<!--import { useI18n } from "vue-i18n";-->
<!--import {getRounds} from "../../../utils/auth"-->
<!--// import {queryBeneficiariesList, queryMyPandoraBoxes, querySeedBoxesStatics} from "../api/pandora";-->
<!--import { formatDate } from "../../../utils/time";-->

<!--const { t } = useI18n();-->
<!--const value = ref(t(''))-->
<!--const value2 = ref(t(''))-->
<!--const options = [-->
<!--    {-->
<!--        value: "I",-->
<!--        label: "MagicBox.magicBoxI",-->
<!--    }-->
<!--]-->
<!--const round = ref([-->
<!--    {-->
<!--        value: "1",-->
<!--        label: "#1",-->
<!--    },-->
<!--])-->
<!--value.value = options[0].value-->
<!--value2.value = round.value[0].value-->
<!--// get round number-->
<!--const Rounds = ref(0)-->
<!--const getRoundNum = async()=>{-->
<!--  // const res = await querySeedBoxesStatics();-->
<!--  // Rounds.value = res.round-->
<!--  // value2.value = res.round.toString()-->
<!--  // for (let i = 1; i < Rounds.value; i++) {-->
<!--  //   const newRound = {-->
<!--  //         value: (i+1).toString(),-->
<!--  //         label: "#"+(i+1).toString()-->
<!--  //       };-->
<!--  //   round.value.push(newRound)-->
<!--  // }-->
<!--}-->
<!--getRoundNum()-->
<!--// data-->
<!--const data = ref([{-->
<!--    value: '',-->
<!--    identity_address: '',-->
<!--    of_seeds: '',-->
<!--    opening_time: '',-->
<!--    locking_time: '',-->
<!--}])-->
<!--const setdata = () => {-->
<!--    for (let i = 0; i < 60; i++) {-->
<!--        const num = Math.floor(Math.random() * (1000 - 100)) + 100//随机数-->
<!--        const num1 = Math.floor(Math.random() * 10)//随机数-->
<!--        const num2 = Math.floor(Math.random() * 10)//随机数-->
<!--        data.value[i] = {-->
<!--            value: `${i + 1}`,-->
<!--            identity_address: `0xB${num1}${num2}E1DFE71A47D${num1}${num1}${num1}7543d5FE32F06978B82f3F${num2}`,-->
<!--            of_seeds: `${num}`,-->
<!--            opening_time: '2/21 14:49:05',-->
<!--            locking_time: '1-7D',-->
<!--        }-->
<!--    }-->
<!--}-->
<!--const getBeneficiariesData = async () => {-->
<!--    // if (Rounds.value == 0){const res = await querySeedBoxesStatics(); value2.value = res.round.toString()}-->
<!--    // const reply = await queryBeneficiariesList({ generation: value2.value })-->
<!--    // const res = reply.beneficiariesDataList-->
<!--    // data.value = [{ value: '', identity_address: '', of_seeds: '', opening_time: '', locking_time: '', }]-->
<!--    // for (let i = 0; i < res.length; i++) {-->
<!--    //     data.value[i] = {-->
<!--    //         value: res[i].rank,-->
<!--    //         identity_address: res[i].address,-->
<!--    //         of_seeds: res[i].powerAmount,-->
<!--    //         opening_time: formatDate(Number(res[i].openTime)),-->
<!--    //         locking_time: res[i].duration,-->
<!--    //     }-->
<!--    // }-->
<!--}-->
<!--getBeneficiariesData()-->
<!--function filteridentity_address(i: string) {-->
<!--    let str = i.slice(0, 4) + '...' + i.slice(i.length - 6, i.length)-->
<!--    return str-->
<!--}-->
<!--//copy-->
<!--function copy(i: string) {-->
<!--    let oInput = document.createElement('input');-->
<!--    oInput.value = i;-->
<!--    document.body.appendChild(oInput);-->
<!--    oInput.select();-->
<!--    document.execCommand('Copy');-->
<!--    document.body.removeChild(oInput);-->
<!--}-->

<!--</script>-->

<!--<template>-->
<!--    <div class="PandoraBeneficiaries">-->
<!--        &lt;!&ndash; 顶部select begin &ndash;&gt;-->
<!--        <div class="top">-->
<!--            <el-select v-model="value" class="my-select" :placeholder="$t('MagicBox.magicBoxI')">-->
<!--                <el-option v-for="item in options" :key="item.value" :label="$t(item.label)" :value="item.value" />-->
<!--            </el-select>-->
<!--            <div style="position: relative;">-->
<!--                <div class="round_number">{{ $t('welfare.Round_number') }}</div>-->
<!--                <el-select @change="getBeneficiariesData" v-model="value2" class="my-select2"-->
<!--                    :placeholder="$t('MagicBox.magicBoxI')">-->
<!--                    <el-option v-for="item in round" :key="item.value" :label="$t(item.label)" :value="item.value" />-->
<!--                </el-select>-->
<!--            </div>-->
<!--        </div>-->
<!--        &lt;!&ndash; 顶部select end &ndash;&gt;-->
<!--        <div class="boxlistone main_boxlistone">-->
<!--            <div class="watchhead">-->
<!--                <div class="item">{{ $t('welfare.ranking') }} </div>-->
<!--                <div class="item">{{ $t('welfare.identity') }} </div>-->
<!--                <div class="item">{{ $t('welfare.ofseeds') }} </div>-->
<!--                <div class="item">{{ $t('welfare.openingtime') }} </div>-->
<!--                <div class="item">{{ $t('welfare.lockingtime') }} </div>-->
<!--            </div>-->
<!--            <div v-for="item in data" :key="item.value" class="watchhead item_border">-->
<!--                <div class="item">-->
<!--                    <el-icon style="vertical-align: text-top;" color="#774ee0" :size="22">-->
<!--                        <Present />-->
<!--                    </el-icon>-->
<!--                    #{{ item.value }}-->
<!--                </div>-->
<!--                <div style="cursor: copy;" class="item" @click="copy(item.identity_address)">-->
<!--                    <el-tooltip class="box-item" effect="dark" :content="item.identity_address" placement="bottom">-->
<!--                        {{ filteridentity_address(item.identity_address) }}-->
<!--                    </el-tooltip>-->
<!--                </div>-->
<!--                <div class="item item_text">-->
<!--                    <img src="../assets/tronWeb.png" class="v-align body-one-img">-->
<!--                    {{ item.of_seeds }}-->
<!--                    <text style="font-size: 12px;">TRX</text>-->
<!--                </div>-->
<!--                <div class="item">{{ item.opening_time }}</div>-->
<!--                <div class="item">{{ item.locking_time }}D</div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="boxlisttwo main_boxlisttwo">-->
<!--            <div v-for="item in data" :key="item.value" class="two_item">-->
<!--                <div class="boxlisttwo_top">-->
<!--                    <div class="img"></div>-->
<!--                    <div class="top_right">-->
<!--                        <text> {{ $t(options[0].label) }}</text>-->
<!--                        <text>-->
<!--                            <el-icon class="v-align icon">-->
<!--                                <Promotion />-->
<!--                            </el-icon>#{{ item.value }}</text>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="twobody">-->
<!--                    <div class="item_text2">-->
<!--                        <img src="../assets/tronWeb.png" class="v-align body-one-img">-->
<!--                        {{ item.of_seeds }}-->
<!--                        <text style="font-size: 12px;">TRX</text>-->
<!--                    </div>-->
<!--                    <div class="item">-->
<!--                        <div>{{ $t('welfare.aopeningtime') }}:</div>-->
<!--                        <div>{{ item.opening_time }}</div>-->
<!--                    </div>-->
<!--                    <div class="item">-->
<!--                        <div>{{ $t('welfare.alockingtime') }}:</div>-->
<!--                        <div>{{ item.locking_time }}D</div>-->
<!--                    </div>-->
<!--&lt;!&ndash;                    <div class="item">&ndash;&gt;-->
<!--&lt;!&ndash;                        <div>{{ $t('welfare.estimed_seed_retuen') }}:</div>&ndash;&gt;-->
<!--&lt;!&ndash;                        <div>{{ item.of_seeds }}%</div>&ndash;&gt;-->
<!--&lt;!&ndash;                    </div>&ndash;&gt;-->
<!--                    <div class="item">-->
<!--                        <div>{{ $t('welfare.aidentity') }}:</div>-->
<!--                        <div style="cursor: copy;" @click="copy(item.identity_address)">-->
<!--                            <el-tooltip class="box-item" effect="dark" :content="item.identity_address" placement="bottom">-->
<!--                                {{ filteridentity_address(item.identity_address) }}-->
<!--                            </el-tooltip>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->

<!--<style scoped>-->
<!--.my-select {-->
<!--    height: 40px !important;-->
<!--    border-radius: 16px;-->
<!--}-->

<!--.my-select2 {-->
<!--    height: 40px !important;-->
<!--    border-radius: 16px;-->
<!--}-->

<!--::v-deep .my-select .el-select .el-input.is-focus .el-input__wrapper {-->
<!--    box-shadow: 0 0 0 2px #2b5ec8 inset !important;-->
<!--}-->

<!--::v-deep .my-select .el-input__inner {-->
<!--    height: 40px;-->
<!--    font-size: 15px;-->
<!--    font-weight: 500;-->
<!--    text-align: center;-->
<!--    color: white;-->
<!--}-->

<!--::v-deep .my-select .el-input__wrapper {-->
<!--    box-shadow: 0 0 0 2px #2b5ec8 inset !important;-->
<!--    border-radius: 16px;-->
<!--    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(0deg, rgb(17, 128, 255), rgb(17, 128, 255));-->
<!--}-->

<!--::v-deep .my-select.el-select .el-input .el-select__caret {-->
<!--    color: white;-->
<!--}-->

<!--::v-deep .my-select2 .el-select .el-input.is-focus .el-input__wrapper {-->
<!--    box-shadow: 0 0 0 2px #2b5ec8 inset !important;-->
<!--}-->

<!--::v-deep .my-select2 .el-input__inner {-->
<!--    height: 40px;-->
<!--    width: 50px;-->
<!--    padding-left: 10px;-->
<!--    font-size: 18px;-->
<!--    color: rgb(13, 53, 131);-->
<!--}-->

<!--::v-deep .my-select2 .el-input__wrapper {-->
<!--    box-shadow: 0 0 0 1px #959595 inset !important;-->
<!--    border-radius: 16px;-->
<!--    background: rgba(255, 0, 0, 0);-->
<!--}-->

<!--::v-deep .my-select2.el-select .el-input .el-select__caret {-->
<!--    color: rgb(13, 53, 131);-->
<!--}-->

<!--.top {-->
<!--    margin-top: 20px;-->
<!--    margin-bottom: 30px;-->
<!--    display: flex;-->
<!--    gap: 24px;-->
<!--}-->

<!--.round_number {-->
<!--    position: absolute;-->
<!--    font-size: 14px;-->
<!--    color: #8c8fa9;-->
<!--    /* font-weight: 100; */-->
<!--    width: 100px;-->
<!--    top: -20px;-->
<!--}-->

<!--.boxlistone {-->
<!--    display: none;-->
<!--    background-color: #fff;-->
<!--    border-radius: 30px;-->
<!--    font-size: 16px;-->
<!--    font-size: 16px;-->
<!--    border: 1px solid rgb(205, 199, 185);-->
<!--    overflow: hidden;-->
<!--}-->

<!--.watchhead {-->
<!--    width: 100%;-->
<!--    display: flex;-->
<!--    justify-content: space-around;-->
<!--    color: rgb(147, 159, 170);-->
<!--}-->



<!--.watchhead .item {-->
<!--    box-sizing: border-box;-->
<!--    height: 60px;-->
<!--    line-height: 36px;-->
<!--    padding: 12px 24px;-->
<!--    white-space: nowrap;-->
<!--}-->

<!--.watchhead .item {-->
<!--    flex: 1.5;-->
<!--}-->


<!--.watchhead .item:first-child {-->
<!--    flex: 1;-->
<!--}-->

<!--.watchhead .item:nth-child(2) {-->
<!--    flex: 2;-->
<!--}-->

<!--.item_border {-->
<!--    border-top: 1px solid rgb(205, 199, 185);-->
<!--    color: rgb(140, 143, 169);-->
<!--}-->

<!--.body-one-img {-->
<!--    width: 20px;-->
<!--    margin-right: 2px;-->
<!--}-->

<!--.item_text {-->
<!--    font-size: 20px;-->
<!--    color: #09c2e7;-->
<!--}-->

<!--.boxlisttwo {-->
<!--    width: 100%;-->
<!--    display: grid;-->
<!--    grid-gap: 25px;-->
<!--    grid-template-columns: repeat(2, 2fr);-->
<!--}-->

<!--.boxlisttwo .two_item {-->
<!--    background-color: #fff;-->
<!--    border-radius: 40px;-->
<!--    overflow: hidden;-->
<!--}-->

<!--.boxlisttwo .two_item .twobody {-->
<!--    padding: 30px;-->
<!--}-->

<!--.boxlisttwo .two_item .twobody .item {-->
<!--    padding-bottom: 20px;-->
<!--    display: flex;-->
<!--    justify-content: space-between;-->
<!--    font-size: 16px;-->
<!--}-->

<!--.boxlisttwo .two_item .twobody .item:last-child {-->
<!--    padding-bottom: 0px;-->
<!--}-->

<!--.boxlisttwo .two_item .twobody .item div:first-child {-->
<!--    color: rgb(158, 162, 166);-->
<!--}-->

<!--.boxlisttwo .two_item .twobody .item div:last-child {-->
<!--    color: rgb(83, 43, 168);-->
<!--}-->

<!--.boxlisttwo .two_item .twobody .item_text2 {-->
<!--    font-size: 20px;-->
<!--    color: rgb(88, 90, 134);-->
<!--    padding-bottom: 20px;-->
<!--}-->

<!--.boxlisttwo .two_item .boxlisttwo_top {-->
<!--    box-sizing: border-box;-->
<!--    height: 112px;-->
<!--    padding: 17px 22px 20px;-->
<!--    background-color: #f6f4fab3;-->
<!--    display: flex;-->
<!--    justify-content: space-between;-->
<!--    border-bottom: 1px solid rgb(227, 223, 232);-->
<!--}-->

<!--.boxlisttwo .two_item .boxlisttwo_top .top_right {-->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    align-items: end;-->
<!--    /* justify-content: space-between; */-->
<!--}-->



<!--.boxlisttwo .two_item .boxlisttwo_top .top_right .icon {-->
<!--    font-size: 25px;-->
<!--    width: 30px;-->
<!--    height: 30px;-->
<!--    border-radius: 8px;-->
<!--    background-color: #ebebf2;-->
<!--    color: #78d8ec;-->
<!--}-->

<!--.boxlisttwo .two_item .boxlisttwo_top .top_right text:first-child {-->
<!--    font-size: 20px;-->
<!--    color: #0f66cc;-->
<!--}-->

<!--.boxlisttwo .two_item .boxlisttwo_top .top_right text:last-child {-->
<!--    padding-top: 20px;-->
<!--    height: 30px;-->
<!--    font-size: 20px;-->
<!--    color: #585a86;-->
<!--}-->

<!--.boxlisttwo .img {-->
<!--    width: 74px;-->
<!--    height: 74px;-->
<!--    background-size: cover;-->
<!--    background-position: center;-->
<!--    background-image: url("../../../assets/type1Icon-8c68bf6b.png");-->
<!--}-->
<!--</style>-->

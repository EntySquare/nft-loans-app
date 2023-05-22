// @ts-ignore
import { BigDecimal } from 'bigdecimal';

export enum EtherUnit {
    WEI = 'wei',
    GWEI = 'gwei',
    ETHER = 'ether',
}

export const convertEtherUnits = (value: number, fromUnit: EtherUnit, toUnit: EtherUnit): number => {
    const conversion = {
        wei: 1,
        gwei: 10 ** 9,
        ether: 10 ** 18,
    };
    const wei = value * conversion[fromUnit];
    return isNaN(wei / conversion[toUnit]?.valueOf()) ? 0 : wei / conversion[toUnit]?.valueOf();
};

//仓计算 收益率计算
export function probability(startTime: number, endTime: number): { totalProbability: string, increment: string } {
    const start = new Date(startTime * 1000);
    const end = new Date(endTime * 1000);

    const duration = end.getTime() - start.getTime();
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));

    let totalProbability = "0"; //总收益率
    let increment = "0.005";//当天收益率

    for (let i = 1; i <= days; i++) {
        totalProbability = calculateDecimal(totalProbability, increment, "+");
        if (increment != "1.5") {
            increment = calculateDecimal(increment, "0.005", "+");
        }
    }

    return { totalProbability: totalProbability, increment: increment };
}

//仓计算 收益率计算
export function probabilityUser(startTime: number, endTime: number, startUserTime: number): string {
    const start = new Date(startTime * 1000);
    const end = new Date(endTime * 1000);
    const startUser = new Date(startUserTime * 1000);

    const duration = end.getTime() - start.getTime();
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));

    const durationUser = end.getTime() - startUser.getTime();
    const daysUser = Math.floor(durationUser / (1000 * 60 * 60 * 24));


    let totalProbabilityUser = "0";
    let totalProbability = "0";
    let increment = "0.005";

    let userDay7 = 1;
    for (let i = 1; i <= days; i++) {
        totalProbability = calculateDecimal(totalProbability, increment, "+");
        // totalProbability += increment;
        console.log("天：", i, "  总收益率：", totalProbability, "  increment：", increment)
        if (i > days - daysUser) {//周期7天 用户持3天 4天后开始计算
            if (userDay7 <= 7) {
                totalProbabilityUser = calculateDecimal(totalProbabilityUser, increment, "+");
                console.log("用户持有--------------------天：", i, "  总收益率：", totalProbabilityUser)
                userDay7++;
            }
            // totalProbabilityUser = calculateDecimal(totalProbabilityUser, increment, "+");
            // console.log("用户持有--------------------天：",i ,"  总收益率：",totalProbabilityUser)
        }
        if (increment != "1.5") {
            increment = calculateDecimal(increment, "0.005", "+");
        }
    }
    return totalProbabilityUser;//用户总收益
}

//收益率计算
export function calculateProfitability(rechargeAmount: number, withdrawalAmount: number): string {
    const netCashFlow = calculateDecimal(withdrawalAmount.toString(), rechargeAmount.toString(), "-");
    const profitability = calculateDecimal2f(netCashFlow.toString(), rechargeAmount.toString(), "/", 2);
    return calculateDecimal(profitability, "100", "*");
}


function calculateDecimal(num1: string, num2: string, operator: string): string {
    const decimal1 = new BigDecimal(num1);
    const decimal2 = new BigDecimal(num2);

    let result: BigDecimal;

    switch (operator) {
        case '+':
            result = decimal1.add(decimal2);
            break;
        case '-':
            result = decimal1.subtract(decimal2);
            break;
        case '*':
            result = decimal1.multiply(decimal2);
            break;
        case '/':
            result = decimal1.divide(decimal2, 10, BigDecimal.ROUND_HALF_UP);
            break;
        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
    return result.toString();
}
//fNum 保留小数位数
function calculateDecimal2f(num1: string, num2: string, operator: string, fNum: number): string {
    const decimal1 = new BigDecimal(num1);
    const decimal2 = new BigDecimal(num2);

    let result: BigDecimal;

    switch (operator) {
        case '+':
            result = decimal1.add(decimal2);
            break;
        case '-':
            result = decimal1.subtract(decimal2);
            break;
        case '*':
            result = decimal1.multiply(decimal2);
            break;
        case '/':
            result = decimal1.divide(decimal2, fNum, BigDecimal.ROUND_HALF_UP);
            break;
        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
    return result.toString();
}
// // 示例使用
// const ether = 1.23456789;
// const gwei = convertEtherUnits(ether, EtherUnit.ETHER, EtherUnit.GWEI);
// console.log(`${ether} ETH = ${gwei} GWEI`);
//
// const wei = convertEtherUnits(ether, EtherUnit.ETHER, EtherUnit.WEI);
// console.log(`${ether} ETH = ${wei} WEI`);

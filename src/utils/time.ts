// 时间戳转换时间
// eslint-disable-next-line import/prefer-default-export
import axios from "axios";

export function formatDate(time: number) {
  if (time === 0) return "";
  const date = new Date(time * 1000);
  const Y = date.getFullYear();
  const M = (date.getMonth() + 1) as number;
  const d = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  return (
    // Y +
    // String("/") +
    M.toString().padStart(2, "0") +
    String("/") +
    d.toString().padStart(2, "0") +
    String(" ") +
    h.toString().padStart(2, "0") +
    String(":") +
    m.toString().padStart(2, "0") +
    String(":") +
    s.toString().padStart(2, "0")
  );
}

export function formatDateMMDDHHNN(time: number) {
  console.log('time:', time)
  if (time === 0) return "";
  const date = new Date(time * 1000);
  const Y = date.getFullYear();
  const M = (date.getMonth() + 1) as number;
  const d = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  return isNaN(M) ? 0 : (
    // Y +
    // String("/") +
    M.toString().padStart(2, "0") +
    String("/") +
    d.toString().padStart(2, "0") +
    String(" ") +
    h.toString().padStart(2, "0") +
    String(":") +
    m.toString().padStart(2, "0")
  );
}


export function formatDateY(time: number) {
  if (time === 0) return "";
  const date = new Date(time * 1000);
  const Y = date.getFullYear();
  const M = (date.getMonth() + 1) as number;
  const d = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  return (
    Y +
    String("/") +
    M.toString().padStart(2, "0") +
    String("/") +
    d.toString().padStart(2, "0") +
    String(" ") +
    h.toString().padStart(2, "0") +
    String(":") +
    m.toString().padStart(2, "0") +
    String(":") +
    s.toString().padStart(2, "0")
  );
}

export class CountDown {
  timeStamp = 0
  // day: number | string = 0
  hour: number | string = 0
  second: number | string = 0
  min: number | string = 0

  //获取时间
  getTime(number: number) {// 传入时间戳
    this.timeStamp = number - Math.round(new Date().getTime() / 1000) // 传入时间戳减去当前时间戳。 除1000是为了消除毫秒
    this.timeStamp -= 1
    // 计算 天 时 分 秒
    const tempDay = Math.floor(this.timeStamp / (60 * 60 * 24))
    const tempHour = Math.floor(this.timeStamp / (60 * 60))
    const tempMin = Math.floor(this.timeStamp / 60) - tempHour * 60
    const tempSecond = this.timeStamp - tempHour * 60 * 60 - tempMin * 60
    // 为了倒计时 个数和双数不影响宽度变化 做数据处理
    // this.day = String(tempDay).length === 1 ? '0' + tempDay : tempDay
    this.hour = String(tempHour).length === 1 ? '0' + tempHour : tempHour
    this.min = String(tempMin).length === 1 ? '0' + tempMin : tempMin
    this.second = String(tempSecond).length === 1 ? '0' + tempSecond : tempSecond
  }
}


export function convertToInt(value: number | string): number {
  if (typeof value === 'number') {
    return Math.floor(value); // 如果值本来就是数字类型，直接返回其整数部分
  } else if (typeof value === 'string') {
    const intValue = parseInt(value, 10); // 将字符串转换为数字类型
    if (isNaN(intValue)) {
      return 0; // 如果转换失败，返回0
    } else {
      return intValue;
    }
  } else {
    return 0; // 如果值既不是数字类型也不是字符串类型，返回0
  }
}
export function delayExecution(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}


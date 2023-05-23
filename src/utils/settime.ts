export function formatDate(time: number) {
  //   const newTime = `${time}`.length == 13 ? time : time;
  const date = new Date(time);
  const Y = date.getFullYear();
  const M = (date.getMonth() + 1) as number;
  const d = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  return {
    format:
      Y +
      String("-") +
      M.toString().padStart(2, "0") +
      String("-") +
      d.toString().padStart(2, "0") +
      String(" ") +
      h.toString().padStart(2, "0") +
      String(":") +
      m.toString().padStart(2, "0") +
      String(":") +
      s.toString().padStart(2, "0"),
  };
}
export class CountDown {
  timeStamp = 0;
  day: number | string = 0;
  hour: number | string = 0;
  second: number | string = 0;
  min: number | string = 0;

  //获取时间
  getTime(number: number) {
    // 传入时间戳
    this.timeStamp = number - Math.round(new Date().getTime() / 1000); // 传入时间戳减去当前时间戳。 除1000是为了消除毫秒
    this.timeStamp -= 1;
    // 计算 天 时 分 秒
    const tempDay = Math.floor(this.timeStamp / (60 * 60 * 24));
    const tempHour = Math.floor(this.timeStamp / (60 * 60)) - tempDay * 24;
    const tempMin =
      Math.floor(this.timeStamp / 60) - tempDay * 24 * 60 - tempHour * 60;
    const tempSecond =
      this.timeStamp -
      tempDay * 24 * 60 * 60 -
      tempHour * 60 * 60 -
      tempMin * 60;
    // 为了倒计时 个数和双数不影响宽度变化 做数据处理
    this.day = String(tempDay).length === 1 ? tempDay : tempDay;
    this.hour = String(tempHour).length === 1 ? "0" + tempHour : tempHour;
    this.min = String(tempMin).length === 1 ? "0" + tempMin : tempMin;
    this.second =
      String(tempSecond).length === 1 ? "0" + tempSecond : tempSecond;
  }
}

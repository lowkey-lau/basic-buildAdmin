/** ------------------------------------- 日期处理（使用moment-timezone） ------------------------------------- **/
import moment from "moment-timezone";

/**
 * 根据时间戳（秒）获取到指定日期格式的字符串
 * @param { number } date 时间戳（秒）
 * @param { string } type 需要处理的日期格式
 * @returns
 */
export function GetFormatDateBySeconds(date, type = "yyyy-MM-DD HH:mm:ss") {
  return moment.unix(date).format(type);
}

/**
 * 根据时间戳（豪秒）获取到指定日期格式的字符串
 * @param { number } date 时间戳（豪秒）
 * @param { string } type 需要处理的日期格式
 * @returns
 */
export function GetFormatDateByMillSeconds(date, type = "yyyy-MM-DD HH:mm:ss") {
  return moment(date).format(type);
}

/**
 * 根据当前时间，获取前 X 天前的时间
 * @param { number } days 前几天
 * @param { string } type 需要处理的日期格式
 * @returns
 */
export function GetBeforeDate(date, days = 1, type = "yyyy-MM-DD") {
  return moment(date).subtract(days, "days").format(type);
}

/**
 * 根据传入的日期，返回（秒数）时间戳
 * @param { number } date 日期
 * @returns
 */
export function GetTimestampBySeconds(date) {
  return moment(date).unix();
}

/**
 * 获取DatePicker的筛选时间
 * @param { number } diffDays 相距多少时间
 * @param { string } type 需要处理的日期格式
 * @returns
 */
export function GetDatePickerValue(diffDays = 0, type = "yyyy-MM-DD", zoom = "Asia/Shanghai") {
  let now = moment().tz(zoom).format(type);
  let before = GetBeforeDate(now, diffDays, type);
  return [before, now];
}

/**
 * 获取DatePicker的筛选时间（倒推小时）
 * @param { number } diffHours 相距多少时间
 * @param { string } type 需要处理的日期格式
 * @returns
 */
export function GetDatePickerValueByHour(diffHours = 0, type = "yyyy-MM-DD", zoom = "Asia/Shanghai") {
  let now = moment().tz(zoom).format(type);
  let before = moment().subtract(diffHours, "hours").tz(zoom).format(type);
  return [before, now];
}

/**
 * 根据传入的时间戳，根据所需格式返回UTC时间
 * @param { number } timestamp 时间戳
 * @param { string } type 日期格式
 * @returns
 */
export function GetFormatUtcDateBySeconds(timestamp, type = "yyyy-MM-DD HH:mm:ss") {
  return moment.unix(timestamp).utc().format(type);
}

/**
 * 传入时间戳，根据所需时区代号、日期格式返回时间字符串
 * @param { number } timestamp 时间戳
 * @param { string } zoom 时区代号
 * @param { string } type 日期格式
 * @returns
 */
export function GetFormatZoomDateBySeconds(timestamp, zoom = "Asia/Shanghai", type = "yyyy-MM-DD HH:mm:ss") {
  return moment.unix(timestamp).tz(zoom).format(type);
}

/**
 * 传入时间字符串，根据时区代号返回时间戳（秒）
 * @param { string } date 日期
 * @param { string } zoom 时区代号 （默认Asia/Shanghai）
 * @returns
 */
export function GetTimestampByZoom(date, zoom = "Asia/Shanghai") {
  const formatTime = moment(date).format("yyyy-MM-DD HH:mm:ss");
  return moment.tz(formatTime, zoom).unix();
}

/**
 * 传入时间字符串，根据时区代号返回当天最后一秒的时间戳（秒）
 * @param { string } date 日期
 * @param { string } zoom 时区代号 （默认Asia/Shanghai）
 * @returns
 */
export function GetEndTimestampByZoom(date, zoom = "Asia/Shanghai") {
  const formatTime = moment(date).endOf("days").format("yyyy-MM-DD HH:mm:ss");
  return moment.tz(formatTime, zoom).unix();
}

/**
 * 根据传入的日期，返回日期23:59:59秒的时间戳
 * @param { number } date 日期
 * @returns
 */
export function GetEndTimestampBySeconds(date) {
  return moment(date).endOf("days").unix();
}

import { Pipe, PipeTransform } from '@angular/core';
import { Day, WeekDay } from '../models/enum';

@Pipe({
  name: 'detailDate'
})
export class DetailDatePipe implements PipeTransform {
  weekDay: WeekDay[] = [
    WeekDay.Sunday,
    WeekDay.Monday,
    WeekDay.Tuesday,
    WeekDay.Wednesday,
    WeekDay.Thursday,
    WeekDay.Friday,
    WeekDay.Saturday
  ];

  transform(value: any): string | WeekDay {
    const nowDate = new Date();
    const time = Date.parse(value);
    const date = new Date(isNaN(time) ? value : time);
    if (date.toLocaleDateString() == nowDate.toLocaleDateString()) { // 如果是今天
      return Day.TODAY;
    }

    if (isYestday(date)) { // 如果是昨天
      return Day.YESTERDAY;
    }

    if (isSameWeek(date)) { // 如果在本周
      return this.weekDay[date.getDay()];
    }
    // 否则将返回年-月-日
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
  }

}

/**
 * 是否在昨天
 * @param date 
 */
export function isYestday(date: Date): boolean {
  const nowDate = new Date();
  const today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime(); //今天凌晨
  const yestday = new Date(today - 86400000).getTime();
  return date.getTime() < today && yestday <= date.getTime();
}

/**
 * 是否在本周
 * @param date 
 */
export function isSameWeek(date: Date): boolean {
  const nowDate = new Date();
  const inDateStr = date.toLocaleDateString();  // 获取如YYYY/MM/DD的日期
  const nowTime = nowDate.getTime();
  const nowDay = nowDate.getDay();
  for (let i = 0; i < 7; i++) {
    if (inDateStr == (new Date(nowTime + (i - nowDay) * 24 * 3600 * 1000)).toLocaleDateString()) {
      return true;
    }
  }
  return false;
}

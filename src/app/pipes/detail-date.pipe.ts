import { Pipe, PipeTransform } from '@angular/core';
import { Day, WeekDay } from '../common/enum';
import { DateUtil } from '../utils/date.util';

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
      return Day.Today;
    }

    if (DateUtil.isYestday(date)) { // 如果是昨天
      return Day.Yesterday;
    }

    if (DateUtil.isSameWeek(date)) { // 如果在本周
      return this.weekDay[date.getDay()];
    }

    // 否则将返回年-月-日
    return (DateUtil.isThisYear(date) ? '' : date.getFullYear() + '年') + (1 + date.getMonth()) + '月' + date.getDate() + '日';
  }

}

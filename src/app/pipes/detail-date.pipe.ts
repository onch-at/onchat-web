import { Pipe, PipeTransform } from '@angular/core';
import { Day, WeekDay } from '../common/enums';
import { DateUtils } from '../utilities/date.utils';

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

  transform(value: string | number | Date): string | WeekDay {
    const now = new Date();
    const date = new Date(value);

    if (DateUtils.isJust(date)) {
      return '刚刚';
    }

    if (date.toLocaleDateString() === now.toLocaleDateString()) { // 如果是今天
      return Day.Today;
    }

    if (DateUtils.isYesterday(date)) { // 如果是昨天
      return Day.Yesterday;
    }

    if (DateUtils.isSameWeek(date)) { // 如果在本周
      return this.weekDay[date.getDay()];
    }

    // 否则将返回年-月-日
    return (DateUtils.isThisYear(date) ? '' : date.getFullYear() + '年') + (1 + date.getMonth()) + '月' + date.getDate() + '日';
  }

}

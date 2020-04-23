import { Component, Input, OnInit } from '@angular/core';
import { MsgItem } from 'src/app/models/interface.model';

@Component({
  selector: 'app-msg-list',
  templateUrl: './msg-list.component.html',
  styleUrls: ['./msg-list.component.scss'],
})
export class MsgListComponent implements OnInit {
  @Input() data: MsgItem[] = [];
  @Input() userId: number;
  @Input() end: boolean;

  constructor() { }

  ngOnInit() {
    
  }

  /**
   * 用于提升性能
   * 一般情况下，当数组内有变更时，
   * Angular将会对整个DOM树加以重新渲染。
   * 如果加上trackBy方法，Angular将会知道具体的变更元素，
   * 并针对性地对此特定元素进行DOM刷新，提升页面渲染性能。
   */
  trackByFn(index: number, item: MsgItem): number {
    return item.id;
  }


  onPress(e) {
    console.log(e)
  }

  /**
   * 判断是否需要显示时间
   * @param time 当前时间
   * @param otherTime 上一个时间
   */
  canShowTime(time: number, otherTime: number): boolean {
    const date = new Date(time);
    const otherDate = new Date(otherTime);

    if ((date.getTime() - otherDate.getTime()) < 300000) {
      return false;
    }

    return true;
  }

  isSameWeek(inDate){ // inDate 是一个date对象
    let inDateStr = inDate.toLocaleDateString();  // 获取如YYYY/MM/DD的日期
    let nowDate = new Date();
    let nowTime = nowDate.getTime();
    let nowDay = nowDate.getDay();
    for(let i=0;i<7;i++){
       if(inDateStr == ( new Date(nowTime + (i-nowDay)*24*3600*1000) ).toLocaleDateString() ) return true;
    }
    return false;
 }

}

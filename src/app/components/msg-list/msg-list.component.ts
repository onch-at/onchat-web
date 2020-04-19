import { Component, Input, OnInit } from '@angular/core';
import { MsgItem } from 'src/app/models/entity.model';

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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MsgItem } from 'src/app/models/entity.model';
import { Result } from 'src/app/models/result.model';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  userId: number;
  chatroomId: number;
  page: number = 1;
  msgList: MsgItem[] = [];
  end: boolean = false;

  constructor(private onChatService: OnChatService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: { userIdResult: Result<number> }) => {
      this.userId = data.userIdResult.data;
    });

    this.chatroomId = this.route.snapshot.params.id;

    this.loadRecords();
  }

  loadRecords(complete?: CallableFunction) {
    this.onChatService.getRecords(this.chatroomId, this.page++).subscribe((result: Result<MsgItem[]>) => {
      if (result.code === 0) {
        // 倒序排列这步交给CSS，详见msg-list.component.scss
        // result.data.sort((a: MsgItem, b: MsgItem) => {
        //   return a.id - b.id;
        // });

        // result.data.forEach((value: MsgItem, index: number) => {
        //   setTimeout(() => {
        //     this.msgList.unshift(value);
        //   }, index * 250);
        // });
        this.msgList = this.msgList.concat(result.data);
      } else if (result.code === 2) {
        this.end = true;
      }
      complete && complete();
    });
  }

  doRefresh(event: any) {
    this.loadRecords(() => {
      event.target.complete();
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatMemberRole } from 'src/app/common/enum';
import { ChatMember, Chatroom, Result } from 'src/app/models/onchat.model';
import { GlobalDataService } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-chatroom-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  chatroom: Chatroom;
  chatMembers: ChatMember[];
  /** 是否是聊天室主人 */
  isHost: boolean;
  /** 是否是聊天室管理者 */
  isManager: boolean;
  /** 是否是聊天室成员 */
  isMember: boolean;
  showMask: boolean;

  constructor(
    private route: ActivatedRoute,
    public globalDataService: GlobalDataService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { chatroom: Result<Chatroom>, chatMembers: Result<ChatMember[]> }) => {
      this.chatroom = data.chatroom.data;
      const chatMembers = data.chatMembers.data;
      const host = chatMembers.filter(o => o.role === ChatMemberRole.Host);
      const managers = chatMembers.filter(o => o.role === ChatMemberRole.Manage);
      const normalMembers = chatMembers.filter(o => o.role === ChatMemberRole.Normal);
      // 按照群主>管理员>普通成员排列
      this.chatMembers = [...host, ...managers, ...normalMembers].splice(0, 6);

      // 从群成员里面找自己
      const member = chatMembers.find(o => o.userId === this.globalDataService.user.id);

      this.isMember = !!member;

      if (member) {
        this.isHost = member.role === ChatMemberRole.Host;
        this.isManager = member.role === ChatMemberRole.Manage;
      }
    });
  }

  onScroll(event: any) {
    this.showMask = event.detail.scrollTop > 175;
  }

  getArr(length: number) {
    return new Array(length).fill('');
  }

}

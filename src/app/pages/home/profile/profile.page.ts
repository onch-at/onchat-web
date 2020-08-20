import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {

  constructor(
    public onChatService: OnChatService,
    private router: Router,
    private overlayService: OverlayService,
    private socketService: SocketService,
  ) { }

  ngOnInit() { }

  logout() {
    this.overlayService.presentMsgAlert('退出登录', ' 你确定要退出登录吗？', () => {
      this.doLogout();
    });
  }

  /**
   * 退出登录
   */
  doLogout() {
    this.onChatService.logout().subscribe(() => {
      this.onChatService.user = null;
      this.onChatService.chatList = [];
      this.onChatService.receiveFriendRequests = [];
      this.onChatService.sendFriendRequests = [];
      this.socketService.unload();

      this.router.navigate(['/user/login']);
    });
  }

}

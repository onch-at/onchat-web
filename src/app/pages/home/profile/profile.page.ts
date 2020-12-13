import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataService } from 'src/app/services/global-data.service';
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
    private router: Router,
    public globalDataService: GlobalDataService,
    private onChatService: OnChatService,
    private overlayService: OverlayService,
    private socketService: SocketService,
  ) { }

  ngOnInit() { }

  navigateToAvatarPage(event: any) {
    event.stopPropagation();
    this.router.navigate(['/user/avatar', this.globalDataService.user.id]);
  }

  logout() {
    this.overlayService.presentAlert({
      header: '退出登录',
      message: ' 你确定要退出登录吗？',
      confirmHandler: () => this.onChatService.logout().subscribe(() => {
        this.globalDataService.user = null;
        this.globalDataService.chatList = [];
        this.globalDataService.chatListPage = 1;
        this.globalDataService.receiveFriendRequests = [];
        this.globalDataService.sendFriendRequests = [];
        this.globalDataService.privateChatrooms = [];
        this.globalDataService.privateChatroomsPage = 1;

        this.socketService.unload();

        this.router.navigate(['/user/login']);
      })
    });
  }

}

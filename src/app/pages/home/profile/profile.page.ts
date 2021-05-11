import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage {

  constructor(
    public globalData: GlobalData,
    private router: Router,
    private apiService: ApiService,
    private overlay: Overlay,
    private socketService: SocketService,
  ) { }

  logout() {
    this.overlay.presentAlert({
      header: '退出登录',
      message: ' 你确定要退出登录吗？',
      confirmHandler: () => this.apiService.logout().subscribe(() => {
        this.router.navigateByUrl('/user/login');
        this.globalData.reset();
        this.socketService.unload();
      })
    });
  }

  viewAvatar(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/user/avatar', this.globalData.user.id]);
  }

}

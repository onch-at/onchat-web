import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/apis/auth.service';
import { Application } from 'src/app/services/app.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage {

  constructor(
    public globalData: GlobalData,
    private app: Application,
    private router: Router,
    private overlay: Overlay,
    private authService: AuthService,
  ) { }

  logout() {
    this.overlay.alert({
      header: '退出登录',
      message: ' 你确定要退出登录吗？',
      confirmHandler: () => this.authService.logout().subscribe(() => {
        this.app.logout();
      })
    });
  }

  viewAvatar(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/user/avatar', this.globalData.user.id]);
  }

}

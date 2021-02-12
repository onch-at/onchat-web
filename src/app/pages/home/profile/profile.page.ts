import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {

  constructor(
    public globalData: GlobalData,
    private router: Router,
    private apiService: ApiService,
    private overlayService: OverlayService,
    private socketService: SocketService,
  ) { }

  ngOnInit() { }

  navigateToAvatarPage(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/user/avatar', this.globalData.user.id]);
  }

  logout() {
    this.overlayService.presentAlert({
      header: '退出登录',
      message: ' 你确定要退出登录吗？',
      confirmHandler: () => this.apiService.logout().subscribe(() => {
        this.router.navigateByUrl('/user/login');
        this.globalData.reset();
        this.socketService.unload();
      })
    });
  }

}

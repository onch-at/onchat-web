import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { OnChatService } from 'src/app/services/onchat.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private onChatService: OnChatService,
    private router: Router,
    private alertController: AlertController,
    private socketService: SocketService,
  ) { }

  ngOnInit() {
  }

  async presentAlertLogoutConfirm() {
    return this.presentAlertConfirm('退出登录', ' 你确定要退出登录吗？', () => {
      this.logout();
    });
  }

  async presentAlertConfirm(header: string, msg: string, confirmHandler: CallableFunction, cancelHandler?: CallableFunction) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [
        {
          text: '取消',
          handler: () => { cancelHandler && cancelHandler(); }
        }, {
          text: '确定',
          handler: () => { confirmHandler(); }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.onChatService.logout().subscribe(() => {
      this.onChatService.isLogin = false;
      this.onChatService.userId = null;
      this.onChatService.chatList = [];
      this.onChatService.friendRequests = [];
      this.socketService.unload();
      this.router.navigate(['/login']);
    });
  }

}

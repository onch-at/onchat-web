import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { SocketService } from 'src/app/services/socket.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private onChatService: OnChatService,
    private localStorageService: LocalStorageService,
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
      this.socketService.unload();
      this.localStorageService.remove(env.chatListKey);
      this.router.navigate(['/login']);
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private onChatService: OnChatService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  async presentAlertLogoutConfirm() {
    return this.presentAlertConfirm('退出登录', ' 你确定要退出登录吗？', () => {
      this.logout();
    });
  }

  async presentAlertConfirm(header: string, msg: string, confirmHandler: Function, cancelHandler?: Function) {
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
      this.router.navigate(['/login']);
    });
  }

}

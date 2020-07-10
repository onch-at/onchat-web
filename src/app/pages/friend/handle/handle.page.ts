import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { FriendRequest, Result, User } from 'src/app/models/onchat.model';
import { OnChatService } from 'src/app/services/onchat.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-handle',
  templateUrl: './handle.page.html',
  styleUrls: ['./handle.page.scss'],
})
export class HandlePage implements OnInit {
  /** 用户 */
  user: User;
  friendRequest: FriendRequest;
  text = ''

  constructor(
    public onChatService: OnChatService,
    private sessionStorageService: SessionStorageService,
    private socketService: SocketService,
    private toastController: ToastController,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { user: Result<User> | User, friendRequest: Result<FriendRequest> }) => {
      if ((data.user as User).id) {
        this.user = data.user as User;
      } else if ((data.user as Result<User>).code == 0) {
        this.user = (data.user as Result<User>).data;
        this.sessionStorageService.setUser(this.user);
      }

      if (data.friendRequest.code != 0) {
        this.presentToast(data.friendRequest.msg);
        return this.router.navigate(['/']);
      }

      this.friendRequest = data.friendRequest.data;
    });
  }

  agree() {
    this.presentAlertWithInput('同意申请', [
      {
        name: 'selfAlias',
        type: 'text',
        placeholder: '顺便给对方起个好听的别名吧',
        cssClass: 'ipt-primary',
        value: this.text,
        attributes: {
          maxlength: 30
        }
      }
    ], (data: { [key: string]: any }) => {
      this.socketService.friendRequestAgree(this.friendRequest.id, data.selfAlias);
    });
  }

  reject() {
    this.presentAlertWithInput('拒绝申请', [
      {
        type: 'textarea',
        placeholder: '或许可以告诉对方你拒绝的原因',
        cssClass: 'ipt-primary',
        attributes: {
          rows: 4,
          maxlength: 50
        }
      }
    ], () => {

    });
  }

  async presentAlertWithInput(header: string, inputs: any[], confirmHandler: CallableFunction, cancelHandler?: CallableFunction) {
    const alert = await this.alertController.create({
      header,
      inputs,
      buttons: [
        {
          text: '取消',
          handler: () => { cancelHandler && cancelHandler(); }
        }, {
          text: '确认',
          handler: (data: { [key: string]: any }) => confirmHandler(data)
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: ' ' + message,
      duration: 2000,
      color: 'dark',
    });
    toast.present();
  }

}

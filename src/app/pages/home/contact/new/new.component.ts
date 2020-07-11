import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { OnChatService } from 'src/app/services/onchat.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {

  constructor(
    public onChatService: OnChatService,
    private socketService: SocketService,
    private alertController: AlertController,
  ) { }

  ngOnInit() { }

  friendRequestAgree(friendRequestId: number, event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.presentAlertWithInput('同意申请', [
      {
        name: 'selfAlias',
        type: 'text',
        placeholder: '顺便给对方起个好听的别名吧',
        cssClass: 'ipt-primary',
        attributes: {
          maxlength: 30
        }
      }
    ], (data: KeyValue<string, any>) => {
      this.socketService.friendRequestAgree(friendRequestId, data['selfAlias'] || null);
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
          handler: (data: KeyValue<string, any>) => confirmHandler(data)
        }
      ]
    });

    await alert.present();
  }

}

import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { SocketEvent } from './common/enum';
import { MsgItem } from './models/entity.model';
import { Result } from './models/interface.model';
import { AudioService } from './services/audio.service';
import { OnChatService } from './services/onchat.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private socketService: SocketService,
    private onChatService: OnChatService,
    private audioService: AudioService,
    private toastController: ToastController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.socketService.on(SocketEvent.Connect).subscribe(() => {
      if (this.onChatService.isLogin == null) {
        this.onChatService.checkLogin().subscribe((result: Result<boolean>) => {
          this.onChatService.isLogin = result.data;
          if (result.data) {
            this.socketService.init();
            this.onChatService.init();
          }
        });
      } else if (this.onChatService.isLogin) {
        this.onChatService.init();
        this.socketService.init();
      }
    });

    this.socketService.on(SocketEvent.Init).subscribe((o) => {
      console.log(o)
    });

    this.socketService.on(SocketEvent.Message).subscribe((o: Result<MsgItem>) => {
      console.log(o)
      // 如果消息不是自己的话，就播放提示音
      o.data.userId != this.onChatService.userId && this.audioService.msg.play();
    });

    this.socketService.on(SocketEvent.Disconnect).subscribe(() => {
      this.presentToast('与服务器断开连接！');
    });

    this.socketService.on(SocketEvent.Reconnect).subscribe(() => {
      this.onChatService.checkLogin().subscribe((result: Result<boolean>) => {
        this.onChatService.isLogin = result.data;
        if (result.data) {
          this.socketService.init();
          this.onChatService.init();
        }
      });
      this.presentToast('与服务器重连成功！');
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }
}

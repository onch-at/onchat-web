import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { SocketEvent } from './common/enum';
import { Result } from './models/result.model';
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
      this.onChatService.checkLogin().subscribe((result: Result<boolean>) => {
        this.onChatService.isLogin = result.data;
        result.data && this.socketService.init();
      });
    });

    this.socketService.on(SocketEvent.Init).subscribe((o) => {
      console.log(o)
    });

    this.socketService.on(SocketEvent.Message).subscribe((o) => {
      this.presentToast(o as string);
    });

    this.socketService.on(SocketEvent.Disconnect).subscribe(() => {
      this.presentToast('与服务器断开连接！');
    });

    this.socketService.on(SocketEvent.Reconnect).subscribe(() => {
      this.onChatService.checkLogin().subscribe((result: Result<boolean>) => {
        this.onChatService.isLogin = result.data;
        result.data && this.socketService.init();
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

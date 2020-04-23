import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { SocketEvent } from './common/enum';
import { ChatItem, MsgItem, Result } from './models/interface.model';
import { FeedbackService } from './services/feedback.service';
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
    private feedbackService: FeedbackService,
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
      o.data.userId != this.onChatService.userId && this.feedbackService.msgAudio.play();

      let unpresence = true; // 收到的消息所属房间是否存在于列表当中(默认不存在)
      // 然后去列表里面找
      for (const chatItem of this.onChatService.chatList) {
        if (chatItem.chatroomId == o.data.chatroomId) { // 如果存在
          if (this.onChatService.chatroomId == o.data.chatroomId) { // 如果用户已经进入消息所属房间
            chatItem.unread = 0;
          } else {
            chatItem.unread++;
          }
          chatItem.latestMsg = o.data;
          chatItem.updateTime = +new Date() / 1000;
          this.onChatService.chatList = this.onChatService.chatList;
          unpresence = false;
          break;
        }
      }

      // 如果不存在于列表当中，就刷新数据
      unpresence && this.onChatService.getChatList().subscribe((result: Result<ChatItem[]>) => {
        this.onChatService.chatList = result.data;
      });
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

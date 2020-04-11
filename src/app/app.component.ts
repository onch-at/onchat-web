import { Component, HostListener, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { SocketEvent } from './common/enum';
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
    private cookieService: CookieService,
    private socketService: SocketService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  send() {
    this.socketService.join(this.cookieService.get("PHPSESSID"), String(1));
  }

  ngOnInit() {
    this.socketService.on(SocketEvent.Connect).subscribe(() => {
      this.socketService.init(this.cookieService.get("PHPSESSID"));
      console.log('ok')
    });

    this.socketService.on(SocketEvent.Init).subscribe((o) => {
      console.log(o)
    });
  }

  @HostListener('window:beforeunload')
  onBeforeUnload() {
    this.socketService.unload(this.cookieService.get("PHPSESSID"));
  }
}

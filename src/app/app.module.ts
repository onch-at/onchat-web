import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeZhHans from '@angular/common/locales/zh-Hans';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { SocketIoModule } from 'ngx-socket-io';
import { environment as env, environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PopoverComponent } from './components/popover/popover.component';
import { LocalStorageService } from './services/local-storage.service';
import { OnChatService } from './services/onchat.service';

registerLocaleData(localeZhHans);

@NgModule({
  declarations: [AppComponent, PopoverComponent],
  entryComponents: [
    PopoverComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({
      mode: 'ios',
      backButtonText: '',
      backButtonIcon: 'chevron-back-outline'
    }),
    SocketIoModule.forRoot({
      url: env.socketUrl,
      options: {
        transports: ['websocket'] // 只使用WebSocket连接
      }
    }),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'zh-Hans' },
    StatusBar,
    SplashScreen,
    OnChatService,
    LocalStorageService,
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

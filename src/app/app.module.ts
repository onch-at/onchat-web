import { OverlayModule } from '@angular/cdk/overlay';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeExtraZhHans from '@angular/common/locales/extra/zh-Hans';
import localeZhHans from '@angular/common/locales/zh-Hans';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RtcComponent } from './components/modals/rtc/rtc.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ActiveClassModule } from './directives/active-class/active-class.module';
import { RippleModule } from './directives/ripple/ripple.module';
import { GlobalErrorHandler } from './handlers/global-error.handler';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { BaseInterceptor } from './interceptors/base.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { SharedModule } from './modules/shared.module';

registerLocaleData(localeZhHans, 'zh-Hans', localeExtraZhHans);

@NgModule({
  declarations: [
    AppComponent,
    RtcComponent,
    NotificationComponent,
  ],
  imports: [
    RippleModule,
    SharedModule,
    ActiveClassModule,
    OverlayModule,
    BrowserAnimationsModule,
    BrowserModule,
    HammerModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    IonicModule.forRoot({
      mode: 'ios',
      backButtonText: '',
      backButtonIcon: 'chevron-back-outline'
    }),
    SocketIoModule.forRoot({
      url: '',
      options: {
        path: environment.socketioPath,
        autoConnect: false,
        transports: ['websocket'] // 只使用WebSocket连接
      }
    }),
    QuillModule.forRoot({
      placeholder: '在此处插入文字…'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh-Hans' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BaseInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
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
import { environment as env } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationComponent } from './components/notification/notification.component';
import { GlobalErrorHandler } from './handlers/global-error.handler';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { ActiveClassModule } from './modules/active-class.module';
import { ScrollbarModule } from './modules/scrollbar.module';
import { SharedModule } from './modules/shared.module';

registerLocaleData(localeZhHans, 'zh-Hans', localeExtraZhHans);

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent
  ],
  imports: [
    SharedModule,
    ActiveClassModule,
    ScrollbarModule,
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
      url: env.socketUrl,
      options: {
        path: env.socketPath,
        transports: ['websocket'] // 只使用WebSocket连接
      }
    }),
    QuillModule.forRoot({
      placeholder: '在此处插入文字…'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: env.production,
      registrationStrategy: 'registerImmediately'
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh-Hans' },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
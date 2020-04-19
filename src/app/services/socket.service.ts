import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { SocketEvent } from '../common/enum';
import { Message } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  isInit: boolean = false;

  constructor(
    private socket: Socket,
    private cookieService: CookieService,
  ) { }

  init() {
    this.emit(SocketEvent.Init, { sessId: this.cookieService.get('PHPSESSID') });
  }

  unload() {
    this.emit(SocketEvent.Unload, { sessId: this.cookieService.get('PHPSESSID') });
  }

  message(msg: Message) {
    this.emit(SocketEvent.Message, {
      sessId: this.cookieService.get('PHPSESSID'),
      msg: msg
    });
  }

  join(sessId: string, chatroomId: string) {
    this.emit(SocketEvent.UserJoin, {
      sessId: sessId,
      chatroomId: chatroomId
    });
  }

  emit(eventName: string, data?: any, callback?: CallableFunction) {
    return this.socket.emit(eventName, data, callback);
  }

  on(eventName: string): Observable<unknown> {
    return this.socket.fromEvent(eventName);
  }

  disconnect() {
    return this.socket.disconnect();
  }

}

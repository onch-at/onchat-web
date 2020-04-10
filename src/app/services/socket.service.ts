import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { SocketEvent } from '../models/enum';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  join(sessid: string, chatroomId: string) {
    this.emit(SocketEvent.UserJoin, {
      sessId: sessid,
      chatroomId: chatroomId
    });
  }

  emit(eventName: string, data?: any, callback?: CallableFunction) {
    return this.socket.emit(eventName, data, callback);
  }

  on(eventName: string): Observable<unknown> {
    return this.socket.fromEvent(eventName);
  }

}

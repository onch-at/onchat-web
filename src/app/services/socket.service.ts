import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { SocketEvent } from '../common/enum';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  init(sessId: string) {
    this.emit(SocketEvent.Init, { sessId: sessId });
  }

  unload(sessId: string) {
    this.emit(SocketEvent.Unload, { sessId: sessId });
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

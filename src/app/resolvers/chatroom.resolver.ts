import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatMember, Chatroom, Result } from '../models/onchat.model';
import { ChatroomService } from '../services/apis/chatroom.service';

/**
 * 聊天室Resolve，根据路由参数中的chatroomId来获得chatroom
 */
@Injectable({
  providedIn: 'root',
})
export class ChatroomResolve implements Resolve<Result<Chatroom>> {
  constructor(private chatroomService: ChatroomService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<Chatroom>> {
    const chatroomId = +route.params.chatroomId;

    return this.chatroomService.getChatroom(chatroomId);
  }
}

/**
 * 群聊成员Resolve，根据路由参数中的chatroomId来获得群聊成员
 */
@Injectable({
  providedIn: 'root',
})
export class ChatMembersResolve implements Resolve<Result<ChatMember[]>> {
  constructor(private chatroomService: ChatroomService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<ChatMember[]>> {
    const chatroomId = +route.params.chatroomId;

    return this.chatroomService.getChatMembers(chatroomId);
  }
}
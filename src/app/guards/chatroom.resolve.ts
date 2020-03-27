import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Chatroom } from '../models/entity.model';
import { Result } from '../models/result.model';
import { OnChatService } from '../services/onchat.service';

@Injectable({
    providedIn: 'root',
})
export class ChatroomResolve implements Resolve<Result<Chatroom[]>> {
    constructor(private onChatService: OnChatService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<Chatroom[]>> {
        return this.onChatService.chatrooms();
    }
}

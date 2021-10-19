import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FriendRequest, Result } from 'src/app/models/onchat.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(private http: HttpClient) { }

  /**
   * 获取我的收到好友申请
   */
  getReceiveRequests(): Observable<Result<FriendRequest[]>> {
    return this.http.get<Result<FriendRequest[]>>(environment.friendCtx + '/requests/receive');
  }

  /**
   * 获取我的发起的好友申请（不包含已经同意的）
   */
  getSendRequests(): Observable<Result<FriendRequest[]>> {
    return this.http.get<Result<FriendRequest[]>>(environment.friendCtx + '/requests/send');
  }

  /**
   * 根据被申请人的UID来获取FriendRequest
   * @param targetId 被申请人的ID
   */
  getRequestByTargetId(targetId: number): Observable<Result<FriendRequest>> {
    return this.http.get<Result<FriendRequest>>(environment.friendCtx + '/request/target/' + targetId);
  }

  /**
   * 根据申请人的UID来获取FriendRequest
   * @param requesterId 申请人的UID
   */
  getRequestByRequesterId(requesterId: number): Observable<Result<FriendRequest>> {
    return this.http.get<Result<FriendRequest>>(environment.friendCtx + '/request/requester/' + requesterId);
  }

  /**
   * 根据ID来获取FriendRequest
   * @param id FriendRequest Id
   */
  getRequestById(id: number): Observable<Result<FriendRequest>> {
    return this.http.get<Result<FriendRequest>>(environment.friendCtx + '/request/' + id);
  }

  /**
   * 设置好友别名
   * @param chatroomId 私聊聊天室ID
   * @param alias 别名
   */
  setAlias(chatroomId: number, alias: string): Observable<Result> {
    return this.http.put<Result>(environment.friendCtx + '/alias/' + chatroomId, { alias });
  }

  /**
   * 判断自己跟对方是否为好友关系
   * 如果是好友关系，则返回私聊房间号；否则返回零
   * @param targetId 对方UserId
   */
  isFriend(targetId: number): Observable<Result<number>> {
    return this.http.get<Result<number>>(`${environment.friendCtx}/${targetId}/isfriend`);
  }

  /**
   * 已读收到的所有好友请求
   * @param id 好友请求ID
   */
  readedReceiveRequest(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.friendCtx}/request/receive/readed/${id}`, null);
  }

  /**
   * 已读发送的所有好友请求
   * @param id 好友请求ID
   */
  readedSendRequest(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.friendCtx}/request/send/readed/${id}`, null);
  }
}

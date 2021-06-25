import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvatarData } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { ChatMember, Chatroom, Result } from 'src/app/models/onchat.model';
import { environment } from '../../../environments/environment';
import { CacheService } from '../cache.service';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  /**
   * 获取聊天室
   * @param id 聊天室ID
   */
  getChatroom(id: number): Observable<Result<Chatroom>> {
    return this.http.get<Result<Chatroom>>(environment.chatroomUrl + id, { headers: this.cacheService.cacheHeader(600000) });
  }

  /**
   * 获取聊天室名称
   * @param id 聊天室ID
   */
  getName(id: number): Observable<Result<string>> {
    return this.http.get<Result<string>>(environment.chatroomUrl + id + '/name');
  }

  /**
   * 获取群聊成员
   * @param id 聊天室ID
   */
  getChatMembers(id: number): Observable<Result<ChatMember[]>> {
    return this.http.get<Result<ChatMember[]>>(environment.chatroomUrl + id + '/members', { headers: this.cacheService.cacheHeader(600000) });
  }

  /**
   * 上传聊天室头像
   * @param id 聊天室ID
   * @param avatar 头像
   */
  avatar(id: number, avatar: Blob): Observable<Result<AvatarData>> {
    const formData: FormData = new FormData();
    formData.append('image', avatar);

    return this.http.post<Result<AvatarData>>(environment.chatroomUrl + id + '/avatar', formData);
  }

  /**
   * 设置聊天室名称
   * @param id 聊天室ID
   * @param name 名称
   */
  setName(id: number, name: string): Observable<Result> {
    return this.http.put<Result>(`${environment.chatroomUrl}${id}/name`, { name });
  }

  /**
   * 设置我在聊天室中的昵称
   * @param id 聊天室ID
   * @param nickname 昵称
   */
  setMemberNickname(id: number, nickname: string): Observable<Result<string>> {
    return this.http.put<Result<string>>(`${environment.chatroomUrl}${id}/member/nickname`, { nickname });
  }

  /**
   * 搜索聊天室
   * @param keyword
   * @param page
   */
  search(keyword: string, page: number) {
    return this.http.post<Result<Chatroom[]>>(`${environment.chatroomUrl}search`, { keyword, page: page.toString() });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvatarData } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { ChangePassword, Login, Register, ResetPassword, UserInfo } from 'src/app/models/form.model';
import { ChatSession, Result, User } from 'src/app/models/onchat.model';
import { environment } from 'src/environments/environment';
import { CacheService } from '../cache.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  /**
   * 登录
   * @param o
   */
  login(o: Login): Observable<Result<User>> {
    return this.http.post<Result<User>>(environment.userUrl + 'login', o);
  }

  /**
   * 登出
   */
  logout(): Observable<null> {
    return this.http.get<null>(environment.userUrl + 'logout');
  }

  /**
   * 检测是否已经登录
   * 成功登录,则返回User；否则返回false
   */
  checkLogin(): Observable<Result<false | User>> {
    return this.http.get<Result<false | User>>(environment.userUrl + 'checklogin', { headers: this.cacheService.cacheHeader(3000) });
  }

  /**
   * 检测邮箱是否可用
   * @param email 邮箱
   */
  checkEmail(email: string): Observable<Result<boolean>> {
    return this.http.get<Result<boolean>>(environment.userUrl + 'checkemail', {
      params: { email },
      headers: this.cacheService.cacheHeader(5000)
    });
  }

  /**
   * 注册
   * @param o
   */
  register(o: Register): Observable<Result<User>> {
    return this.http.post<Result<User>>(environment.userUrl + 'register', o);
  }

  /**
   * 修改密码
   * @param o
   */
  changePassword(o: ChangePassword): Observable<Result> {
    return this.http.put<Result>(environment.userUrl + 'password', o);
  }

  /**
   * 通过用户名发送邮件
   * @param username 用户名
   */
  sendEmailCaptchaByUsername(username: string): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(environment.userUrl + 'emailcaptcha', { username });
  }

  /**
   * 重置密码
   * @param o
   */
  resetPassword(o: ResetPassword): Observable<Result> {
    return this.http.put<Result>(environment.userUrl + 'password/reset', o);
  }

  /**
   * 上传用户头像
   * @param avatar 头像
   */
  avatar(avatar: Blob): Observable<Result<AvatarData>> {
    const formData: FormData = new FormData();
    formData.append('image', avatar);

    return this.http.post<Result<AvatarData>>(environment.userUrl + 'avatar', formData);
  }

  /**
   * 保存用户信息
   * @param userInfo
   */
  saveUserInfo(userInfo: UserInfo): Observable<Result<UserInfo>> {
    return this.http.put<Result<UserInfo>>(environment.userUrl + 'info', userInfo);
  }

  /**
   * 绑定电子邮箱
   * @param email 邮箱
   * @param captcha 验证码
   */
  bindEmail(email: string, captcha: string): Observable<Result<string>> {
    return this.http.put<Result<string>>(environment.userUrl + 'bindemail', { email, captcha });
  }

  /**
   * 通过用户ID获取用户
   * @param userId 用户ID
   */
  getUser(userId: number): Observable<Result<User>> {
    return this.http.get<Result<User>>(environment.userUrl + userId, { headers: this.cacheService.cacheHeader(600000) });
  }

  /**
   * 获取用户的聊天列表
   */
  getChatSession(): Observable<Result<ChatSession[]>> {
    return this.http.get<Result<ChatSession[]>>(environment.userUrl + 'chatsession');
  }

  /**
   * 获取私聊聊天室列表
   */
  getPrivateChatrooms(): Observable<Result<ChatSession[]>> {
    return this.http.get<Result<ChatSession[]>>(environment.userUrl + 'chatrooms/private');
  }

  /**
   * 获取群聊聊天室列表
   */
  getGroupChatrooms(): Observable<Result<ChatSession[]>> {
    return this.http.get<Result<ChatSession[]>>(environment.userUrl + 'chatrooms/group');
  }

  /**
   * 置顶聊天列表子项
   * @param id 聊天列表子项ID
   */
  stickyChatSession(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.userUrl}chatsession/sticky/${id}`, null);
  }

  /**
   * 取消置顶聊天列表子项
   * @param id 聊天列表子项ID
   */
  unstickyChatSession(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.userUrl}chatsession/unsticky/${id}`, null);
  }

  /**
   * 将聊天列表子项设为已读
   * @param id 聊天列表子项ID
   */
  readedChatSession(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.userUrl}chatsession/readed/${id}`, null);
  }

  /**
   * 将聊天列表子项设为未读
   * @param id 聊天列表子项ID
   */
  unreadChatSession(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.userUrl}chatsession/unread/${id}`, null);
  }

  /**
   * 搜索用户
   * @param keyword
   * @param page
   */
  search(keyword: string, page: number) {
    return this.http.post<Result<User[]>>(`${environment.userUrl}search`, { keyword, page: page.toString() });
  }
}

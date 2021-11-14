import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AvatarData } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { ChangePassword, Login, Register, ResetPassword, UserInfo } from 'src/app/models/form.model';
import { ChatSession, Result, TokenFolder, User } from 'src/app/models/onchat.model';
import { environment } from 'src/environments/environment';
import { HTTP_CACHE_TOKEN } from '../cache.service';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) { }

  /**
   * 登录
   * @param o
   */
  login(o: Login): Observable<Result<User & TokenFolder>> {
    return this.http.post<Result<User & TokenFolder>>(environment.userCtx + '/login', o).pipe(
      tap(({ data }: Result<User & TokenFolder>) => (
        this.tokenService.store(data.access, data.refresh)
      ))
    );
  }

  /**
   * 注册
   * @param o
   */
  register(o: Register): Observable<Result<User & TokenFolder>> {
    return this.http.post<Result<User & TokenFolder>>(environment.userCtx + '/register', o).pipe(
      tap(({ data }: Result<User & TokenFolder>) => (
        this.tokenService.store(data.access, data.refresh)
      ))
    );
  }

  /**
   * 修改密码
   * @param o
   */
  changePassword(o: ChangePassword): Observable<Result> {
    return this.http.put<Result>(environment.userCtx + '/password', o);
  }

  /**
   * 通过用户名发送邮件
   * @param username 用户名
   */
  sendEmailCaptchaByUsername(username: string): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(environment.userCtx + '/emailcaptcha', { username });
  }

  /**
   * 重置密码
   * @param o
   */
  resetPassword(o: ResetPassword): Observable<Result> {
    return this.http.put<Result>(environment.userCtx + '/password/reset', o);
  }

  /**
   * 上传用户头像
   * @param avatar 头像
   */
  avatar(avatar: File): Observable<Result<AvatarData>> {
    const formData: FormData = new FormData();
    formData.append('image', avatar);

    return this.http.post<Result<AvatarData>>(environment.userCtx + '/avatar', formData);
  }

  /**
   * 保存用户信息
   * @param userInfo
   */
  saveUserInfo(userInfo: UserInfo): Observable<Result<UserInfo>> {
    return this.http.put<Result<UserInfo>>(environment.userCtx + '/info', userInfo);
  }

  /**
   * 绑定电子邮箱
   * @param email 邮箱
   * @param captcha 验证码
   */
  bindEmail(email: string, captcha: string): Observable<Result<string>> {
    return this.http.put<Result<string>>(environment.userCtx + '/bindemail', { email, captcha });
  }

  /**
   * 通过用户ID获取用户
   * @param userId 用户ID
   */
  getUser(userId: number): Observable<Result<User>> {
    return this.http.get<Result<User>>(`${environment.userCtx}/${userId}`, {
      context: new HttpContext().set(HTTP_CACHE_TOKEN, 600000)
    });
  }

  /**
   * 获取私聊聊天室列表
   */
  getPrivateChatrooms(): Observable<Result<ChatSession[]>> {
    return this.http.get<Result<ChatSession[]>>(environment.userCtx + '/chatrooms/private');
  }

  /**
   * 获取群聊聊天室列表
   */
  getGroupChatrooms(): Observable<Result<ChatSession[]>> {
    return this.http.get<Result<ChatSession[]>>(environment.userCtx + '/chatrooms/group');
  }

  /**
   * 搜索用户
   * @param keyword
   * @param page
   */
  search(keyword: string, page: number) {
    return this.http.post<Result<User[]>>(`${environment.userCtx}/search`, { keyword, page: page.toString() });
  }
}

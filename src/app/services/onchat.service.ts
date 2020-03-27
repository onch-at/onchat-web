import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { Chatroom } from '../models/entity.model';
import { LoginForm, RegisterForm } from '../models/form.model';
import { Result } from '../models/result.model';

const HTTP_OPTIONS_JSON = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

const HTTP_OPTIONS_FORM = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class OnChatService {
  /** 存储URL，以便在登录后可以重定向 */
  redirectUrl: string;

  constructor(private http: HttpClient) { }

  getUsernameByUid(uid: number) {
    return this.http.get('/api/php/history.php?history=' + uid, HTTP_OPTIONS_JSON);
  }

  /**
   * 登录
   * @param o 
   */
  login(o: LoginForm): Observable<Result<any>> {
    return this.http.post<Result<any>>(env.userLoginUrl, o, HTTP_OPTIONS_JSON);
  }

  /**
   * 登出
   */
  logout(): Observable<any> {
    return this.http.get<any>(env.userLogoutUrl);
  }

  /**
   * 检测是否已经登录
   */
  checkLogin(): Observable<Result<boolean>> {
    return this.http.get<Result<boolean>>(env.userCheckLoginUrl);
  }

  /**
   * 注册
   * @param o 
   */
  register(o: RegisterForm): Observable<Result<any>>  {
    return this.http.post<Result<any>>(env.userRegisterUrl, o, HTTP_OPTIONS_JSON);
  }

  chatrooms() {
    return this.http.get<Result<Chatroom[]>>(env.userChatroomsUrl);
  }
}

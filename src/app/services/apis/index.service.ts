import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/models/onchat.model';
import { environment } from 'src/environments/environment';
import { CacheService } from '../cache.service';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  /**
   * 发送邮箱验证码
   * @param email 邮箱
   */
  sendEmailCaptcha(email: string): Observable<Result> {
    return this.http.post<Result>(environment.indexUrl + 'emailcaptcha', { email });
  }

  /**
   * 检测用户名是否可用
   * @param username 用户名
   */
  checkUsername(username: string): Observable<Result<boolean>> {
    return this.http.get<Result<boolean>>(environment.indexUrl + 'checkusername', {
      params: { username },
      headers: this.cacheService.cacheHeader(5000)
    });
  }

  /**
   * 检测邮箱是否可用
   * @param email 邮箱
   */
  checkEmail(email: string): Observable<Result<boolean>> {
    return this.http.get<Result<boolean>>(environment.indexUrl + 'checkemail', {
      params: { email },
      headers: this.cacheService.cacheHeader(5000)
    });
  }
}

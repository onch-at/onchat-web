import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/models/onchat.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * 发送邮箱验证码
   * @param email 邮箱
   */
  sendEmailCaptcha(email: string): Observable<Result> {
    return this.http.post<Result>(environment.emailCaptchaUrl, { email });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Result, User } from 'src/app/models/onchat.model';
import { environment } from 'src/environments/environment';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) { }

  /**
   * 续签访问令牌
   * @param token 续签令牌
   */
  refresh(token: string) {
    return this.http.get<Result<string>>(environment.authUrl + 'refresh', { params: { token } });
  }

  /**
   * 获取令牌的用户信息
   */
  info() {
    return this.http.get<Result<User>>(environment.authUrl + 'info');
  }

  /**
   * 登出
   */
  logout(): Observable<null> {
    return this.http.get<null>(environment.authUrl + 'logout').pipe(
      finalize(() => this.tokenService.clear())
    );
  }
}

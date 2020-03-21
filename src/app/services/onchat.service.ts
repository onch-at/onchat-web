import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginForm } from '../models/form.model';
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

  constructor(private http: HttpClient) { }

  getUsernameByUid(uid: number) {
    return this.http.get('/api/php/history.php?history=' + uid, HTTP_OPTIONS_JSON);
  }

  login(o: LoginForm) {
    return this.http.post<Result<any>>('/api/User/login', o, HTTP_OPTIONS_JSON);
  }

  register() {

  }
}

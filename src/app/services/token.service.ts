import { Injectable } from '@angular/core';
import { LocalStorageKey } from '../common/enum';
import { TokenFolder, TokenPayload } from '../models/onchat.model';
import { LocalStorage } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  folder: TokenFolder;

  constructor(private localStorage: LocalStorage) {
    this.folder = this.localStorage.get<TokenFolder>(LocalStorageKey.TokenFolder, {
      access: null,
      refresh: null
    });
  }

  /**
   * 存储令牌
   * @param access
   * @param refresh
   */
  store(access: string, refresh?: string) {
    this.folder.access = access;

    if (refresh) {
      this.folder.refresh = refresh;
    }

    this.localStorage.set<TokenFolder>(LocalStorageKey.TokenFolder, this.folder);
  }

  parse(jwt: string): TokenPayload {
    const payload = jwt.split('.')[1];
    return JSON.parse(window.atob(payload)) as TokenPayload;
  }

  clear() {
    this.folder.access = null;
    this.folder.refresh = null;
    this.localStorage.remove(LocalStorageKey.TokenFolder);
  }
}

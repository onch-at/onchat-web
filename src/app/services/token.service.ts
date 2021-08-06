import { Injectable } from '@angular/core';
import { LocalStorageKey } from '../common/enum';
import { TokenFolder } from '../models/onchat.model';
import { LocalStorage } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private localStorage: LocalStorage) { }

  /**
   * 存储令牌
   * @param access
   * @param refresh
   */
  store(access: string, refresh: string) {
    this.localStorage.set<TokenFolder>(LocalStorageKey.TokenFolder, { access, refresh });
  }

  clear() {
    this.localStorage.remove(LocalStorageKey.TokenFolder);
  }

  get(): TokenFolder {
    return this.localStorage.get<TokenFolder>(LocalStorageKey.TokenFolder, {
      access: null,
      refresh: null
    });
  }
}

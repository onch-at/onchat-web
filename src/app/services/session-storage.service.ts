import { Injectable } from '@angular/core';
import { SessionStorageKey } from '../common/enum';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  /**
   * 保存数据
   * @param key 键名
   * @param value 数据
   */
  set(key: SessionStorageKey, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * 获取数据
   * @param key 键名
   */
  get(key: SessionStorageKey): any {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : false;
  }

  /**
   * 移除数据
   * @param key 键名
   */
  remove(key: SessionStorageKey): void {
    sessionStorage.removeItem(key);
  }

  setItemToMap<T = any>(storageKey: SessionStorageKey, key: string | number, value: T): void {
    const map = this.get(storageKey) || {};
    map[key] = value;
    this.set(storageKey, map);
  }

  getItemFromMap<T = any>(storageKey: SessionStorageKey, key: string | number): T {
    const map = this.get(storageKey) || {};
    return map[key];
  }

}

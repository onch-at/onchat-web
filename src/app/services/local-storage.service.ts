import { Injectable } from '@angular/core';
import { LocalStorageKey } from '../common/enum';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * 保存数据
   * @param key 键名
   * @param value 数据
   */
  set(key: LocalStorageKey, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * 获取数据
   * @param key 键名
   */
  get(key: LocalStorageKey): any {
    const data = localStorage.getItem(key);
    if (!data) { return false; }
    return JSON.parse(data);
  }

  /**
   * 移除数据
   * @param key 键名
   */
  remove(key: LocalStorageKey): void {
    localStorage.removeItem(key);
  }

  setItemToMap<T = any>(storageKey: LocalStorageKey, key: string | number, value: T): void {
    const map = this.get(storageKey) || {};
    map[key] = value;
    this.set(storageKey, map);
  }

  getItemFromMap<T = any>(storageKey: LocalStorageKey, key: string | number): T {
    const map = this.get(storageKey) || {};
    return map[key];
  }

  removeItemFromMap(storageKey: LocalStorageKey, key: string | number): void {
    const map = this.get(storageKey) || {};
    delete map[key];
    this.set(storageKey, map);
  }
}

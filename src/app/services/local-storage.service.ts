import { Inject, Injectable } from '@angular/core';
import { LocalStorageKey } from '../common/enums';
import { SafeAny } from '../common/interfaces';
import { STORAGE } from '../common/tokens';

/** 本地存储服务 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorage {

  constructor(
    @Inject(STORAGE) private storage: Storage
  ) { }

  /**
   * 保存数据
   * @param key 键名
   * @param value 数据
   */
  set<T = SafeAny>(key: LocalStorageKey, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  /**
   * 获取数据
   * @param key 键名
   * @param defaults 默认值
   */
  get<T = SafeAny>(key: LocalStorageKey, defaults: T = null): T {
    const data = this.storage.getItem(key);
    return data ? JSON.parse(data) : defaults;
  }

  /**
   * 移除数据
   * @param key 键名
   */
  remove(key: LocalStorageKey): void {
    this.storage.removeItem(key);
  }

  setItemToMap<T = SafeAny>(storageKey: LocalStorageKey, key: string | number, value: T): void {
    const map = this.get(storageKey, {});
    map[key] = value;
    this.set(storageKey, map);
  }

  getItemFromMap<T = SafeAny>(storageKey: LocalStorageKey, key: string | number): T {
    const map = this.get(storageKey, {});
    return map[key];
  }

  removeItemFromMap(storageKey: LocalStorageKey, key: string | number): void {
    const map = this.get(storageKey, {});
    delete map[key];
    this.set(storageKey, map);
  }
}

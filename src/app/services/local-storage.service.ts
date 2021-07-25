import { Inject, Injectable } from '@angular/core';
import { LocalStorageKey } from '../common/enum';
import { SafeAny } from '../common/interface';
import { STORAGE } from '../common/token';

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
  set(key: LocalStorageKey, value: SafeAny): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  /**
   * 获取数据
   * @param key 键名
   * @param defaults 默认值
   */
  get<T = any>(key: LocalStorageKey, defaults: T): T {
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

  setItemToMap<T = any>(storageKey: LocalStorageKey, key: string | number, value: T): void {
    const map = this.get(storageKey, {});
    map[key] = value;
    this.set(storageKey, map);
  }

  getItemFromMap<T = any>(storageKey: LocalStorageKey, key: string | number): T {
    const map = this.get(storageKey, {});
    return map[key];
  }

  removeItemFromMap(storageKey: LocalStorageKey, key: string | number): void {
    const map = this.get(storageKey, {});
    delete map[key];
    this.set(storageKey, map);
  }
}

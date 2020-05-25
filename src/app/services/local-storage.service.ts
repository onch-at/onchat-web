import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() { }

  /**
   * 保存数据
   * @param key 键名
   * @param value 数据
   */
  public set(key: any, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * 获取数据
   * @param key 键名
   */
  public get(key: any): any {
    const data = localStorage.getItem(key);
    if (!data) { return false; }
    return JSON.parse(data);
  }

  /**
   * 移除数据
   * @param key 键名
   */
  public remove(key: any): void {
    localStorage.removeItem(key);
  }
}

import { Injectable } from '@angular/core';
import { SessionStorageKey } from '../common/enum';
import { User } from '../models/onchat.model';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  /**
   * 保存数据
   * @param key 键名
   * @param value 数据
   */
  set(key: any, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * 获取数据
   * @param key 键名
   */
  get(key: any): any {
    const data = sessionStorage.getItem(key);
    if (!data) { return false; }
    return JSON.parse(data);
  }

  /**
   * 移除数据
   * @param key 键名
   */
  remove(key: any): void {
    sessionStorage.removeItem(key);
  }

  /**
   * 添加用户到会话储存
   * @param user 用户实体
   */
  addUser(user: User): void {
    const userMap: { [index: number]: User } = this.get(SessionStorageKey.UserMap) || {};
    userMap[user.id] = user;
    this.set(SessionStorageKey.UserMap, userMap);
  }

  /**
   * 从会话储存获取用户
   * @param userId 用户ID
   */
  getUser(userId: number): User {
    const userMap: { [index: number]: User } = this.get(SessionStorageKey.UserMap) || {};
    return userMap[userId];
  }
}

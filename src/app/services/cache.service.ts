import { HttpContextToken, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheEntry } from '../models/cache.model';

/** 缓存令牌，值为缓存时间，单位毫秒 */
export const HTTP_CACHE_TOKEN = new HttpContextToken(() => 0);

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cacheMap: Map<string, CacheEntry> = new Map<string, CacheEntry>();

  constructor() { }

  /**
   * 获取缓存
   * @param request
   */
  get(request: HttpRequest<unknown>): HttpResponse<unknown> | null {
    // 判断当前请求是否已被缓存，若未缓存则返回null
    const entry = this.cacheMap.get(request.urlWithParams);
    if (!entry) { return null; }
    // 若缓存命中，则判断缓存是否过期，若已过期则返回null。否则返回请求对应的响应对象
    return Date.now() > entry.expire ? null : entry.response;
  }

  /**
   * 缓存
   * @param request
   * @param response
   */
  put(request: HttpRequest<unknown>, response: HttpResponse<unknown>): void {
    const entry: CacheEntry = {
      url: request.urlWithParams,
      response: response,
      expire: Date.now() + request.context.get(HTTP_CACHE_TOKEN)
    };
    // 以请求url作为键，CacheEntry对象为值，保存到cacheMap中
    this.cacheMap.set(entry.url, entry);

    for (const [key, entry] of this.cacheMap) {
      if (Date.now() > entry.expire) {
        this.cacheMap.delete(key);
      }
    }
  }

  /**
   * 通过标记（字符串、正则）模糊查询以撤销缓存
   * @param mark
   */
  revoke(mark: string | RegExp) {
    for (const key of this.cacheMap.keys()) {
      if (mark instanceof RegExp ? mark.test(key) : key.includes(mark)) {
        return this.cacheMap.delete(key);
      }
    }
  }

}

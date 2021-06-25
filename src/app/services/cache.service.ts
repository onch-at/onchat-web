import { HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheEntry } from '../models/cache.model';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cacheMap = new Map<string, CacheEntry>();

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
    const isExpired = Date.now() > entry.expire;
    return isExpired ? null : entry.response;
  }

  /**
   * 缓存
   * @param request
   * @param response
   */
  put(request: HttpRequest<unknown>, response: HttpResponse<unknown>): void {
    // 创建CacheEntry对象
    const entry: CacheEntry = {
      url: request.urlWithParams,
      response: response,
      expire: Date.now() + +request.headers.get('Client-Cache')
    };
    // 以请求url作为键，CacheEntry对象为值，保存到cacheMap中
    this.cacheMap.set(entry.url, entry);
    this.deleteExpiredCache();
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

  /**
   * 判断当前请求是否可缓存
   * @param request
   */
  isCachable(request: HttpRequest<any>) {
    return request.headers.has('Client-Cache');
  }

  cacheHeader(cacheTime: number) {
    return new HttpHeaders({ 'Client-Cache': cacheTime.toString() });
  }

  /**
   * 删除过期缓存
   */
  private deleteExpiredCache() {
    for (const [key, entry] of this.cacheMap) {
      if (Date.now() > entry.expire) {
        this.cacheMap.delete(key);
      }
    }
  }

}

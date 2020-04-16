import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cache, CacheEntry } from '../models/interface.model';

@Injectable({
  providedIn: 'root'
})
export class CacheService implements Cache {
  cacheMap = new Map<string, CacheEntry>();
  MAX_CACHE_AGE = 30000;

  constructor() { }

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    // 判断当前请求是否已被缓存，若未缓存则返回null
    const entry = this.cacheMap.get(req.urlWithParams);
    if (!entry) { return null; }
    // 若缓存命中，则判断缓存是否过期，若已过期则返回null。否则返回请求对应的响应对象
    const isExpired = Date.now() - entry.entryTime > this.MAX_CACHE_AGE;
    return isExpired ? null : entry.response;
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
    // 创建CacheEntry对象
    const entry: CacheEntry = {
      url: req.urlWithParams,
      response: res,
      entryTime: Date.now()
    };
    // 以请求url作为键，CacheEntry对象为值，保存到cacheMap中。并执行
    // 清理操作，即清理已过期的缓存。
    this.cacheMap.set(req.urlWithParams, entry);
    this.deleteExpiredCache();
  }

  private deleteExpiredCache() {
    this.cacheMap.forEach(entry => {
      if (Date.now() - entry.entryTime > this.MAX_CACHE_AGE) {
        this.cacheMap.delete(entry.url);
      }
    });
  }

}

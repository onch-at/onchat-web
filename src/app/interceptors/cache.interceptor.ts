import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService, HTTP_CACHE_TOKEN } from '../services/cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 判断当前请求是否可缓存
    if (!isCachable(request)) {
      return next.handle(request);
    }

    // 缓存命中则直接返回
    const response = this.cacheService.get(request);
    if (response) {
      return of(response);
    }

    // 发送请求，成功后缓存
    return next.handle(request).pipe(
      tap(event => {
        event instanceof HttpResponse && this.cacheService.put(request, event);
      })
    );
  }
}

/**
 * 判断请求是否可缓存
 * 一般只有 GET 请求才需要缓存
 * @param request
 */
function isCachable(request: HttpRequest<unknown>): boolean {
  return request.context.get(HTTP_CACHE_TOKEN) > 0;
}
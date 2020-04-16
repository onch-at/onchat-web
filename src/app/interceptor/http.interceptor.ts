import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { CacheService } from '../services/cache.service';

@Injectable({
    providedIn: 'root'
})
export class CacheInterceptor implements HttpInterceptor {
    CACHABLE_URLS: string[] = [
        env.userIdUrl,
        env.userCheckLoginUrl
    ];

    constructor(private cache: CacheService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log(req)
        // return next.handle(req);

        // 判断当前请求是否可缓存
        if (!this.isRequestCachable(req)) {
            return next.handle(req);
        }
        // 获取请求对应的缓存对象，若存在则直接返回该请求对象对应的缓存对象
        const cachedResponse = this.cache.get(req);
        if (cachedResponse !== null) {
            return of(cachedResponse);
        }
        // 发送请求至API站点，请求成功后保存至缓存中
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    console.log(req.url)
                    this.cache.put(req, event);
                }
            })
        );
    }

    // 判断当前请求是否可缓存
    private isRequestCachable(req: HttpRequest<any>) {
        for (const url of this.CACHABLE_URLS) {
            if (req.url.indexOf(url) > -1) {
                return true;
            }
        }
        return false;
    }
}

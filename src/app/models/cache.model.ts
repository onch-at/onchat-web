import { HttpResponse } from "@angular/common/http";

/** 缓存条目 */
export interface CacheEntry {
    url: string;
    response: HttpResponse<unknown>;
    expire: number;
}
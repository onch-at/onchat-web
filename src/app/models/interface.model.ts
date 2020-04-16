import { HttpRequest, HttpResponse } from '@angular/common/http';

export interface Result<T> {
    code: number;
    msg: string;
    data: T;
}

export interface Cache {
    get(req: HttpRequest<any>): HttpResponse<any> | null;
    put(req: HttpRequest<any>, res: HttpResponse<any>): void;
}

export interface CacheEntry {
    url: string;
    response: HttpResponse<any>;
    entryTime: number;
}
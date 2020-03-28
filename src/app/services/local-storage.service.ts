import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() { }

  public set(key: any, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public get(key: any): any {
    const data = localStorage.getItem(key);
    if (!data) { return false; }
    return JSON.parse(data);
  }

  public remove(key: any): void {
    localStorage.removeItem(key);
  }
}

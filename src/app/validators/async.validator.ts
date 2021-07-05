import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Result } from '../models/onchat.model';
import { IndexService } from '../services/apis/index.service';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidator {
  constructor(private indexService: IndexService) { }

  /**
   * 验证邮箱是否可用
   */
  legalEmail(): AsyncValidatorFn {
    return (ctrl: AbstractControl) => this.indexService.checkEmail(ctrl.value).pipe(
      map(({ data }: Result<boolean>) => (data ? null : { legalemail: true })),
      catchError(() => of(null))
    );
  }

  /**
   * 验证用户名是否可用
   */
  legalUsername(): AsyncValidatorFn {
    return (ctrl: AbstractControl) => this.indexService.checkUsername(ctrl.value).pipe(
      map(({ data }: Result<boolean>) => (data ? null : { legalusername: true })),
      catchError(() => of(null))
    );
  }
}
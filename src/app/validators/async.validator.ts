import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Result } from '../models/onchat.model';
import { UserService } from '../services/apis/user.service';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidator {
  constructor(private userService: UserService) { }

  legalEmail(): AsyncValidatorFn {
    return (ctrl: AbstractControl) => this.userService.checkEmail(ctrl.value).pipe(
      map(({ data }: Result<boolean>) => (data ? null : { legalemail: true })),
      catchError(() => of(null))
    );
  }
}
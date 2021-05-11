import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Result } from '../models/onchat.model';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidator {
  constructor(private apiService: ApiService) { }

  legalEmail(): AsyncValidatorFn {
    return (ctrl: AbstractControl) => this.apiService.checkEmail(ctrl.value).pipe(
      map((result: Result<boolean>) => (result.data ? null : { legalemail: true })),
      catchError(() => of(null))
    );
  }
}
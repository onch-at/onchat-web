import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Result } from "../models/onchat.model";
import { OnChatService } from "../services/onchat.service";

@Injectable({
    providedIn: 'root'
})
export class AsyncValidator {
    constructor(private onChatService: OnChatService) { }

    legalEmail(): AsyncValidatorFn {
        return (ctrl: AbstractControl) => this.onChatService.checkEmail(ctrl.value).pipe(
            map((result: Result<boolean>) => (result.data ? null : { legalmail: true })),
            catchError(() => of(null))
        );
    }
}
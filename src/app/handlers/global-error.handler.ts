import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { LOCATION } from '../common/token';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    @Inject(LOCATION) private location: Location
  ) { }

  handleError(error: Error): void {
    if (/Loading chunk [\d]+ failed/i.test(error.message)) {
      this.location.reload();
    }
  }
}
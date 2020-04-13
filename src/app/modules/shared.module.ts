import { NgModule } from '@angular/core';
import { ActiveClassDirective } from 'src/app/directives/active-class.directive';
import { DetailDatePipe } from 'src/app/pipes/detail-date.pipe';

@NgModule({
  declarations: [
    ActiveClassDirective,
    DetailDatePipe
  ],
  imports: [],
  exports: [
    ActiveClassDirective,
    DetailDatePipe
  ]
})
export class SharedModule { }

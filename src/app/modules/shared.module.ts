import { NgModule } from '@angular/core';
import { ActiveClassDirective } from 'src/app/directives/active-class.directive';
import { DetailDatePipe } from 'src/app/pipes/detail-date.pipe';
import { HtmlPipe } from '../pipes/html.pipe';
import { NumLimitPipe } from '../pipes/num-limit.pipe';

@NgModule({
  declarations: [
    ActiveClassDirective,
    DetailDatePipe,
    NumLimitPipe,
    HtmlPipe
  ],
  imports: [],
  exports: [
    ActiveClassDirective,
    DetailDatePipe,
    NumLimitPipe,
    HtmlPipe
  ]
})
export class SharedModule { }

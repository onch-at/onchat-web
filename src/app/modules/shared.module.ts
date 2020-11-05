import { NgModule } from '@angular/core';
import { ActiveClassDirective } from 'src/app/directives/active-class.directive';
import { DetailDatePipe } from 'src/app/pipes/detail-date.pipe';
import { ScrollbarDirective } from '../directives/scrollbar.directive';
import { HtmlPipe } from '../pipes/html.pipe';
import { HyperlinkPipe } from '../pipes/hyperlink.pipe';
import { NumLimitPipe } from '../pipes/num-limit.pipe';

@NgModule({
  declarations: [
    ActiveClassDirective,
    ScrollbarDirective,
    DetailDatePipe,
    NumLimitPipe,
    HtmlPipe,
    HyperlinkPipe
  ],
  imports: [],
  exports: [
    ActiveClassDirective,
    ScrollbarDirective,
    DetailDatePipe,
    NumLimitPipe,
    HtmlPipe,
    HyperlinkPipe
  ]
})
export class SharedModule { }

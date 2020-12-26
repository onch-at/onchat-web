import { NgModule } from '@angular/core';
import { ActiveClassDirective } from 'src/app/directives/active-class.directive';
import { DetailDatePipe } from 'src/app/pipes/detail-date.pipe';
import { HideScrollbarDirective } from '../directives/hide-scrollbar.directive';
import { GenderPipe } from '../pipes/gender.pipe';
import { HtmlPipe } from '../pipes/html.pipe';
import { HyperlinkPipe } from '../pipes/hyperlink.pipe';
import { NumLimitPipe } from '../pipes/num-limit.pipe';

@NgModule({
  declarations: [
    ActiveClassDirective,
    HideScrollbarDirective,
    DetailDatePipe,
    NumLimitPipe,
    HtmlPipe,
    HyperlinkPipe,
    GenderPipe
  ],
  imports: [],
  exports: [
    ActiveClassDirective,
    HideScrollbarDirective,
    DetailDatePipe,
    NumLimitPipe,
    HtmlPipe,
    HyperlinkPipe,
    GenderPipe
  ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { DetailDatePipe } from 'src/app/pipes/detail-date.pipe';
import { GenderPipe } from '../pipes/gender.pipe';
import { HtmlPipe } from '../pipes/html.pipe';
import { HyperlinkPipe } from '../pipes/hyperlink.pipe';
import { NumLimitPipe } from '../pipes/num-limit.pipe';

@NgModule({
  declarations: [
    DetailDatePipe,
    NumLimitPipe,
    HtmlPipe,
    HyperlinkPipe,
    GenderPipe,
  ],
  imports: [],
  exports: [
    DetailDatePipe,
    NumLimitPipe,
    HtmlPipe,
    HyperlinkPipe,
    GenderPipe
  ]
})
export class SharedModule { }

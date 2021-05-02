import { NgModule } from '@angular/core';
import { DetailDatePipe } from 'src/app/pipes/detail-date.pipe';
import { FillPipe } from '../pipes/fill.pipe';
import { GenderPipe } from '../pipes/gender.pipe';
import { HyperlinkPipe } from '../pipes/hyperlink.pipe';
import { NumLimitPipe } from '../pipes/num-limit.pipe';
import { SanitizePipe } from '../pipes/sanitize.pipe';

@NgModule({
  declarations: [
    DetailDatePipe,
    NumLimitPipe,
    SanitizePipe,
    HyperlinkPipe,
    GenderPipe,
    FillPipe
  ],
  imports: [],
  exports: [
    DetailDatePipe,
    NumLimitPipe,
    SanitizePipe,
    HyperlinkPipe,
    GenderPipe,
    FillPipe
  ]
})
export class SharedModule { }

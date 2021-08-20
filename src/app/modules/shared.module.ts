import { NgModule } from '@angular/core';
import { DetailDatePipe } from 'src/app/pipes/detail-date.pipe';
import { AgePipe } from '../pipes/age.pipe';
import { FillPipe } from '../pipes/fill.pipe';
import { GenderPipe } from '../pipes/gender.pipe';
import { HyperlinkPipe } from '../pipes/hyperlink.pipe';
import { MemberRolePipe } from '../pipes/member-role.pipe';
import { MessageDescPipe } from '../pipes/message-desc.pipe';
import { NumLimitPipe } from '../pipes/num-limit.pipe';
import { SanitizePipe } from '../pipes/sanitize.pipe';
import { SenderPipe } from '../pipes/sender.pipe';

const DECLARATIONS = [
  AgePipe,
  FillPipe,
  GenderPipe,
  SenderPipe,
  NumLimitPipe,
  SanitizePipe,
  HyperlinkPipe,
  DetailDatePipe,
  MemberRolePipe,
  MessageDescPipe,
];

@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS
})
export class SharedModule { }

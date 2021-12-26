import { NgModule } from '@angular/core';
import { ScrollbarDirective } from './scrollbar.directive';

@NgModule({
  declarations: [ScrollbarDirective],
  exports: [ScrollbarDirective]
})
export class ScrollbarModule { }

import { NgModule } from '@angular/core';
import { VirtualScrollPatchDirective } from '../directives/virtual-scroll-patch.directive';

@NgModule({
  declarations: [VirtualScrollPatchDirective],
  exports: [VirtualScrollPatchDirective]
})
export class VirtualScrollPatchModule { }

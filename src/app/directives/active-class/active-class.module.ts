import { NgModule } from '@angular/core';
import { ActiveClassDirective } from './active-class.directive';

@NgModule({
  declarations: [ActiveClassDirective],
  exports: [ActiveClassDirective]
})
export class ActiveClassModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EmptyComponent } from './empty.component';

@NgModule({
  declarations: [
    EmptyComponent
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    EmptyComponent
  ]
})
export class EmptyModule { }

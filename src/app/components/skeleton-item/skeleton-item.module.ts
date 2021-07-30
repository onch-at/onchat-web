import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SkeletonItemComponent } from './skeleton-item.component';

@NgModule({
  declarations: [
    SkeletonItemComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    SkeletonItemComponent
  ]
})
export class SkeletonItemModule { }

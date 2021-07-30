import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ActiveClassModule } from '../../../directives/active-class/active-class.module';
import { RippleModule } from '../../../directives/ripple/ripple.module';
import { AvatarCropperComponent } from './avatar-cropper.component';

@NgModule({
  declarations: [
    AvatarCropperComponent
  ],
  imports: [
    ImageCropperModule,
    ActiveClassModule,
    CommonModule,
    IonicModule,
    RippleModule
  ],
  exports: [
    AvatarCropperComponent
  ]
})
export class AvatarCropperModule { }

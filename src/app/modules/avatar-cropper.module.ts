import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AvatarCropperComponent } from '../components/modals/avatar-cropper/avatar-cropper.component';
import { ActiveClassModule } from './active-class.module';
import { RippleModule } from './ripple.module';

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
    AvatarCropperComponent,
  ]
})
export class AvatarCropperModule { }

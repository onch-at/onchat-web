import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AvatarCropperComponent } from '../components/modals/avatar-cropper/avatar-cropper.component';
import { ActiveClassModule } from './active-class.module';

@NgModule({
  declarations: [
    AvatarCropperComponent
  ],
  imports: [
    ImageCropperModule,
    ActiveClassModule,
    CommonModule,
    IonicModule
  ],
  exports: [
    AvatarCropperComponent,
  ]
})
export class AvatarCropperModule { }

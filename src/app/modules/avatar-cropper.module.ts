import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AvatarCropperComponent } from '../components/modals/avatar-cropper/avatar-cropper.component';

@NgModule({
  declarations: [
    AvatarCropperComponent,

  ],
  imports: [
    ImageCropperModule,
    CommonModule
  ],
  exports: [
    AvatarCropperComponent,
  ]
})
export class AvatarCropperModule { }

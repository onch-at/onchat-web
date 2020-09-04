import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AvatarCropperComponent } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { SharedModule } from 'src/app/modules/shared.module';
import { AvatarPageRoutingModule } from './avatar-routing.module';
import { AvatarPage } from './avatar.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ImageCropperModule,
    AvatarPageRoutingModule,
    SharedModule
  ],
  declarations: [
    AvatarPage,
    AvatarCropperComponent
  ],
  entryComponents: [
    AvatarCropperComponent
  ],
})
export class AvatarPageModule { }

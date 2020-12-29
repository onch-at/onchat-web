import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AvatarCropperComponent } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { SharedModule } from 'src/app/modules/shared.module';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ImageCropperModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    AvatarCropperComponent
  ],
  entryComponents: [
    AvatarCropperComponent
  ],
})
export class HomePageModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { AvatarPageRoutingModule } from './avatar-routing.module';
import { AvatarPage } from './avatar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    AvatarPageRoutingModule
  ],
  declarations: [AvatarPage]
})
export class AvatarPageModule { }

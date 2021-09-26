import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ScrollbarModule } from 'src/app/directives/scrollbar/scrollbar.module';
import { SwiperModule } from 'swiper/angular';
import { AvatarPageRoutingModule } from './avatar-routing.module';
import { AvatarPage } from './avatar.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,
    AvatarPageRoutingModule,
    ScrollbarModule
  ],
  declarations: [
    AvatarPage
  ]
})
export class AvatarPageModule { }

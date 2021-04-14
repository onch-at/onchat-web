import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { AvatarPageRoutingModule } from './avatar-routing.module';
import { AvatarPage } from './avatar.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AvatarPageRoutingModule,
    ScrollbarModule
  ],
  declarations: [
    AvatarPage
  ]
})
export class AvatarPageModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HideScrollbarModule } from 'src/app/modules/hide-scrollbar.module';
import { AvatarPageRoutingModule } from './avatar-routing.module';
import { AvatarPage } from './avatar.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AvatarPageRoutingModule,
    HideScrollbarModule
  ],
  declarations: [
    AvatarPage
  ]
})
export class AvatarPageModule { }

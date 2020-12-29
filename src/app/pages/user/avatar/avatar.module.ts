import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/modules/shared.module';
import { AvatarPageRoutingModule } from './avatar-routing.module';
import { AvatarPage } from './avatar.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AvatarPageRoutingModule,
    SharedModule
  ],
  declarations: [
    AvatarPage
  ]
})
export class AvatarPageModule { }

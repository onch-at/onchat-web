import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { AvatarCropperModule } from 'src/app/modules/avatar-cropper.module';
import { HideScrollbarModule } from 'src/app/modules/hide-scrollbar.module';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    AvatarCropperModule,
    ActiveClassModule,
    HideScrollbarModule
  ],
  declarations: [
    HomePage
  ]
})
export class HomePageModule { }

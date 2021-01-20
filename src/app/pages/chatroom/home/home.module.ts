import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { AvatarCropperModule } from 'src/app/modules/avatar-cropper.module';
import { ChatSessionSelectorModule } from 'src/app/modules/chat-session-selector.module';
import { HideScrollbarModule } from 'src/app/modules/hide-scrollbar.module';
import { RippleModule } from 'src/app/modules/ripple.module';
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
    HideScrollbarModule,
    ChatSessionSelectorModule,
    RippleModule
  ],
  declarations: [
    HomePage
  ]
})
export class HomePageModule { }

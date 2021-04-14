import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { AvatarCropperModule } from 'src/app/modules/avatar-cropper.module';
import { ChatSessionSelectorModule } from 'src/app/modules/chat-session-selector.module';
import { RippleModule } from 'src/app/modules/ripple.module';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { FillPipe } from 'src/app/pipes/fill.pipe';
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
    ScrollbarModule,
    ChatSessionSelectorModule,
    RippleModule
  ],
  declarations: [
    HomePage,
    FillPipe
  ]
})
export class HomePageModule { }

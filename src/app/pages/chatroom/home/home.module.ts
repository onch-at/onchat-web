import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatMemberListComponent } from 'src/app/components/modals/chat-member-list/chat-member-list.component';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { AvatarCropperModule } from 'src/app/modules/avatar-cropper.module';
import { ChatSessionSelectorModule } from 'src/app/modules/chat-session-selector.module';
import { EmptyModule } from 'src/app/modules/empty.module';
import { RippleModule } from 'src/app/modules/ripple.module';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { SharedModule } from 'src/app/modules/shared.module';
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
    EmptyModule,
    RippleModule,
    SharedModule
  ],
  declarations: [
    HomePage,
    ChatMemberListComponent
  ]
})
export class HomePageModule { }

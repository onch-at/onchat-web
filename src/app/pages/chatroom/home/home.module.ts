import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmptyModule } from 'src/app/components/empty/empty.module';
import { AvatarCropperModule } from 'src/app/components/modals/avatar-cropper/avatar-cropper.module';
import { ChatMemberListComponent } from 'src/app/components/modals/chat-member-list/chat-member-list.component';
import { ChatSessionSelectorModule } from 'src/app/components/modals/chat-session-selector/chat-session-selector.module';
import { SkeletonItemModule } from 'src/app/components/skeleton-item/skeleton-item.module';
import { ActiveClassModule } from 'src/app/directives/active-class/active-class.module';
import { RippleModule } from 'src/app/directives/ripple/ripple.module';
import { ScrollbarModule } from 'src/app/directives/scrollbar/scrollbar.module';
import { SharedModule } from 'src/app/shared/shared.module';
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
    ScrollingModule,
    ChatSessionSelectorModule,
    EmptyModule,
    RippleModule,
    SharedModule,
    SkeletonItemModule
  ],
  declarations: [
    HomePage,
    ChatMemberListComponent
  ]
})
export class HomePageModule { }

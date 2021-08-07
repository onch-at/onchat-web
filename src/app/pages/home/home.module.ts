import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmptyModule } from 'src/app/components/empty/empty.module';
import { HomeMenuComponent } from 'src/app/components/popovers/home-menu/home-menu.component';
import { SkeletonItemModule } from 'src/app/components/skeleton-item/skeleton-item.module';
import { ActiveClassModule } from 'src/app/directives/active-class/active-class.module';
import { RippleModule } from 'src/app/directives/ripple/ripple.module';
import { ScrollbarModule } from 'src/app/directives/scrollbar/scrollbar.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { ChatroomComponent } from './contact/chatroom/chatroom.component';
import { ContactPage } from './contact/contact.page';
import { FriendComponent } from './contact/friend/friend.component';
import { NewComponent } from './contact/new/new.component';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { ProfilePage } from './profile/profile.page';
import { SessionPage } from './session/session.page';
import { SettingsPage } from './settings/settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
    RippleModule,
    ScrollingModule,
    ActiveClassModule,
    EmptyModule,
    ScrollbarModule,
    SkeletonItemModule
  ],
  declarations: [
    HomePage,
    SessionPage,
    SettingsPage,
    ProfilePage,
    ContactPage,
    NewComponent,
    FriendComponent,
    ChatroomComponent,
    HomeMenuComponent
  ]
})
export class HomePageModule { }

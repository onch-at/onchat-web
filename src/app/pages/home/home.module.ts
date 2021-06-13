import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomeMenuComponent } from 'src/app/components/popovers/home-menu/home-menu.component';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { EmptyModule } from 'src/app/modules/empty.module';
import { RippleModule } from 'src/app/modules/ripple.module';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { VirtualScrollPatchModule } from 'src/app/modules/virtual-scroll-patch.module';
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
    VirtualScrollPatchModule,
    ActiveClassModule,
    EmptyModule,
    ScrollbarModule
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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { RippleModule } from 'src/app/modules/ripple.module';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { VirtualScrollPatchModule } from 'src/app/modules/virtual-scroll-patch.module';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ContactPageRoutingModule } from './contact-routing.module';
import { ContactPage } from './contact.page';
import { FriendComponent } from './friend/friend.component';
import { NewComponent } from './new/new.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactPageRoutingModule,
    SharedModule,
    ScrollbarModule,
    ActiveClassModule,
    RippleModule,
    VirtualScrollPatchModule
  ],
  declarations: [
    NewComponent,
    FriendComponent,
    ChatroomComponent,
    ContactPage
  ]
})
export class ContactPageModule { }

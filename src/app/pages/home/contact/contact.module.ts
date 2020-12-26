import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/modules/shared.module';
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
    SharedModule
  ],
  declarations: [
    NewComponent,
    FriendComponent,
    ChatroomComponent,
    ContactPage
  ]
})
export class ContactPageModule { }

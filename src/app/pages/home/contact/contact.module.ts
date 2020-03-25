import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShareModule } from 'src/app/modules/share/share.module';
import { AddComponent } from './add/add.component';
import { BuddyComponent } from './buddy/buddy.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ContactPageRoutingModule } from './contact-routing.module';
import { ContactPage } from './contact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactPageRoutingModule,
    ShareModule
  ],
  declarations: [
    AddComponent,
    BuddyComponent,
    ChatroomComponent,
    ContactPage
  ]
})
export class ContactPageModule {}

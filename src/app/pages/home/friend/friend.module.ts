import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendPageRoutingModule } from './friend-routing.module';

import { FriendPage } from './friend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendPageRoutingModule
  ],
  declarations: [FriendPage]
})
export class FriendPageModule {}

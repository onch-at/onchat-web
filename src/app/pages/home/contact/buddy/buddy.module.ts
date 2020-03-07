import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuddyPageRoutingModule } from './buddy-routing.module';

import { BuddyPage } from './buddy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuddyPageRoutingModule
  ],
  declarations: [BuddyPage]
})
export class BuddyPageModule {}

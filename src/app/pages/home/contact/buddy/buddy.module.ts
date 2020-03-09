import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShareModule } from 'src/app/modules/share/share.module';
import { BuddyPageRoutingModule } from './buddy-routing.module';
import { BuddyPage } from './buddy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuddyPageRoutingModule,
    ShareModule
  ],
  declarations: [BuddyPage]
})
export class BuddyPageModule {}

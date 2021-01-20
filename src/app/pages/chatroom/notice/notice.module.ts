import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { RippleModule } from 'src/app/modules/ripple.module';
import { NoticePageRoutingModule } from './notice-routing.module';
import { NoticePage } from './notice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveClassModule,
    NoticePageRoutingModule,
    RippleModule
  ],
  declarations: [NoticePage]
})
export class NoticePageModule { }

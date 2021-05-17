import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { EmptyModule } from 'src/app/modules/empty.module';
import { RippleModule } from 'src/app/modules/ripple.module';
import { NoticeListComponent } from './notice-list/notice-list.component';
import { NoticePageRoutingModule } from './notice-routing.module';
import { NoticePage } from './notice.page';
import { RequestListComponent } from './request-list/request-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveClassModule,
    NoticePageRoutingModule,
    RippleModule,
    EmptyModule
  ],
  declarations: [
    NoticePage,
    NoticeListComponent,
    RequestListComponent
  ]
})
export class NoticePageModule { }

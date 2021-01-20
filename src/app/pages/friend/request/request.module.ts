import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { HideScrollbarModule } from 'src/app/modules/hide-scrollbar.module';
import { RippleModule } from 'src/app/modules/ripple.module';
import { RequestPageRoutingModule } from './request-routing.module';
import { RequestPage } from './request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HideScrollbarModule,
    ActiveClassModule,
    RequestPageRoutingModule,
    RippleModule
  ],
  declarations: [RequestPage]
})
export class RequestPageModule { }

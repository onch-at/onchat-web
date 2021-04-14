import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { RippleModule } from 'src/app/modules/ripple.module';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { HandlePageRoutingModule } from './handle-routing.module';
import { HandlePage } from './handle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollbarModule,
    ActiveClassModule,
    HandlePageRoutingModule,
    RippleModule
  ],
  declarations: [
    HandlePage,
  ]
})
export class HandlePageModule { }

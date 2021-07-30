import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/directives/active-class/active-class.module';
import { RippleModule } from 'src/app/directives/ripple/ripple.module';
import { HandlePageRoutingModule } from './handle-routing.module';
import { HandlePage } from './handle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveClassModule,
    HandlePageRoutingModule,
    RippleModule
  ],
  declarations: [HandlePage]
})
export class HandlePageModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShareModule } from 'src/app/modules/share/share.module';
import { AddPageRoutingModule } from './add-routing.module';
import { AddPage } from './add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPageRoutingModule,
    ShareModule
  ],
  declarations: [AddPage]
})
export class AddPageModule {}

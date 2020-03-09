import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShareModule } from 'src/app/modules/share/share.module';
import { CardPageRoutingModule } from './card-routing.module';
import { CardPage } from './card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardPageRoutingModule,
    ShareModule
  ],
  declarations: [CardPage]
})
export class CardPageModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/modules/shared.module';
import { ConstellationPipe } from 'src/app/pipes/constellation.pipe';
import { CardPageRoutingModule } from './card-routing.module';
import { CardPage } from './card.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CardPageRoutingModule,
    SharedModule
  ],
  declarations: [
    CardPage,
    ConstellationPipe
  ]
})
export class CardPageModule { }

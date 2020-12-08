import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ConstellationIconComponent } from 'src/app/components/constellation-icon/constellation-icon.component';
import { MoodIconComponent } from 'src/app/components/mood-icon/mood-icon.component';
import { SharedModule } from 'src/app/modules/shared.module';
import { ConstellationPipe } from 'src/app/pipes/constellation.pipe';
import { MoodPipe } from 'src/app/pipes/mood.pipe';
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
    MoodPipe,
    ConstellationPipe,
    MoodIconComponent,
    ConstellationIconComponent
  ]
})
export class CardPageModule { }

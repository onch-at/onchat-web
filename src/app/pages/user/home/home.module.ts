import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ConstellationIconComponent } from 'src/app/components/icons/constellation-icon/constellation-icon.component';
import { MoodIconComponent } from 'src/app/components/icons/mood-icon/mood-icon.component';
import { ActiveClassModule } from 'src/app/directives/active-class/active-class.module';
import { RippleModule } from 'src/app/directives/ripple/ripple.module';
import { ScrollbarModule } from 'src/app/directives/scrollbar/scrollbar.module';
import { ConstellationPipe } from 'src/app/pipes/constellation.pipe';
import { MoodPipe } from 'src/app/pipes/mood.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
    ScrollbarModule,
    ActiveClassModule,
    RippleModule
  ],
  declarations: [
    HomePage,
    MoodPipe,
    ConstellationPipe,
    MoodIconComponent,
    ConstellationIconComponent
  ]
})
export class HomePageModule { }

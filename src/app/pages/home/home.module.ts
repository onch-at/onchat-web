import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomeMenuComponent } from 'src/app/components/popovers/home-menu/home-menu.component';
import { RippleModule } from 'src/app/modules/ripple.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
    RippleModule
  ],
  declarations: [
    HomePage,
    HomeMenuComponent
  ]
})
export class HomePageModule { }

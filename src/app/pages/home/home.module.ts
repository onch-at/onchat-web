import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShareModule } from 'src/app/modules/share/share.module';
import { PopoverComponent } from '../../components/popover/popover.component';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ShareModule
  ],
  declarations: [
    HomePage,
    PopoverComponent,
  ],
  entryComponents: [
    PopoverComponent
  ]
})
export class HomePageModule { }

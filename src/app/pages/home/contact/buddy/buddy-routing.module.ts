import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuddyPage } from './buddy.page';

const routes: Routes = [
  {
    path: '',
    component: BuddyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuddyPageRoutingModule {}

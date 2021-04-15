import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { SafetyPage } from './safety.page';

const routes: Routes = [
  {
    path: '',
    component: SafetyPage,
    canActivate: [
      AuthGuard
    ],
    canLoad: [
      AuthGuard
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SafetyPageRoutingModule { }

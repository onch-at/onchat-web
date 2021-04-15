import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthGuard } from 'src/app/guards/not-auth.guard';
import { ResetPage } from './reset.page';

const routes: Routes = [
  {
    path: '',
    component: ResetPage,
    canActivate: [
      NotAuthGuard
    ],
    canLoad: [
      NotAuthGuard
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPageRoutingModule { }

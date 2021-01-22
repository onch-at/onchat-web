import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CanDeactivateGuard } from 'src/app/guards/can-deactivate.guard';
import { UserResolve } from 'src/app/resolvers/user.resolver';
import { AvatarPage } from './avatar.page';

const routes: Routes = [
  {
    path: ':userId',
    component: AvatarPage,
    resolve: {
      user: UserResolve
    },
    canDeactivate: [
      CanDeactivateGuard
    ],
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
export class AvatarPageRoutingModule { }

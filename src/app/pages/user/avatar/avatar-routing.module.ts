import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/guards/can-deactivate.guard';
import { UserResolve } from 'src/app/resolvers/onchat.resolver';
import { AvatarPage } from './avatar.page';

const routes: Routes = [
  {
    path: ':userId',
    component: AvatarPage,
    resolve: {
      user: UserResolve
    },
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvatarPageRoutingModule { }

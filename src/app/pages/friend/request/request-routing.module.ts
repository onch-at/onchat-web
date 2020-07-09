import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { NotFriendGuard } from 'src/app/guards/not-friend.guard';
import { FriendRequestByTargetIdResolve, UserResolve } from 'src/app/resolver/onchat.resolver';
import { RequestPage } from './request.page';

const routes: Routes = [
  {
    path: ':userId',
    component: RequestPage,
    resolve: {
      user: UserResolve,
      friendRequest: FriendRequestByTargetIdResolve
    },
    canActivate: [
      AuthGuard,
      NotFriendGuard
    ],
    canLoad: [
      AuthGuard,
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestPageRoutingModule { }

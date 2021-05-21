import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { FriendRequestByTargetIdResolve } from 'src/app/resolvers/friend-request.resolver';
import { UserResolve } from 'src/app/resolvers/user.resolver';
import { RequestPage } from './request.page';

const routes: Routes = [
  {
    path: ':userId',
    component: RequestPage,
    resolve: {
      user: UserResolve,
      request: FriendRequestByTargetIdResolve
    },
    canActivate: [
      AuthGuard
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

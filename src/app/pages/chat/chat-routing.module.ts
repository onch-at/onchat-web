import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { UserIdResolve } from 'src/app/guards/base.resolve';
import { ChatPage } from './chat.page';

const routes: Routes = [
  {
    path: ':id',
    component: ChatPage,
    resolve: {
      userIdResult: UserIdResolve
    },
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
export class ChatPageRoutingModule {}

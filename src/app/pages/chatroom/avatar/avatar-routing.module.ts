import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ChatroomResolve } from 'src/app/resolvers/chatroom.resolver';
import { AvatarPage } from './avatar.page';

const routes: Routes = [
  {
    path: ':chatroomId',
    component: AvatarPage,
    resolve: {
      chatroom: ChatroomResolve
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
export class AvatarPageRoutingModule { }

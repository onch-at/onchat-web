import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { SendChatRequestResolve } from 'src/app/resolvers/chat-request.resolver';
import { RequestPage } from './request.page';

const routes: Routes = [
  {
    path: ':chatRequestId',
    component: RequestPage,
    canActivate: [
      AuthGuard
    ],
    canLoad: [
      AuthGuard
    ],
    resolve: {
      chatRequest: SendChatRequestResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestPageRoutingModule { }

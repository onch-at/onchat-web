import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ChatRequestResolve } from 'src/app/resolvers/chat-request.resolver';
import { HandlePage } from './handle.page';

const routes: Routes = [
  {
    path: ':chatRequestId',
    component: HandlePage,
    canActivate: [
      AuthGuard
    ],
    canLoad: [
      AuthGuard
    ],
    resolve: {
      chatRequest: ChatRequestResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HandlePageRoutingModule { }

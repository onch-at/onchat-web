import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { UserResolve } from 'src/app/resolvers/user.resolver';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: ':userId',
    component: HomePage,
    resolve: {
      user: UserResolve
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
export class HomePageRoutingModule { }

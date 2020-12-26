import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserResolve } from 'src/app/resolvers/user.resolver';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: ':userId',
    component: HomePage,
    resolve: {
      user: UserResolve
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }

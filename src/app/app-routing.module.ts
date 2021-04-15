import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // 主页
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  // 用户模块
  {
    path: 'user',
    children: [
      {
        path: 'register',
        loadChildren: () => import('./pages/user/register/register.module').then(m => m.RegisterPageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./pages/user/login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'avatar',
        loadChildren: () => import('./pages/user/avatar/avatar.module').then(m => m.AvatarPageModule)
      },
      {
        path: 'settings',
        children: [
          {
            path: 'info',
            loadChildren: () => import('./pages/user/settings/info/info.module').then(m => m.InfoPageModule)
          },
          {
            path: 'safety',
            loadChildren: () => import('./pages/user/settings/safety/safety.module').then(m => m.SafetyPageModule)
          }
        ]
      },
      {
        path: 'password/reset',
        loadChildren: () => import('./pages/user/password/reset/reset.module').then(m => m.ResetPageModule)
      },
      {
        path: '',
        loadChildren: () => import('./pages/user/home/home.module').then(m => m.HomePageModule)
      }
    ]
  },
  // 聊天
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatPageModule)
  },
  // 好友模块
  {
    path: 'friend',
    children: [
      {
        path: 'request',
        loadChildren: () => import('./pages/friend/request/request.module').then(m => m.RequestPageModule)
      },
      {
        path: 'handle',
        loadChildren: () => import('./pages/friend/handle/handle.module').then(m => m.HandlePageModule)
      },
    ]
  },
  // 聊天室模块
  {
    path: 'chatroom',
    children: [
      {
        path: 'create',
        loadChildren: () => import('./pages/chatroom/create/create.module').then(m => m.CreatePageModule)
      },
      {
        path: 'avatar',
        loadChildren: () => import('./pages/chatroom/avatar/avatar.module').then(m => m.AvatarPageModule)
      },
      {
        path: 'notice',
        loadChildren: () => import('./pages/chatroom/notice/notice.module').then(m => m.NoticePageModule)
      },
      {
        path: 'handle',
        loadChildren: () => import('./pages/chatroom/handle/handle.module').then(m => m.HandlePageModule)
      },
      {
        path: 'request',
        loadChildren: () => import('./pages/chatroom/request/request.module').then(m => m.RequestPageModule)
      },
      {
        path: '',
        loadChildren: () => import('./pages/chatroom/home/home.module').then(m => m.HomePageModule)
      },
    ]
  },

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

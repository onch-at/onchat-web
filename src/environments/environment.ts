// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  captchaUrl: '/onchat/index/captcha',

  userUrl: '/onchat/user/',

  userIdUrl: '/onchat/user/id',
  userLoginUrl: '/onchat/user/login',
  userRegisterUrl: '/onchat/user/register',
  userLogoutUrl: '/onchat/user/logout',
  userCheckLoginUrl: '/onchat/user/checklogin',

  chatroomUrl: '/onchat/chatroom/',

  friendUrl: '/onchat/friend/',
  chatUrl: '/onchat/chat/',

  socketUrl: '',
  socketPath: '/ws/socket.io',
};

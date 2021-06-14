// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  imageCaptchaUrl: '/onchat/index/imagecaptcha',
  emailCaptchaUrl: '/onchat/index/emailcaptcha',

  userUrl: '/onchat/user/',
  chatroomUrl: '/onchat/chatroom/',
  chatRecordUrl: '/onchat/chat-record/',
  friendUrl: '/onchat/friend/',
  chatUrl: '/onchat/chat/',

  socketUrl: '',
  socketPath: '/ws/socket.io',
};

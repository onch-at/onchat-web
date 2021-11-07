// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  indexCtx: '/onchat/index',
  authCtx: '/onchat/auth',
  userCtx: '/onchat/user',
  chatCtx: '/onchat/chat',
  chatroomCtx: '/onchat/chatroom',
  chatRecordCtx: '/onchat/chat-record',
  chatSessionCtx: '/onchat/chatsession',
  friendCtx: '/onchat/friend',

  socketioPath: '/onchat/socket.io',

  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302',
        'stun:stun.qq.com:3478',
      ]
    },
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    },
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'webrtc',
      username: 'hyperlife1119@qq.com'
    },
  ]
};

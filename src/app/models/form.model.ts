import { Gender, Mood } from "../common/enum";

/** 登录表单数据模型  */
export class Login {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

/** 注册表单数据模型 */
export class Register extends Login {
  /** 验证码 */
  captcha: string;
  /** 邮箱 */
  email: string;

  constructor(username: string, password: string, email: string, captcha: string) {
    super(username, password);
    this.email = email;
    this.captcha = captcha;
  }
}

/** 纯文本消息 */
export class TextMessage {
  /** 内容 */
  content: string;

  constructor(content: string) {
    this.content = content;
  }
}

/** 富文本消息 */
export class RichTextMessage {
  /** HTML */
  html: string;
  /** 文本 */
  text: string;

  constructor(html: string, text: string) {
    this.html = html;
    this.text = text;
  }
}

/** 群聊邀请消息 */
export class ChatInvitationMessage {
  /** 聊天室ID */
  chatroomId: number;
  /** 聊天室名称 */
  name?: string;
  /** 聊天室描述 */
  description?: string;
  /** 聊天室头像 */
  avatarThumbnail?: string;

  constructor(chatroomId: number) {
    this.chatroomId = chatroomId;
  }
}

/** 图片消息 */
export class ImageMessage {
  /** 原图URL */
  url: string;
  /** 缩略图URL */
  thumbnailUrl: string;
  /** 文件名 */
  filename: string;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;

  constructor(url?: string, thumbnailUrl?: string) {
    this.url = url;
    this.thumbnailUrl = thumbnailUrl;
  }
}

/** 用户信息表单数据模型 */
export class UserInfo {
  /** 昵称 */
  nickname: string;
  /** 个性签名 */
  signature: string;
  /** 心情 */
  mood: Mood;
  /** 生日 */
  birthday: number;
  /** 性别 */
  gender: Gender;
}

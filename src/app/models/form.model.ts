import { Gender, Mood } from "../common/enum";

/** 登录表单数据模型  */
export class Login {
  constructor(
    /** 用户名 */
    public username: string,
    /** 密码 */
    public password: string
  ) { }
}

/** 注册表单数据模型 */
export class Register extends Login {
  constructor(
    /** 用户名 */
    username: string,
    /** 密码 */
    password: string,
    /** 邮箱 */
    public email: string,
    /** 验证码 */
    public captcha: string
  ) {
    super(username, password);
  }
}

/** 修改密码数据模型 */
export class ChangePassword {
  constructor(
    /** 原密码 */
    public oldPassword: string,
    /** 新密码 */
    public newPassword: string
  ) { }
}

/** 重置密码数据模型 */
export class ResetPassword {
  constructor(
    /** 用户名 */
    public username: string,
    /** 密码 */
    public password: string,
    /** 验证码 */
    public captcha: string
  ) { }
}

/** 纯文本消息 */
export class TextMessage {
  constructor(
    /** 内容 */
    public content: string
  ) { }
}

/** 富文本消息 */
export class RichTextMessage {
  constructor(
    /** HTML */
    public html: string,
    /** 文本 */
    public text: string
  ) { }
}

/** 群聊邀请消息 */
export class ChatInvitationMessage {
  /** 聊天室名称 */
  name?: string;
  /** 聊天室描述 */
  description?: string;
  /** 聊天室头像 */
  avatarThumbnail?: string;

  constructor(
    /** 聊天室ID */
    public chatroomId: number
  ) { }
}

/** 图片消息 */
export class ImageMessage {
  /** 文件名 */
  filename: string;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;

  constructor(
    /** 原图URL */
    public url: string,
    /** 缩略图URL */
    public thumbnailUrl: string
  ) { }
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

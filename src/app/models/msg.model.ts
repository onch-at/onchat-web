import { TipsType } from '../common/enum';

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

/** 文字提示消息 */
export interface TipsMessage {
  type: TipsType;
}

/** 撤回消息文字提示消息 */
export class RevokeMsgTipsMessage implements TipsMessage {
  type: TipsType = TipsType.RevokeMsg;

  constructor(
    /** 消息对应用户的ID */
    public userId: number,
    /** 消息对应用户的昵称 */
    public nickname: string
  ) { }
}

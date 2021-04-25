import { ChatMemberRole, ChatRequestStatus, ChatSessionType, FriendRequestStatus, MessageType, ResultCode } from '../common/enum';
import { AnyMessage } from './msg.model';

export interface Result<T = null> {
  code: ResultCode | number;
  msg: string;
  data: T;
}

/** 唯一基础实体类 */
export interface IEntity {
  id: number;
  createTime: number;
  updateTime?: number;
}

/** 唯一基础实体类 */
export class Entity implements IEntity {
  id: number;
  createTime: number;
  updateTime?: number;
}

/** 用户 */
export interface User extends IEntity {
  /** 用户名称 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 电子邮箱 */
  email: string;
  /** 电话号 */
  telephone: string;
  /** 头像 */
  avatar: string;
  /** 头像缩略图 */
  avatarThumbnail: string;
  /** 年龄 */
  age?: number;
  /** 个人卡片背景图 */
  backgroundImage: string;
  /** 生日 */
  birthday?: number;
  /** 星座 */
  constellation?: number;
  /** 性别 */
  gender?: number;
  /** 登录时间 */
  loginTime: number;
  /** 心情 */
  mood?: number;
  /** 个性签名 */
  signature?: string;
}

/** 聊天室 */
export interface Chatroom extends IEntity {
  /** 聊天室名称 */
  name: string;
  /** 聊天室描述 */
  description: string;
  /** 聊天室头像 */
  avatar: string;
  /** 聊天室头像缩略图 */
  avatarThumbnail: string;
  /** 聊天室最大人数 */
  maxPeopleNum: number;
  /** 聊天室类型 */
  type: number;
}

/** 聊天室成员 */
export interface ChatMember extends IEntity {
  /** 用户ID */
  userId: number;
  /** 用户群昵称 */
  nickname: string;
  /** 用户头像缩略图 */
  avatarThumbnail: string;
  /** 成员角色 */
  role: ChatMemberRole;
}

/** 聊天会话 */
export interface ChatSession extends IEntity {
  /** 用户ID */
  userId: number;
  /** 聊天室名称 */
  title: string;
  /** 聊天室头像缩略图 */
  avatarThumbnail: string;
  /** 详细数据 */
  data: any;
  /** 会话类型 */
  type: ChatSessionType;
  /** 最新消息 */
  content?: Message;
  /** 未读消息数 */
  unread?: number;
  /** 是否置顶 */
  sticky?: boolean;
}

/** 消息实体 */
export interface Message<T extends AnyMessage = AnyMessage> extends IEntity {
  /** 消息对应的聊天室ID */
  chatroomId: number;
  /** 消息发送者ID */
  userId?: number;
  /** 消息发送者的聊天室昵称 */
  nickname?: string;
  /** 消息发送者的头像缩略图 */
  avatarThumbnail?: string;
  /** 消息类型 */
  type: MessageType;
  /** 消息内容 */
  data: T;
  /** 回复消息的消息记录ID */
  replyId?: number;
  /** 消息在客户端发送的时间 */
  sendTime?: number;
  /** 发送中 */
  loading?: boolean;
  /** 上传进度 */
  percent?: number;
}

/** 好友申请 */
export interface FriendRequest extends IEntity {
  /** 申请人ID */
  requesterId: number;
  /** 被申请人ID */
  targetId: number;
  /** 申请原因 */
  requestReason: string;
  /** 拒绝理由 */
  rejectReason: string;
  /** 申请状态 */
  status: FriendRequestStatus;
  /** 申请人的别名 */
  requesterAlias: string;
  /** 被申请人的别名 */
  targetAlias: string;
  /** 申请人已读 */
  requesterReaded: boolean;
  /** 被申请人已读 */
  targetReaded: boolean;

  /** 申请人的用户名 */
  requesterUsername: string;
  /** 申请人的头像 */
  requesterAvatarThumbnail?: string;
  /** 被申请人的用户名 */
  targetUsername: string;
  /** 被申请人的头像 */
  targetAvatarThumbnail?: string;
}

/** 同意好友申请的数据 */
export interface AgreeFriendRequest {
  /** 好友申请的ID */
  friendRequestId: number;
  /** 聊天室ID */
  chatroomId: number;
  /** 申请人的ID */
  requesterId: number;
  /** 被申请人的ID */
  targetId: number;
  /** 被申请人的用户名 */
  targetUsername: string;
  /** 被申请人的头像缩略图 */
  targetAvatarThumbnail: string;
}

/**
 * 入群申请
 */
export interface ChatRequest extends IEntity {
  /** 申请人ID */
  requesterId: number;
  /** 处理人ID */
  handlerId: number;
  /** 聊天室ID */
  chatroomId: number;
  /** 已读列表（群主、管理员） */
  readedList: number[];
  /** 拒绝原因 */
  rejectReason?: string;
  /** 申请原因 */
  requestReason?: string;
  /** 状态 */
  status: ChatRequestStatus;

  /** 申请人的头像 */
  requesterAvatarThumbnail?: string;
  /** 申请人的昵称 */
  requesterNickname?: string;
  /** 处理人的昵称 */
  handlerNickname?: string;
  /** 聊天室的名字 */
  chatroomName?: string;
  /** 聊天室头像 */
  chatroomAvatarThumbnail?: string;
  /** 聊天室头像 */
  chatroomAvatar?: string;
}

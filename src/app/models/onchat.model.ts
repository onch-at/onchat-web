import { ChatMemberRole, ChatRequestStatus, ChatroomType, FriendRequestStatus, MessageType, ResultCode } from '../common/enum';
import { ChatInvitationMessage, RichTextMessage, TextMessage } from './form.model';

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

/** 聊天列表子项 */
export interface ChatItem extends IEntity {
    /** 聊天室ID */
    chatroomId: number;
    /** 聊天室名称 */
    name: string;
    /** 聊天室头像缩略图 */
    avatarThumbnail: string;
    /** 聊天室类型 */
    chatroomType: ChatroomType;
    /** 最新消息 */
    content?: Message
    /** 未读消息数 */
    unread?: number;
    /** 是否置顶 */
    sticky?: boolean;
}

/** 消息实体 */
export class Message extends Entity {
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
    data: TextMessage | RichTextMessage | ChatInvitationMessage;
    /** 回复消息的消息记录ID */
    replyId?: number;
    /** 消息在客户端发送的时间 */
    sendTime?: number;
    /** 发送中 */
    loading?: boolean;

    constructor(chatroomId: number, type: MessageType = MessageType.Text) {
        super();
        this.chatroomId = chatroomId;
        this.type = type;
        this.sendTime = Date.now();
    }
}

/** 好友申请 */
export class FriendRequest extends Entity {
    /** 申请人ID */
    selfId: number;
    /** 被申请人ID */
    targetId: number;
    /** 申请原因 */
    requestReason: string;
    /** 拒绝理由 */
    rejectReason: string;
    /** 申请人的状态 */
    selfStatus: FriendRequestStatus = FriendRequestStatus.Wait;
    /** 被申请人的状态 */
    targetStatus: FriendRequestStatus = FriendRequestStatus.Wait;
    /** 申请人的别名 */
    selfAlias: string;
    /** 被申请人的别名 */
    targetAlias: string;

    /** 申请人的用户名 */
    selfUsername: string;
    /** 申请人的头像 */
    selfAvatarThumbnail?: string;
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
    selfId: number;
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
export interface ChatRequest {
    /** 申请人ID */
    applicantId: number;
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
}

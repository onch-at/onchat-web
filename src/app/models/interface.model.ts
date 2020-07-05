import { HttpRequest, HttpResponse } from '@angular/common/http';
import { FriendRequestStatus, MessageType } from '../common/enum';

export interface Result<T> {
    code: number;
    msg: string;
    data: T;
}

/**
 * 唯一基础实体类
 */
export interface Entity {
    id: number;
    createTime: number;
    updateTime?: number;
}

/**
 * 聊天室
 */
export interface Chatroom extends Entity {
    /** 聊天室名称 */
    name: string;
    /** 聊天室描述 */
    description: string;
    /** 聊天室头像 */
    avatar: string;
    /** 聊天室头像缩略图 */
    avatarThumbnail: string;
    /** 聊天室类型 */
    type: number;
}

/**
 * 聊天列表子项
 */
export interface ChatItem extends Entity {
    /** 聊天室ID */
    chatroomId: number;
    /** 聊天室名称 */
    name: string;
    /** 未读消息数 */
    unread: number;
    /** 是否置顶 */
    sticky: boolean;
    /** 聊天室头像缩略图 */
    avatarThumbnail: string;
    /** 聊天室类型 */
    type: number;
    /** 最新消息 */
    latestMsg: MsgItem
}

/**
 * 消息列表子项
 */
export interface MsgItem extends Entity {
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
    data: any;
    /** 回复消息的消息记录ID */
    replyId?: number;
}

/** 好友申请 */
export interface FriendRequest extends Entity {
    /** 申请人ID */
    selfId: number;
    /** 被申请人ID */
    targetId: number;
    /** 申请原因 */
    requestReason: string;
    /** 拒绝理由 */
    rejectReason: string;
    /** 申请人的状态 */
    selfStatus: FriendRequestStatus;
    /** 被申请人的状态 */
    targetStatus: FriendRequestStatus;
    /** 申请人的别名 */
    selfAlias: string;
    /** 被申请人的别名 */
    targetAlias: string;
}



export interface Cache {
    get(req: HttpRequest<any>): HttpResponse<any> | null;
    put(req: HttpRequest<any>, res: HttpResponse<any>): void;
}

export interface CacheEntry {
    url: string;
    response: HttpResponse<any>;
    entryTime: number;
}
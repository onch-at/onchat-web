import { HttpRequest, HttpResponse } from '@angular/common/http';
import { MessageType } from '../common/enum';

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
    content: any;
    /** 回复消息的消息记录ID */
    replyId?: number;
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
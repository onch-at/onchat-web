import { MessageType } from '../common/enum';

/**
 * 登录表单数据模型
 */
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

/**
 * 注册表单数据模型
 */
export class Register extends Login {
    /** 验证码 */
    captcha: string;

    constructor(username: string, password: string, captcha: string) {
        super(username, password);
        this.captcha = captcha;
    }
}

export class Message {
    /** 消息对应的聊天室ID */
    chatroomId: number;
    /** 消息类型（默认为文本类型） */
    type: MessageType = MessageType.Text;
    /** 消息内容 */
    data: any;
    /** 回复消息的消息记录ID */
    replyId: number = null;

    constructor(chatroomId: number) {
        this.chatroomId = chatroomId;
    }
}
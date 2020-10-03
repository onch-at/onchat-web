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

/**
 * 纯文本消息
 */
export class TextMessage {
    /** 内容 */
    content: string;

    constructor(content: string) {
        this.content = content;
    }
}

/**
 * 富文本消息
 */
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

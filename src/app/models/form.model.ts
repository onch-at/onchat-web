
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

export class TextMessage {
    content: string;

    constructor(content: string) {
        this.content = content;
    }
}

export class RichTextMessage {
    html: string;
    text: string;

    constructor(html: string, text: string) {
        this.html = html;
        this.text = text;
    }
}

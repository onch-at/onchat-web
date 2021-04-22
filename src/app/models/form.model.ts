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

import { ValidationErrors } from "@angular/forms";
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "./constant";
import { ValidationFeedback } from "./interface";

export const usernameFeedback: ValidationFeedback = (errors: ValidationErrors) => {
  if (!errors) { return; }
  if (errors.required) {
    return '用户名不能为空！';
  }
  if (errors.pattern) {
    return '用户名只能包含字母/汉字/数字/下划线/横杠！';
  }
  if (errors.minlength || errors.maxlength) {
    return `用户名长度必须在${USERNAME_MIN_LENGTH}~${USERNAME_MAX_LENGTH}位字符之间！`;
  }
};

export const passwordFeedback: ValidationFeedback = (errors: ValidationErrors) => {
  if (!errors) { return; }
  if (errors.required) {
    return '密码不能为空！';
  }
  if (errors.minlength || errors.maxlength) {
    return `密码长度必须在${PASSWORD_MIN_LENGTH}~${PASSWORD_MAX_LENGTH}位字符之间！`;
  }
};

export const emailFeedback: ValidationFeedback = (errors: ValidationErrors) => {
  if (!errors) { return; }
  if (errors.required) {
    return '电子邮箱不能为空！';
  }
  if (errors.maxlength) {
    return `电子邮箱长度不能大于${EMAIL_MAX_LENGTH}位字符！`;
  }
  if (errors.email) {
    return '非法的电子邮箱格式！';
  }
  if (errors.legalemail) {
    return '该电子邮箱已被占用！';
  }
};

export const captchaFeedback: ValidationFeedback = (errors: ValidationErrors) => {
  if (!errors) { return; }
  if (errors.required) {
    return '验证码不能为空！';
  }
  if (errors.minlength || errors.maxlength) {
    return '验证码长度必须为6位字符！';
  }
};
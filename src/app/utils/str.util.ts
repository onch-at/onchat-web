export class StrUtil {
  /**
   * 剔除字符串中所有空格
   * @param str
   */
  static trimAll(str: string): string {
    return str.replace(/\s+/g, '');
  }

  /**
   * 是否为字符串
   * @param obj
   */
  static isString(obj: unknown) {
    return obj.constructor === String;
  }
}
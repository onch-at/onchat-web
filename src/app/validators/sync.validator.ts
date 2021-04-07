import { FormGroup, ValidatorFn } from "@angular/forms";

export class SyncValidator {

  /**
   * 比较表单中N个字段的值是否相等
   * @param ctrl 字段名
   * @param ctrls 更多的字段名
   */
  static equal(ctrl: string, ...ctrls: string[]): ValidatorFn {
    return (form: FormGroup) => {
      for (const c of ctrls) {
        if (form.get(ctrl).value !== form.get(c).value) {
          return { equal: true };
        }
      }

      return null;
    };
  }
}
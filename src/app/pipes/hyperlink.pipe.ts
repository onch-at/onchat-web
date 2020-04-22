import { Pipe, PipeTransform } from '@angular/core';
import { StrUtil } from '../common/util/str';

/**
 * 将字符串中的超链接转为A标签
 */
@Pipe({
  name: 'hyperlink'
})
export class HyperlinkPipe implements PipeTransform {

  transform(value: string): string {
    return StrUtil.hyperlink(value);
  }

}

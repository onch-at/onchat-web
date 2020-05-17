import { Pipe, PipeTransform } from '@angular/core';

/**
 * 将字符串中的超链接转为A标签
 */
@Pipe({
  name: 'hyperlink'
})
export class HyperlinkPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|:)+)/g, '<a href="$1$2" target="_blank" rel="noopener noreferrer">$1$2</a>');
  }

}

import { Pipe, PipeTransform } from '@angular/core';

/**
 * 给定长度生成一个数组，用于模板循环渲染
 */
@Pipe({
  name: 'fill'
})
export class FillPipe implements PipeTransform {

  transform(value: number): Array<null> {
    return new Array(Math.round(value)).fill(null);
  }

}

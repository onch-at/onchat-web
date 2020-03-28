import { Pipe, PipeTransform } from '@angular/core';

/**
 * 限制显示数字的大小，超过max，将会显示成 max+
 */
@Pipe({
  name: 'numLimit'
})
export class NumLimitPipe implements PipeTransform {
  transform(value: any, max: number = 99): any {
    return value > max ? max + "+" : value;
  }
}

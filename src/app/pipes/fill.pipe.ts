import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fill'
})
export class FillPipe implements PipeTransform {

  transform(value: any, length: number): Array<null> {
    return new Array(length).fill(null);
  }

}

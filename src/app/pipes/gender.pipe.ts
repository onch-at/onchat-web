import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '../common/enum';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: Gender): string {
    if (value == Gender.Male) {
      return '男';
    }

    if (value == Gender.Female) {
      return '女';
    }

    return '保密';
  }

}

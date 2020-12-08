import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '../common/enum';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: Gender): string {
    return {
      [Gender.Male]: '男',
      [Gender.Female]: '女',
      [Gender.Secret]: '保密'
    }[value];
  }

}

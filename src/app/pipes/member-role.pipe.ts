import { Pipe, PipeTransform } from '@angular/core';
import { ChatMemberRole } from '../common/enums';

@Pipe({
  name: 'memberRole'
})
export class MemberRolePipe implements PipeTransform {

  transform(value: number): string {
    return {
      [ChatMemberRole.Host]: '领袖',
      [ChatMemberRole.Manage]: '辅佐',
    }[value];
  }

}

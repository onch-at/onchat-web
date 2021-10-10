import { filter } from 'rxjs/operators';
import { ResultCode } from '../common/enum';

export function success<T>() {
  return filter<T>(({ code }: any) => code === ResultCode.Success);
};
import { filter } from 'rxjs/operators';
import { ResultCode } from './enums';

export function success<T>() {
  return filter<T>(({ code }: any) => code === ResultCode.Success);
};
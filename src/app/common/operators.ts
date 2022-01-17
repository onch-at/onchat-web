import { filter } from 'rxjs/operators';
import { ResultCode } from './enums';
import { SafeAny } from './interfaces';

export function success<T>() {
  return filter<T>(({ code }: SafeAny) => code === ResultCode.Success);
};
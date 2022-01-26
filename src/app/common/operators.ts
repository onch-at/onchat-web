import { SafeAny } from '@ngify/types';
import { filter } from 'rxjs/operators';
import { ResultCode } from './enums';

export function success<T>() {
  return filter<T>(({ code }: SafeAny) => code === ResultCode.Success);
};
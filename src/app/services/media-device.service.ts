import { Inject, Injectable } from '@angular/core';
import { from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NAVIGATOR } from '../common/tokens';
import { Overlay } from './overlay.service';

@Injectable({
  providedIn: 'root'
})
export class MediaDevice {

  constructor(
    private overlay: Overlay,
    @Inject(NAVIGATOR) private navigator: Navigator,
  ) { }

  getUserMedia(constraints: MediaStreamConstraints = {}) {
    return from(this.navigator.mediaDevices.getUserMedia(constraints)).pipe(
      catchError(error => {
        this.overlay.toast(`OnChat：${constraints.audio ? '麦克风' : constraints.video ? '摄像头' : ''}权限授权失败！`);
        return throwError(() => error);
      })
    );
  }
}

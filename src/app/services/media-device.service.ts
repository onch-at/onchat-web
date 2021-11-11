import { Inject, Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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

  getUserMedia(constraints: MediaStreamConstraints = {}): Observable<MediaStream> {
    return from(this.navigator.mediaDevices.getUserMedia(constraints)).pipe(
      catchError((error: Error) => {
        if (error.name !== 'NotFoundError') {
          this.overlay.toast(`OnChat：${constraints.audio ? '麦克风' : constraints.video ? '摄像头' : ''}权限授权失败！`);
          return throwError(() => error);
        }

        return from(this.navigator.mediaDevices.enumerateDevices()).pipe(
          switchMap((devices: MediaDeviceInfo[]) => {
            const hasVideo = devices.some(o => o.kind === 'videoinput');
            const hasAudio = devices.some(o => o.kind === 'audioinput');

            return from(this.navigator.mediaDevices.getUserMedia({
              video: hasVideo && constraints.video,
              audio: hasAudio && constraints.audio,
            }));
          })
        );
      })
    );
  }
}

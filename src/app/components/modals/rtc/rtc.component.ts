import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { filter, map, mergeMap, take, takeUntil, tap } from 'rxjs/operators';
import { AudioName, RtcDataType, SocketEvent } from 'src/app/common/enums';
import { success } from 'src/app/common/operators';
import { WINDOW } from 'src/app/common/tokens';
import { Result, User } from 'src/app/models/onchat.model';
import { RtcData } from 'src/app/models/rtc.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { MediaDevice } from 'src/app/services/media-device.service';
import { Overlay } from 'src/app/services/overlay.service';
import { Rtc } from 'src/app/services/rtc.service';
import { SocketService } from 'src/app/services/socket.service';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-rtc',
  templateUrl: './rtc.component.html',
  styleUrls: ['./rtc.component.scss'],
})
export class RtcComponent extends ModalComponent implements OnInit, OnDestroy {
  /** 对方 */
  @Input() user: User;
  @Input() isRequester: boolean;
  @Input() mediaStream?: MediaStream;
  @ViewChild('remoteVideo', { static: true }) remoteVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('localVideo', { static: true }) localVideo: ElementRef<HTMLVideoElement>;

  waiting: boolean = true;

  private timer: number;

  constructor(
    public globalData: GlobalData,
    private rtc: Rtc,
    private mediaDevice: MediaDevice,
    private socketService: SocketService,
    private feedbackService: FeedbackService,
    @Inject(WINDOW) private window: Window,
    protected overlay: Overlay,
    protected router: Router,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    merge(
      this.socketService.on(SocketEvent.RtcHangUp),
      this.socketService.on(SocketEvent.RtcBusy).pipe(
        tap(({ data: { senderId } }) => (
          senderId === this.user.id && this.overlay.toast('OnChat：对方正在忙线中，请稍后再试…')
        ))
      ),
    ).pipe(
      takeUntil(this.destroy$),
      filter(({ data: { senderId } }) => senderId === this.user.id)
    ).subscribe(() => {
      this.dismiss();
    });

    this.isRequester && this.prepare().subscribe();

    this.feedbackService.audio(AudioName.Ring).play();
    this.globalData.rtcing = true;

    // 如果三分钟后还没接通，客户端主动挂断
    this.timer = this.window.setTimeout(() => {
      if (this.waiting) {
        this.isRequester && this.overlay.toast('OnChat：对方正在忙线中，请稍后再试…');
        this.hangUp();
      }
    }, 60000 * 3);
  }

  ngOnDestroy() {
    this.rtc.close();
    this.feedbackService.audio(AudioName.Ring).pause();
    this.globalData.rtcing = false;
    this.window.clearTimeout(this.timer);
  }

  onVideoPlay() {
    this.overlay.dismissLoading();
    this.waiting = false;
  }

  prepare() {
    return (this.mediaStream ? of(this.mediaStream) : this.mediaDevice.getUserMedia({ video: true, audio: { echoCancellation: true } })).pipe(
      tap(stream => {
        this.rtc.create();

        this.socketService.on<Result<RtcData>>(SocketEvent.RtcData).pipe(
          takeUntil(this.destroy$),
          success(),
          filter(({ data: { senderId } }) => senderId === this.user.id),
          map(({ data }) => data),
        ).subscribe(({ type, value }) => {
          switch (type) {
            case RtcDataType.IceCandidate:
              this.rtc.addIceCandidate(value as RTCIceCandidate);
              break;

            case RtcDataType.Description:
              this.rtc.setRemoteDescription(value as RTCSessionDescriptionInit);

              this.isRequester && this.rtc.createAnswer({ offerToReceiveVideo: true, offerToReceiveAudio: true }).subscribe(description => {
                this.rtc.setLocalDescription(description);
                // 让对方设置我的远程描述
                this.socketService.rtcData(this.user.id, RtcDataType.Description, description);
              });
              break;
          }
        });

        this.rtc.iceCandidate().pipe(
          takeUntil(this.destroy$),
          filter(({ candidate }) => candidate !== null)
        ).subscribe(({ candidate }) => {
          // 让对方添加我的候选
          this.socketService.rtcData(this.user.id, RtcDataType.IceCandidate, candidate);
        });

        this.rtc.track().pipe(takeUntil(this.destroy$), take(1)).subscribe(async ({ streams }) => {
          this.overlay.dismissLoading();
          await this.overlay.loading('Ready…');

          this.remoteVideo.nativeElement.srcObject = streams[0];
          this.feedbackService.audio(AudioName.Ring).pause();
        });

        this.rtc.connectionStateChange().pipe(
          filter(({ target }) => ['failed', 'disconnected'].includes(target.connectionState))
        ).subscribe(() => {
          this.hangUp();
        });

        this.rtc.setTrack(stream);
        this.localVideo.nativeElement.volume = 0;
        this.localVideo.nativeElement.srcObject = stream;
      })
    );
  }

  call() {
    this.overlay.loading();
    this.prepare().pipe(
      mergeMap(() => this.rtc.negotiationNeeded().pipe(takeUntil(this.destroy$))),
      mergeMap(() => this.rtc.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true }))
    ).subscribe(description => {
      this.rtc.setLocalDescription(description);
      // 让对方设置我的远程描述
      this.socketService.rtcData(this.user.id, RtcDataType.Description, description);
    });
  }

  hangUp() {
    this.socketService.rtcHangUp(this.user.id);
    this.dismiss();
  }

}

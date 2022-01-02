import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { filter, map, mergeMap, take, takeUntil, tap } from 'rxjs/operators';
import { Throttle } from 'src/app/common/decorators';
import { AudioName, RtcDataType, SocketEvent } from 'src/app/common/enums';
import { success } from 'src/app/common/operators';
import { WINDOW } from 'src/app/common/tokens';
import { Result, User } from 'src/app/models/onchat.model';
import { RtcData } from 'src/app/models/rtc.model';
import { Destroyer } from 'src/app/services/destroyer.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { FullscreenService } from 'src/app/services/fullscreen.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { MediaDevice } from 'src/app/services/media-device.service';
import { Overlay } from 'src/app/services/overlay.service';
import { Peer } from 'src/app/services/peer.service';
import { Socket } from 'src/app/services/socket.service';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-rtc',
  templateUrl: './rtc.component.html',
  styleUrls: ['./rtc.component.scss'],
  providers: [Destroyer]
})
export class RtcComponent extends ModalComponent implements OnInit, OnDestroy {
  /** 对方 */
  @Input() target: User;
  @Input() isRequester: boolean;
  @Input() mediaStream?: MediaStream;
  @ViewChild('remoteVideo', { static: true }) remoteVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('localVideo', { static: true }) localVideo: ElementRef<HTMLVideoElement>;

  waiting: boolean = true;

  get isFullscreen(): boolean {
    return this.fullscreenService.isFullscreen(this.elementRef.nativeElement);
  }

  private timer: number;

  constructor(
    public globalData: GlobalData,
    private peer: Peer,
    private elementRef: ElementRef,
    private mediaDevice: MediaDevice,
    private socket: Socket,
    private feedbackService: FeedbackService,
    private fullscreenService: FullscreenService,
    protected overlay: Overlay,
    protected router: Router,
    protected destroyer: Destroyer,
    @Inject(WINDOW) private window: Window,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    merge(
      this.socket.on(SocketEvent.RtcHangUp),
      this.socket.on(SocketEvent.RtcBusy).pipe(
        tap(({ data: { senderId } }) => senderId === this.target.id && this.busy())
      ),
    ).pipe(
      takeUntil(this.destroyer),
      filter(({ data: { senderId } }) => senderId === this.target.id)
    ).subscribe(() => this.dismiss());

    // 如果自己是申请人，自己先准备好 RTC
    this.isRequester && this.prepare().subscribe();

    this.feedbackService.audio(AudioName.Ring).play();
    this.globalData.rtcing = true;

    // 如果三分钟后还没接通，客户端主动挂断
    this.timer = this.window.setTimeout(() => {
      if (this.waiting) {
        this.isRequester && this.busy();
        this.hangUp();
      }
    }, 60000 * 3);
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.peer.close();
    this.overlay.dismissLoading();
    this.feedbackService.audio(AudioName.Ring).pause();
    this.globalData.rtcing = false;
    this.window.clearTimeout(this.timer);
  }

  onVideoPlay() {
    this.overlay.dismissLoading();
    this.waiting = false;
  }

  busy() {
    this.overlay.toast('对方正在忙线中，请稍后再试…');
  }

  prepare() {
    return (this.mediaStream ? of(this.mediaStream) : this.mediaDevice.getUserMedia({ video: true, audio: { echoCancellation: true } })).pipe(
      tap(() => {
        this.peer.create();

        // 侦听 RTC 数据
        this.socket.on<Result<RtcData>>(SocketEvent.RtcData).pipe(
          takeUntil(this.destroyer),
          success(),
          filter(({ data: { senderId } }) => senderId === this.target.id),
          map(({ data }) => data),
        ).subscribe(({ type, value }) => {
          switch (type) {
            // 添加候选
            case RtcDataType.IceCandidate:
              const { sdpMLineIndex, candidate } = value as RTCIceCandidateInit;
              this.peer.addIceCandidate({ sdpMLineIndex, candidate });
              break;

            // 设置远程描述
            case RtcDataType.Description:
              this.peer.setRemoteDescription(value as RTCSessionDescriptionInit);
              // 如果我是请求者，那么 RTC 连接是被请求者发起的，对方是 Offer，我是 Answer
              this.isRequester && this.peer.createAnswer().subscribe(description => {
                this.peer.setLocalDescription(description);
                // 让对方设置我的远程描述
                this.peer.data(this.target.id, RtcDataType.Description, description);
              });
              break;
          }
        });

        // 将自己的候选发送给对方
        this.peer.iceCandidate.pipe(
          takeUntil(this.destroyer),
          map(({ candidate }) => candidate),
          filter(candidate => candidate !== null),
          // 只使用 UDP 流
          // filter(({ candidate }) => candidate.includes('udp')),
        ).subscribe(candidate => {
          // 让对方添加我的候选
          this.peer.data(this.target.id, RtcDataType.IceCandidate, candidate);
        });

        // 侦听轨道
        this.peer.track.pipe(takeUntil(this.destroyer), take(1)).subscribe(async ({ streams }) => {
          this.overlay.dismissLoading();
          await this.overlay.loading('Connecting…');

          this.remoteVideo.nativeElement.srcObject = streams[0];
          this.feedbackService.audio(AudioName.Ring).pause();
        });

        // 侦听连接状态
        this.peer.connectionStateChange.pipe(
          filter(({ target }) => ['closed', 'failed', 'disconnected'].includes(target.connectionState))
        ).subscribe(() => {
          this.overlay.toast('OnChat: WebRTC 连接断开！');
          this.hangUp();
        });
      }),
      tap(stream => {
        this.peer.setTracks(stream);
        this.localVideo.nativeElement.volume = 0;
        this.localVideo.nativeElement.srcObject = stream;
      })
    );
  }

  /** 被申请人发起连接 */
  @Throttle(300)
  call() {
    this.overlay.loading('Preparing…');

    this.prepare().pipe(
      takeUntil(this.destroyer),
      mergeMap(() => this.peer.negotiationNeeded),
      filter(({ target }) => (target as RTCPeerConnection).signalingState === 'stable'),
      mergeMap(() => this.peer.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true, iceRestart: true }))
    ).subscribe(description => {
      this.peer.setLocalDescription(description);
      // 让对方设置我的远程描述
      this.peer.data(this.target.id, RtcDataType.Description, description);
    });
  }

  hangUp() {
    this.peer.hangUp(this.target.id);
    this.dismiss();
  }

  toggleFullscreen() {
    this.fullscreenService.toggle(this.elementRef.nativeElement);
  }

}

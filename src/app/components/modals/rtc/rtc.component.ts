import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { ResultCode, RtcDataType, SocketEvent } from 'src/app/common/enum';
import { Result, User } from 'src/app/models/onchat.model';
import { RtcData } from 'src/app/models/rtc.model';
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
  @Input() user: User;
  @Input() isRequester: boolean;
  @Input() mediaStream?: MediaStream;
  @ViewChild('video', { static: true }) video: ElementRef<HTMLVideoElement>;

  wait: boolean = true;

  constructor(
    private rtc: Rtc,
    private mediaDevice: MediaDevice,
    private socketService: SocketService,
    protected overlay: Overlay,
    protected router: Router,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.socketService.on(SocketEvent.RtcHangUp).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.dismiss();
    });

    this.isRequester && this.prepare().subscribe();
  }

  ngOnDestroy() {
    this.rtc.close();
  }

  onLoadedmetadata() {
    this.video.nativeElement.play();
    this.wait = false;
  }

  prepare() {
    return (this.mediaStream ? of(this.mediaStream) : this.mediaDevice.getUserMedia({ video: true })).pipe(
      tap(stream => {
        this.rtc.create();

        this.socketService.on<Result<RtcData>>(SocketEvent.RtcData).pipe(
          takeUntil(this.destroy$),
          filter(({ code }) => code === ResultCode.Success),
          map(({ data }) => data),
        ).subscribe(({ type, value }) => {
          switch (type) {
            case RtcDataType.IceCandidate:
              this.rtc.addIceCandidate(value as RTCIceCandidate);
              break;

            case RtcDataType.Description:
              this.rtc.setRemoteDescription(value as RTCSessionDescriptionInit);

              this.isRequester && this.rtc.createAnswer({ offerToReceiveVideo: true }).subscribe(description => {
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

        this.rtc.track().pipe(takeUntil(this.destroy$)).subscribe(({ streams }) => {
          this.video.nativeElement.srcObject = streams[0];
          this.overlay.dismissLoading();
        });

        this.rtc.setTrack(stream);
      })
    );
  }

  call() {
    this.overlay.loading();
    this.prepare().pipe(
      mergeMap(() => this.rtc.negotiationNeeded().pipe(takeUntil(this.destroy$))),
      mergeMap(() => this.rtc.createOffer({ offerToReceiveVideo: true }))
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

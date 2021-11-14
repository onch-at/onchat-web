import { Injectable } from '@angular/core';
import { catchError, from, fromEvent, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Overlay } from './overlay.service';

@Injectable({
  providedIn: 'root'
})
export class Rtc {
  private pc: RTCPeerConnection = null;
  private stream: MediaStream = null;

  get iceCandidate() {
    return fromEvent<RTCPeerConnectionIceEvent>(this.pc, 'icecandidate');
  }

  get negotiationNeeded() {
    return fromEvent<RTCPeerConnectionIceEvent>(this.pc, 'negotiationneeded');
  }

  get connectionStateChange() {
    return fromEvent<any>(this.pc, 'connectionstatechange');
  }

  get track() {
    return fromEvent<RTCTrackEvent>(this.pc, 'track');
  }

  constructor(private overlay: Overlay) { }

  create() {
    this.pc = new RTCPeerConnection({
      iceServers: environment.iceServers,
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    });
  }

  close() {
    this.pc?.close();
    this.stream?.getTracks().forEach(o => o.stop());
    this.pc = null;
    this.stream = null;
  }

  setTracks(stream: MediaStream) {
    this.stream = stream;
    stream.getTracks().forEach(track => this.pc.addTrack(track, stream));
  }

  setLocalDescription(description: RTCSessionDescriptionInit) {
    if (!(description instanceof RTCSessionDescription)) {
      description = new RTCSessionDescription(description);
    }

    return this.pc.setLocalDescription(description).catch(error => {
      this.overlay.toast('OnChat：WebRTC 本地描述设置失败！');
      throw error;
    });
  }

  setRemoteDescription(description: RTCSessionDescriptionInit) {
    if (!(description instanceof RTCSessionDescription)) {
      description = new RTCSessionDescription(description);
    }

    return this.pc.setRemoteDescription(description);
  }

  addIceCandidate(candidate: RTCIceCandidateInit) {
    if (!(candidate instanceof RTCIceCandidate)) {
      candidate = new RTCIceCandidate(candidate);
    }

    return this.pc.addIceCandidate(candidate);
  }

  createOffer(options?: RTCOfferOptions) {
    return from(this.pc.createOffer(options)).pipe(
      catchError(error => {
        this.overlay.toast('OnChat：WebRTC Offer 创建失败！');
        console.error(error);

        return throwError(() => error);
      })
    );
  }

  createAnswer(options?: RTCAnswerOptions) {
    return from(this.pc.createAnswer(options)).pipe(
      catchError(error => {
        this.overlay.toast('OnChat：WebRTC Answer 创建失败！');
        console.error(error);

        return throwError(() => error);
      })
    );
  }
}

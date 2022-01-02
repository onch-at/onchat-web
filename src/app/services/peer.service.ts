import { Injectable } from '@angular/core';
import { catchError, from, fromEvent, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import 'webrtc-adapter';
import { RtcDataType, SocketEvent } from '../common/enums';
import { Overlay } from './overlay.service';
import { Socket } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class Peer {
  private connection: RTCPeerConnection = null;
  private stream: MediaStream = null;

  get iceCandidate() {
    return fromEvent<RTCPeerConnectionIceEvent>(this.connection, 'icecandidate');
  }

  get negotiationNeeded() {
    return fromEvent<RTCPeerConnectionIceEvent>(this.connection, 'negotiationneeded');
  }

  get connectionStateChange() {
    return fromEvent<any>(this.connection, 'connectionstatechange');
  }

  get track() {
    return fromEvent<RTCTrackEvent>(this.connection, 'track');
  }

  constructor(
    private overlay: Overlay,
    private socket: Socket
  ) { }

  create() {
    this.connection = new RTCPeerConnection({
      iceServers: environment.iceServers,
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    });
  }

  close() {
    this.connection?.close();
    this.stream?.getTracks().forEach(o => o.stop());
    this.connection = null;
    this.stream = null;
  }

  setTracks(stream: MediaStream) {
    this.stream = stream;
    stream.getTracks().forEach(track => this.connection.addTrack(track, stream));
  }

  setLocalDescription(description: RTCSessionDescriptionInit) {
    if (!(description instanceof RTCSessionDescription)) {
      description = new RTCSessionDescription(description);
    }

    return this.connection.setLocalDescription(description).catch(error => {
      this.overlay.toast('WebRTC 本地描述设置失败！');
      throw error;
    });
  }

  setRemoteDescription(description: RTCSessionDescriptionInit) {
    if (!(description instanceof RTCSessionDescription)) {
      description = new RTCSessionDescription(description);
    }

    return this.connection.setRemoteDescription(description);
  }

  addIceCandidate(candidate: RTCIceCandidateInit) {
    if (!(candidate instanceof RTCIceCandidate)) {
      candidate = new RTCIceCandidate(candidate);
    }

    return this.connection.addIceCandidate(candidate);
  }

  createOffer(options?: RTCOfferOptions) {
    return from(this.connection.createOffer(options)).pipe(
      catchError(error => {
        this.overlay.toast('WebRTC Offer 创建失败！');
        console.error(error);

        return throwError(() => error);
      })
    );
  }

  createAnswer(options?: RTCAnswerOptions) {
    return from(this.connection.createAnswer(options)).pipe(
      catchError(error => {
        this.overlay.toast('WebRTC Answer 创建失败！');
        console.error(error);

        return throwError(() => error);
      })
    );
  }

  /**
   * 发送 RTC 相关数据
   * @param targetId
   * @param type
   * @param value
   */
  data<T extends RTCSessionDescriptionInit | RTCIceCandidate>(targetId: number, type: RtcDataType, value: T) {
    this.socket.emit(SocketEvent.RtcData, {
      targetId,
      type,
      value
    });
  }

  /**
   * RTC 呼叫
   * @param chatroomId
   */
  call(chatroomId: number) {
    this.socket.emit(SocketEvent.RtcCall, { chatroomId });
  }

  /**
   * RTC 挂断
   * @param targetId
   */
  hangUp(targetId: number) {
    this.socket.emit(SocketEvent.RtcHangUp, { targetId });
  }

  /**
   * RTC 繁忙
   * @param targetId
   */
  busy(targetId: number) {
    this.socket.emit(SocketEvent.RtcBusy, { targetId });
  }
}

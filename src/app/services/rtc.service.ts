import { Injectable } from '@angular/core';
import { from, fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  constructor() { }

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

    return from(this.pc.setLocalDescription(description));
  }

  setRemoteDescription(description: RTCSessionDescriptionInit) {
    if (!(description instanceof RTCSessionDescription)) {
      description = new RTCSessionDescription(description);
    }

    return from(this.pc.setRemoteDescription(description));
  }

  addIceCandidate(candidate: RTCIceCandidateInit) {
    if (!(candidate instanceof RTCIceCandidate)) {
      candidate = new RTCIceCandidate(candidate);
    }

    return from(this.pc.addIceCandidate(candidate));
  }

  createOffer(options?: RTCOfferOptions) {
    return from(this.pc.createOffer(options));
  }

  createAnswer(options?: RTCAnswerOptions) {
    return from(this.pc.createAnswer(options));
  }
}

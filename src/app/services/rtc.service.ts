import { Injectable } from '@angular/core';
import { from, fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Rtc {
  private pc: RTCPeerConnection = null;

  constructor() { }

  create() {
    this.pc = new RTCPeerConnection({
      iceServers: environment.iceServers
    });
  }

  close() {
    this.pc?.close();
    this.pc = null;
  }

  negotiationNeeded() {
    return fromEvent<RTCPeerConnectionIceEvent>(this.pc, 'negotiationneeded');
  }

  iceCandidate() {
    return fromEvent<RTCPeerConnectionIceEvent>(this.pc, 'icecandidate');
  }

  track() {
    return fromEvent<RTCTrackEvent>(this.pc, 'track');
  }

  setTrack(stream: MediaStream) {
    stream.getTracks().forEach(track => this.pc.addTrack(track, stream));
  }

  setLocalDescription(description: RTCSessionDescriptionInit) {
    return from(this.pc.setLocalDescription(description));
  }

  setRemoteDescription(description: RTCSessionDescriptionInit) {
    return from(this.pc.setRemoteDescription(description));
  }

  addIceCandidate(candidateInitDict?: RTCIceCandidateInit) {
    return from(this.pc.addIceCandidate(new RTCIceCandidate(candidateInitDict)));
  }

  createOffer(options?: RTCOfferOptions) {
    return from(this.pc.createOffer(options));
  }

  createAnswer(options?: RTCAnswerOptions) {
    return from(this.pc.createAnswer(options));
  }
}

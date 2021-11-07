import { RtcDataType } from '../common/enums';

export type RtcData = {
  senderId: number;
  targetId: number;
  type: RtcDataType.IceCandidate;
  value: RTCIceCandidateInit;
} | {
  senderId: number;
  targetId: number;
  type: RtcDataType.Description;
  value: RTCSessionDescriptionInit;
}

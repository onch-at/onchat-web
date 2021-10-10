import { RtcDataType } from '../common/enum';

export type RtcData = {
  senderId: number;
  targetId: number;
  type: RtcDataType.IceCandidate;
  value: RTCIceCandidate;
} | {
  senderId: number;
  targetId: number;
  type: RtcDataType.Description;
  value: RTCSessionDescriptionInit;
}

import { RtcDataType } from '../common/enum';

export type RtcData = {
  targetId: number;
  type: RtcDataType.IceCandidate;
  value: RTCIceCandidate;
} | {
  targetId: number;
  type: RtcDataType.Description;
  value: RTCSessionDescriptionInit;
}

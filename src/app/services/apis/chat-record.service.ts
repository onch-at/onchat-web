import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageMessage, VoiceMessage } from 'src/app/models/msg.model';
import { Message, Result } from 'src/app/models/onchat.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatRecordService {

  constructor(private http: HttpClient) { }

  /**
   * 获取聊天记录
   * @param id 页码
   * @param chatroomId 聊天室ID
   */
  getChatRecords(id: number, chatroomId: number): Observable<Result<Message[]>> {
    const params = { id: id.toString() };
    return this.http.get<Result<Message[]>>(`${environment.chatRecordUrl}records/${chatroomId}`, { params });
  }

  /**
   * 上传图片
   * @param id 聊天室ID
   * @param image 图片
   * @param sendTime 发送时间
   */
  sendImage(id: number, image: Blob, sendTime: number) {
    const formData: FormData = new FormData();
    formData.append('image', image);
    formData.append('time', sendTime.toString());

    const request = new HttpRequest('POST', `${environment.chatRecordUrl}image/${id}`, formData, {
      reportProgress: true
    });

    return this.http.request<Result<ImageMessage>>(request);
  }

  /**
   * 上传语音
   * @param id 聊天室ID
   * @param voice 语音
   * @param sendTime 发送时间
   */
  sendVoice(id: number, voice: Blob, sendTime: number) {
    const formData: FormData = new FormData();
    formData.append('voice', voice);
    formData.append('time', sendTime.toString());

    return this.http.post<Result<Message<VoiceMessage>>>(`${environment.chatRecordUrl}voice/${id}`, formData);
  }
}

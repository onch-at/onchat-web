import { filter, first } from "rxjs/operators";
import { MessageType, ResultCode, SocketEvent } from "../common/enum";
import { ChatInvitationMessage, ImageMessage, RichTextMessage, TextMessage } from "../models/form.model";
import { Message as IMessage, Result } from "../models/onchat.model";
import { SocketService } from "../services/socket.service";

export class Message implements IMessage {
    id: number;
    createTime: number;
    updateTime?: number;
    chatroomId: number;
    userId?: number;
    nickname?: string;
    avatarThumbnail?: string;
    type: MessageType;
    data: TextMessage | RichTextMessage | ChatInvitationMessage | ImageMessage;
    replyId?: number;
    sendTime?: number;
    loading?: number | boolean;

    constructor(type: MessageType = MessageType.Text) {
        this.type = type;
        this.sendTime = Date.now();
        this.createTime = this.sendTime;
        this.loading = true;
    }

    send(service: SocketService) {
        const subscription = service.on(SocketEvent.Message).pipe(
            filter((result: Result<IMessage>) => {
                const { data } = result;
                return result.code === ResultCode.Success && this.isSelf(data);
            })
        ).subscribe((result: Result<IMessage>) => {
            const { data, ...msg } = result.data;

            Object.assign(this, msg);
            this.loading = false;

            subscription.unsubscribe();
        });

        // 重连时，自动重发
        service.onInit().pipe(
            first(),
            filter(() => !!this.loading)
        ).subscribe(() => {
            this.send(service);
        });

        service.message(this);
    }

    isSelf(msg: IMessage) {
        return msg.chatroomId === this.chatroomId &&
            msg.sendTime === this.sendTime &&
            msg.userId === this.userId &&
            msg.type === this.type;
    }

}
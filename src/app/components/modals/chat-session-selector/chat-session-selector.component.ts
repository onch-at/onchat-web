import { Component, Input, OnInit } from '@angular/core';
import { ChatSession } from 'src/app/models/onchat.model';

@Component({
  selector: 'app-chat-session-selector',
  templateUrl: './chat-session-selector.component.html',
  styleUrls: ['./chat-session-selector.component.scss'],
})
export class ChatSessionSelectorComponent implements OnInit {
  /** 标题 */
  @Input() title: string;
  /** 会话列表 */
  @Input() chatSessions: (ChatSession & { checked: boolean })[]
  /** 确认处理器 */
  @Input() handler: () => unknown;

  constructor() {

  }

  ngOnInit() { }

}

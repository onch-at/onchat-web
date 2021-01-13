import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatRequestStatus, ResultCode } from 'src/app/common/enum';
import { ChatRequest, Result } from 'src/app/models/onchat.model';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-handle',
  templateUrl: './handle.page.html',
  styleUrls: ['./handle.page.scss'],
})
export class HandlePage implements OnInit {
  chatRequest: ChatRequest;
  chatRequestStatus: typeof ChatRequestStatus = ChatRequestStatus;

  constructor(
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { chatRequest: Result<ChatRequest> | ChatRequest }) => {
      if ((data.chatRequest as ChatRequest).id) {
        this.chatRequest = data.chatRequest as ChatRequest;
      } else if ((data.chatRequest as Result<ChatRequest>).code === ResultCode.Success) {
        this.chatRequest = (data.chatRequest as Result<ChatRequest>).data;
      } else {
        this.overlayService.presentToast('参数错误！');
        this.router.navigateByUrl('/');
      }

      console.log(this.chatRequest)
    });
  }

  agree() { }

  reject() {

  }

}

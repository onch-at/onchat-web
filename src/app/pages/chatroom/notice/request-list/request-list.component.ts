import { Component, OnInit } from '@angular/core';
import { ChatRequestStatus } from 'src/app/common/enum';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {
  chatRequestStatus: typeof ChatRequestStatus = ChatRequestStatus;

  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private overlayService: OverlayService,
    public globalData: GlobalData,
  ) { }

  ngOnInit() { }

}

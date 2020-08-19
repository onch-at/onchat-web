import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { SysUtil } from 'src/app/common/utils/sys.util';
import { Result } from 'src/app/models/onchat.model';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-avatar-cropper',
  templateUrl: './avatar-cropper.component.html',
  styleUrls: ['./avatar-cropper.component.scss'],
})
export class AvatarCropperComponent implements OnInit {
  @ViewChild('imageCropper', { static: true }) imageCropper: ImageCropperComponent;
  @Input() imageChangedEvent: Event;
  @Output() uploaded: EventEmitter<string> = new EventEmitter<string>();
  /** 图片格式，优先jpeg */
  format: string = SysUtil.isSupportJPEG() ? 'jpeg' : 'png';

  constructor(
    public onChatService: OnChatService,
    private modalController: ModalController,
    private overlayService: OverlayService
  ) { }

  ngOnInit() { }

  /**
   * 关闭自己
   * @param data 需要传回的数据
   */
  dismiss(data: any = null) {
    this.modalController.dismiss(data);
  }

  /**
   * 上传图片
   */
  uploadImage() {
    SysUtil.uploadFile('image/*').then((event: Event) => {
      this.imageChangedEvent = event;
    });
  }

  /**
   * 提交
   */
  submit() {
    const loading = this.overlayService.presentLoading('正在上传…');
    // 打开全局加载
    this.onChatService.globalLoading = true;
    const event = this.imageCropper.crop();

    this.onChatService.uploadUserAvatar(SysUtil.dataURItoBlob(event.base64)).subscribe(async (result: Result) => {
      this.onChatService.globalLoading = false;

      if (result.code === 0) {
        this.onChatService.user.avatar = event.base64;
        this.onChatService.user.avatarThumbnail = event.base64;

        this.dismiss(event.base64);
        this.overlayService.presentMsgToast('头像上传成功！');
      } else {
        this.overlayService.presentMsgToast(result.msg);
      }

      (await loading).dismiss();
    });
  }

}

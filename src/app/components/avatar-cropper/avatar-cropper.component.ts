import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { SysUtil } from 'src/app/common/utils/sys.util';
import { Result } from 'src/app/models/onchat.model';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-avatar-cropper',
  templateUrl: './avatar-cropper.component.html',
  styleUrls: ['./avatar-cropper.component.scss'],
})
export class AvatarCropperComponent implements OnInit {
  @ViewChild('imageCropper', { static: true }) imageCropper: ImageCropperComponent;
  @Input() imageChangedEvent: Event;
  /** 图片格式，优先级：webp -> jpeg -> png */
  format: string = SysUtil.isSupportWEBP() ? 'webp' : SysUtil.isSupportJPEG() ? 'jpeg' : 'png';

  constructor(
    public onChatService: OnChatService,
    private modalController: ModalController,
    private sessionStorageService: SessionStorageService,
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
    SysUtil.uploadFile('image/webp,image/jpeg,image/png,image/gif').then((event: Event) => {
      this.imageChangedEvent = event;
    });
  }

  /**
   * 提交
   */
  async submit() {
    const loading = this.overlayService.presentLoading('正在上传…');
    // 打开全局加载
    this.onChatService.globalLoading = true;
    const event = this.imageCropper.crop();

    const imageBlob = SysUtil.dataURItoBlob(event.base64);

    if (imageBlob.size > 1048576) {
      this.onChatService.globalLoading = false;
      (await loading).dismiss();

      return this.overlayService.presentMsgToast('文件体积过大（' + (imageBlob.size / 1048576).toFixed(2) + 'MB），仅接受体积为1MB以内的文件');
    }

    this.onChatService.uploadUserAvatar(imageBlob).subscribe(async (result: Result<{ avatar: string, avatarThumbnail: string }>) => {
      this.onChatService.globalLoading = false;

      if (result.code === 0) {
        this.onChatService.user.avatar = result.data.avatar;
        this.onChatService.user.avatarThumbnail = result.data.avatarThumbnail;

        this.sessionStorageService.setUser(this.onChatService.user);

        this.dismiss(event.base64);
        this.overlayService.presentMsgToast('头像上传成功！');
      } else {
        this.overlayService.presentMsgToast(result.msg);
      }

      (await loading).dismiss();
    });
  }

}

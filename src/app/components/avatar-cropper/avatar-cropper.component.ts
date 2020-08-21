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
  /** 文件变更事件 */
  @Input() imageChangedEvent: Event;
  /** 图片裁剪组件 */
  @ViewChild(ImageCropperComponent, { static: true }) imageCropper: ImageCropperComponent;
  /** 图片格式，优先级：webp -> jpeg -> png */
  format: string = SysUtil.isSupportWEBP() ? 'webp' : SysUtil.isSupportJPEG() ? 'jpeg' : 'png';
  /** 加载中 */
  loading: boolean = true;

  constructor(
    public onChatService: OnChatService,
    private modalController: ModalController,
    private sessionStorageService: SessionStorageService,
    private overlayService: OverlayService
  ) { }

  ngOnInit() { }

  /**
   * 关闭自己
   * @param data 需要传回一个image src
   */
  dismiss(data: string = null) {
    this.modalController.dismiss(data);
  }

  /**
   * 上传图片
   */
  uploadImage() {
    SysUtil.uploadFile('image/*').then(async (event: Event) => {
      this.loading = true;
      this.imageCropper.imageQuality = 90;
      this.imageChangedEvent = event;
    });
  }

  /**
   * 图像加载完成时
   */
  onImageLoaded() {
    this.loading = false;
  }

  /**
   * 图像加载失败时
   */
  onLoadImageFailed() {
    this.overlayService.presentMsgToast('图像加载失败！');
  }

  /**
   * 提交
   */
  async submit() {
    this.loading = true;

    const event = this.imageCropper.crop();
    const imageBlob = SysUtil.dataURItoBlob(event.base64);
    const size = imageBlob.size;

    this.loading = false;

    // 如果文件大于1MB
    if (size > 1048576) {
      // 如果质量大于0，可以继续压缩
      if (this.imageCropper.imageQuality > 0) {
        this.imageCropper.imageQuality -= 5;
        this.overlayService.presentMsgToast('图片文件体积过大，正在尝试进一步压缩…');
        return this.submit();
      } else {
        return this.overlayService.presentMsgToast('文件体积过大(' + (size / 1048576).toFixed(2) + 'MB)，仅接受体积为1MB以内的文件');
      }
    }

    const loading = await this.overlayService.presentLoading('正在上传…');
    // 打开全局加载
    this.onChatService.globalLoading = true;

    this.onChatService.uploadUserAvatar(imageBlob).subscribe(async (result: Result<{ avatar: string, avatarThumbnail: string }>) => {
      loading.dismiss();

      if (result.code === 0) {
        this.onChatService.user.avatar = result.data.avatar;
        this.onChatService.user.avatarThumbnail = result.data.avatarThumbnail;

        this.sessionStorageService.setUser(this.onChatService.user);

        this.dismiss(event.base64);
        this.overlayService.presentMsgToast('头像上传成功！');
      } else {
        this.overlayService.presentMsgToast(result.msg);
      }

      this.onChatService.globalLoading = false;
    });
  }

}

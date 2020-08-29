import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Result } from 'src/app/models/onchat.model';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { SysUtil } from 'src/app/utils/sys.util';

type ImageCropData = { imageBlob: Blob, imageSrc: SafeUrl };

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
  ionLoading: Promise<HTMLIonLoadingElement>;
  /** 无法加载图片 */
  error: boolean = false;
  subject: Subject<unknown> = new Subject();

  constructor(
    public onChatService: OnChatService,
    private modalController: ModalController,
    private sessionStorageService: SessionStorageService,
    private overlayService: OverlayService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit() {
    this.ionLoading = this.overlayService.presentLoading('正在加载…');

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.subject)
    ).subscribe(() => this.dismiss());
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }

  /**
   * 关闭自己
   * @param data 需要传回一个image src
   */
  dismiss(data: SafeUrl = null) {
    this.modalController.dismiss(data);
  }

  /**
   * 上传图片
   */
  uploadImage() {
    SysUtil.uploadFile('image/*').then((event: any) => {
      this.ionLoading = this.overlayService.presentLoading('正在加载…');
      this.error = false;
      this.imageCropper.imageQuality = 90;
      this.imageChangedEvent = event;
    });
  }

  /**
   * 图像加载完成时
   */
  async onImageLoaded() {
    (await this.ionLoading).dismiss();
  }

  /**
   * 图像加载失败时
   */
  async onLoadImageFailed() {
    this.error = true;
    (await this.ionLoading).dismiss();
    this.overlayService.presentMsgToast('图像加载失败！');
  }

  async crop(): Promise<ImageCropData> {
    let imageBlob: Blob, imageSrc: string | SafeUrl;

    // 此处需要调用imageCropper的一些私有方法，使用 any 绕过编译器检查
    const imageCropper: any = this.imageCropper;
    // 如果支持离屏画布，并且当前允许裁剪
    if (
      'OffscreenCanvas' in window &&
      imageCropper.sourceImage &&
      imageCropper.sourceImage.nativeElement &&
      imageCropper.transformedImage
    ) {
      const worker = new Worker('../../workers/image-cropper.worker', { type: 'module' });

      // 解构出需要的属性/方法
      const {
        format,
        cropper,
        transform,
        transformedSize,
        backgroundColor,
        transformedImage,
        containWithinAspectRatio,
        maintainAspectRatio,
        aspectRatio,
      } = imageCropper;

      const imagePosition = imageCropper.getImagePosition();
      const width = imagePosition.x2 - imagePosition.x1;
      const height = imagePosition.y2 - imagePosition.y1;

      let imageBitmap: ImageBitmap;
      try {
        imageBitmap = await createImageBitmap(transformedImage);
      } catch (e) {
        worker.terminate();
        return { imageBlob, imageSrc };
      }

      return await new Promise<ImageCropData>((resolve, reject) => {
        worker.onmessage = ({ data }) => {
          imageBlob = data.blob;
          imageSrc = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageBlob));
          this.imageCropper.imageCropped.emit(data);
          worker.terminate();
          resolve({ imageBlob, imageSrc });
        };

        worker.onerror = () => {
          worker.terminate();
          reject({ imageBlob, imageSrc });
        }

        worker.postMessage({
          format,
          cropper,
          transform,
          aspectRatio,
          imageBitmap,
          imagePosition,
          backgroundColor,
          transformedSize,
          maintainAspectRatio,
          containWithinAspectRatio,
          quality: imageCropper.getQuality(),
          resizeRatio: imageCropper.getResizeRatio(width, height),
          offsetImagePosition: imageCropper.getOffsetImagePosition(),
        }, [imageBitmap]);

        this.imageCropper.startCropImage.emit();
      });
    }

    const event = this.imageCropper.crop();
    imageBlob = SysUtil.dataURItoBlob(event.base64);
    imageSrc = imageSrc = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageBlob));

    return { imageBlob, imageSrc };
  }

  /**
   * 提交
   */
  async submit() {
    const loading = await this.overlayService.presentLoading('正在解析…');

    const { imageBlob, imageSrc } = await this.crop();

    if (!imageBlob) {
      return this.onLoadImageFailed();
    }

    loading.dismiss();
    const size = imageBlob.size;

    // 如果文件大于1MB
    if (size > 1048576) {
      // 如果质量大于0，可以继续压缩
      if (this.imageCropper.imageQuality > 0) {
        this.imageCropper.imageQuality -= 5;

        await this.overlayService.presentMsgToast('图片文件体积过大，尝试进一步压缩…');
        return this.submit();
      } else {
        return this.overlayService.presentMsgToast('文件体积过大(' + (size / 1048576).toFixed(2) + 'MB)，仅接受体积为1MB以内的文件');
      }
    }

    this.ionLoading = this.overlayService.presentLoading('正在上传…');
    // 打开全局加载
    this.onChatService.globalLoading = true;

    this.onChatService.uploadUserAvatar(imageBlob).subscribe(async (result: Result<{ avatar: string, avatarThumbnail: string }>) => {
      if (result.code === 0) {
        this.onChatService.user.avatar = result.data.avatar;
        this.onChatService.user.avatarThumbnail = result.data.avatarThumbnail;

        this.sessionStorageService.setUser(this.onChatService.user);

        this.dismiss(imageSrc);
        this.overlayService.presentMsgToast('头像上传成功！');
      } else {
        this.overlayService.presentMsgToast(result.msg);
      }

      (await this.ionLoading).dismiss();
      this.onChatService.globalLoading = false;
    });
  }

}

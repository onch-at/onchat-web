import { Component, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ImageCropperComponent, resizeCanvas } from 'ngx-image-cropper';
import { Observable } from 'rxjs';
import { ResultCode } from 'src/app/common/enum';
import { Result } from 'src/app/models/onchat.model';
import { OverlayService } from 'src/app/services/overlay.service';
import { SysUtil } from 'src/app/utils/sys.util';
import { ModalComponent } from '../modal.component';

type ImageCropData = { imageBlob: Blob, imageSrc: SafeUrl };
export type AvatarData = { avatar: string; avatarThumbnail: string };

@Component({
  selector: 'app-avatar-cropper',
  templateUrl: './avatar-cropper.component.html',
  styleUrls: ['./avatar-cropper.component.scss'],
})
export class AvatarCropperComponent extends ModalComponent {
  /** 文件变更事件 */
  @Input() imageChangedEvent: Event;
  /** 上传器 */
  @Input() uploader: (avatar: Blob) => Observable<Result<AvatarData>>;
  /** 处理程序 */
  @Input() handler: (result: Result<AvatarData>) => unknown;
  /** 图片裁剪组件 */
  @ViewChild(ImageCropperComponent, { static: true }) imageCropper: ImageCropperComponent;
  /** 图片格式，优先级：webp -> jpeg -> png */
  format: string = SysUtil.isSupportWEBP() ? 'webp' : SysUtil.isSupportJPEG() ? 'jpeg' : 'png';
  /** 加载中 */
  ionLoading: Promise<HTMLIonLoadingElement>;
  /** 无法加载图片 */
  error: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    protected overlayService: OverlayService,
    protected router: Router
  ) {
    super(router, overlayService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.ionLoading = this.overlayService.presentLoading();
  }

  /**
   * 关闭自己
   * @param data 需要传回一个image src
   */
  dismiss(data?: SafeUrl) {
    super.dismiss(data);
  }

  /**
   * 上传图片
   */
  uploadImage() {
    SysUtil.uploadFile('image/*').then((event: any) => {
      this.ionLoading = this.overlayService.presentLoading();
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
    this.overlayService.presentToast('图像加载失败！');
  }

  async crop(): Promise<ImageCropData> {
    let imageBlob: Blob, imageSrc: string | SafeUrl;

    // 此处需要调用imageCropper的一些私有方法，使用 any 绕过编译器检查
    const imageCropper: any = this.imageCropper;
    // 如果支持离屏画布，并且当前允许裁剪
    if (
      'OffscreenCanvas' in window &&
      imageCropper.sourceImage?.nativeElement &&
      imageCropper.transformedImage
    ) {
      const worker = new Worker('../../../workers/image-cropper.worker', { type: 'module' });

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
          imageSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
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
          resizeCanvas,
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
    imageSrc = imageSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));

    return { imageBlob, imageSrc };
  }

  /**
   * 提交
   */
  async submit() {
    const loading = await this.overlayService.presentLoading('Parsing…');

    const { imageBlob, imageSrc } = await this.crop();

    if (!imageBlob) {
      return this.onLoadImageFailed();
    }

    loading.dismiss();
    const size = imageBlob.size;

    // 如果文件大于1MB
    if (size > 1048576) {
      // 如果质量大于等于5，可以继续压缩
      if (this.imageCropper.imageQuality >= 5) {
        this.imageCropper.imageQuality -= 5;

        await this.overlayService.presentToast('图片文件体积过大，正在尝试进一步压缩…');
        return this.submit();
      }

      return this.overlayService.presentToast(`文件体积过大（${(size / 1048576).toFixed(2)} MB），仅接受体积为1MB以内的文件`);
    }

    this.ionLoading = this.overlayService.presentLoading('Uploading…');

    this.uploader(imageBlob).subscribe(async (result: Result<AvatarData>) => {
      (await this.ionLoading).dismiss();

      const { code, msg } = result;

      if (code !== ResultCode.Success) {
        return this.overlayService.presentToast(msg);
      }

      this.handler(result);
      this.dismiss(imageSrc);
      this.overlayService.presentToast('头像上传成功！');
    });
  }

}

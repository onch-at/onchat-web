export class BlobUtils {
  /**
   * 是否为图片
   * @param blob
   */
  static isImage(blob: Blob): boolean {
    return blob.size > 0 && blob.type.startsWith('image/');
  }

  /**
   * 是否为动图
   * @param image
   */
  static isAnimation(image: Blob): boolean {
    return ['image/apng', 'image/gif'].includes(image.type);
  }

  /**
   * Blob to File
   * @param blob
   * @param fileName
   * @param lastModified
   */
  static toFile(blob: Blob, fileName: string, lastModified?: number): File {
    return new File([blob], fileName, { type: blob.type, lastModified });
  }
}
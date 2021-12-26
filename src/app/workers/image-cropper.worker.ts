/// <reference lib="webworker" />

declare var OffscreenCanvas;

addEventListener('message', async ({ data }) => {
  const {
    format,
    cropper,
    quality,
    transform,
    resizeRatio,
    aspectRatio,
    imageBitmap,
    resizeCanvas,
    imagePosition,
    backgroundColor,
    transformedSize,
    offsetImagePosition,
    maintainAspectRatio,
    containWithinAspectRatio,
  } = data;

  const width = imagePosition.x2 - imagePosition.x1;
  const height = imagePosition.y2 - imagePosition.y1;

  const cropCanvas = new OffscreenCanvas(width, height);
  const ctx = cropCanvas.getContext('2d');

  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  const scaleX = (transform.scale || 1) * (transform.flipH ? -1 : 1);
  const scaleY = (transform.scale || 1) * (transform.flipV ? -1 : 1);

  ctx.setTransform(scaleX, 0, 0, scaleY, transformedSize.width / 2, transformedSize.height / 2);
  ctx.translate(-imagePosition.x1 / scaleX, -imagePosition.y1 / scaleY);
  ctx.rotate((transform.rotate || 0) * Math.PI / 180);
  ctx.drawImage(imageBitmap, -transformedSize.width / 2, -transformedSize.height / 2);

  const output = {
    width,
    height,
    blob: null,
    imagePosition,
    offsetImagePosition: null,
    cropperPosition: { ...cropper },
  };

  if (containWithinAspectRatio) {
    output.offsetImagePosition = offsetImagePosition;
  }

  if (resizeRatio !== 1) {
    output.width = Math.round(width * resizeRatio);
    output.height = maintainAspectRatio
      ? Math.round(output.width / aspectRatio)
      : Math.round(height * resizeRatio);
    resizeCanvas(cropCanvas, output.width, output.height);
  }

  output.blob = await cropCanvas.convertToBlob({
    type: 'image/' + format,
    quality: quality
  });

  postMessage(output);
});

/// <reference lib="webworker" />

addEventListener('message', async ({ data }) => {
  const {
    quality,
    format,
    imageBitmap
  } = data;

  const cropCanvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  const ctx = cropCanvas.getContext('2d');

  ctx.drawImage(imageBitmap, 0, 0);

  postMessage(await cropCanvas.convertToBlob({
    type: 'image/' + format,
    quality: quality
  }));
});

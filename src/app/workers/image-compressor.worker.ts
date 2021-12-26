/// <reference lib="webworker" />

declare var OffscreenCanvas;

addEventListener('message', async ({ data }) => {
  const { quality, format, imageBitmap } = data;

  const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(imageBitmap, 0, 0);

  postMessage(await canvas.convertToBlob({
    type: 'image/' + format,
    quality: quality
  }));
});

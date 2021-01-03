/// <reference lib="webworker" />

addEventListener('message', async ({ data }) => {
  const {
    format,
    cropper,
    quality,
    transform,
    resizeRatio,
    aspectRatio,
    imageBitmap,
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
  const ctx: any = cropCanvas.getContext('2d');

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

  const output: any = {
    width,
    height,
    imagePosition,
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

function resizeCanvas(canvas: OffscreenCanvas, width: number, height: number) {
  const width_source = canvas.width;
  const height_source = canvas.height;
  width = Math.round(width);
  height = Math.round(height);

  const ratio_w = width_source / width;
  const ratio_h = height_source / height;
  const ratio_w_half = Math.ceil(ratio_w / 2);
  const ratio_h_half = Math.ceil(ratio_h / 2);

  const ctx = canvas.getContext('2d') as any;

  const img = ctx.getImageData(0, 0, width_source, height_source);
  const img2 = ctx.createImageData(width, height);
  const data = img.data;
  const data2 = img2.data;

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const x2 = (i + j * width) * 4;
      const center_y = j * ratio_h;
      let weight = 0;
      let weights = 0;
      let weights_alpha = 0;
      let gx_r = 0;
      let gx_g = 0;
      let gx_b = 0;
      let gx_a = 0;

      const xx_start = Math.floor(i * ratio_w);
      const yy_start = Math.floor(j * ratio_h);
      let xx_stop = Math.ceil((i + 1) * ratio_w);
      let yy_stop = Math.ceil((j + 1) * ratio_h);
      xx_stop = Math.min(xx_stop, width_source);
      yy_stop = Math.min(yy_stop, height_source);

      for (let yy = yy_start; yy < yy_stop; yy++) {
        const dy = Math.abs(center_y - yy) / ratio_h_half;
        const center_x = i * ratio_w;
        const w0 = dy * dy; //pre-calc part of w
        for (let xx = xx_start; xx < xx_stop; xx++) {
          const dx = Math.abs(center_x - xx) / ratio_w_half;
          const w = Math.sqrt(w0 + dx * dx);
          if (w >= 1) {
            //pixel too far
            continue;
          }
          //hermite filter
          weight = 2 * w * w * w - 3 * w * w + 1;
          const pos_x = 4 * (xx + yy * width_source);
          //alpha
          gx_a += weight * data[pos_x + 3];
          weights_alpha += weight;
          //colors
          if (data[pos_x + 3] < 255)
            weight = weight * data[pos_x + 3] / 250;
          gx_r += weight * data[pos_x];
          gx_g += weight * data[pos_x + 1];
          gx_b += weight * data[pos_x + 2];
          weights += weight;
        }
      }
      data2[x2] = gx_r / weights;
      data2[x2 + 1] = gx_g / weights;
      data2[x2 + 2] = gx_b / weights;
      data2[x2 + 3] = gx_a / weights_alpha;
    }
  }

  canvas.width = width;
  canvas.height = height;

  //draw
  ctx.putImageData(img2, 0, 0);
}

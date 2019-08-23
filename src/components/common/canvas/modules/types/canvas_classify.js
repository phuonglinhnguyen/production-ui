import CanvasImage from "../image/canvas_image";

class CanvasView extends CanvasImage {
  redrawImage() {
    const { image, rotate, centerX, centerY, width, height, context } = this;
    if (!image) {
      return;
    }

    this.clear(width, height, context);

    context.save();
    try {
      if (rotate) {
        context.translate(centerX, centerY);
        context.rotate(rotate * Math.PI / 180);
        context.translate(-centerX, -centerY);
      }

      const { x, y, w, h } = image.coordinate;
      context.drawImage(image.value, x, y, w, h);
    } catch (error) {
      console.log(error);
    }

    context.restore();
  }

  drawImage(wCanvas, hCanvas, img, context) {
    let wImage = img.width,
      hImage = img.height;
    let imageAspectRatio = wImage / hImage;
    let canvas_imageAspectRatio = wCanvas / hCanvas;
    let renderableHeight, renderableWidth, xStart, yStart;

    // If image's aspect ratio is less than canvas_image's we fit on height
    // and place the image centrally along width
    if (imageAspectRatio < canvas_imageAspectRatio) {
      renderableHeight = hCanvas;
      renderableWidth = wImage * (renderableHeight / hImage);
      xStart = (wCanvas - renderableWidth) / 2;
      yStart = 0;
    } else if (imageAspectRatio > canvas_imageAspectRatio) {
      // If image's aspect ratio is greater than canvas_image's we fit on width
      // and place the image centrally along height
      renderableWidth = wCanvas;
      renderableHeight = hImage * (renderableWidth / wImage);
      xStart = 0;
      yStart = (hCanvas - renderableHeight) / 2;
    } else {
      // Happy path - keep aspect ratio
      renderableHeight = hCanvas;
      renderableWidth = wCanvas;
      xStart = 0;
      yStart = 0;
    }
    context.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);

    return {
      x: xStart,
      y: yStart,
      w: renderableWidth,
      h: renderableHeight
    };
  }

  setImageUrl(url) {
    const { centerX, centerY, width, height, context } = this;
    if (!width || !height) {
      return;
    }
    this.clear(width, height, context);
    this.drawText(context, centerX, centerY);

    const img = new Image();
    img.onload = function() {
      let _this = this;
      _this.clear(width, height, context);
      _this.image.coordinate = _this.drawImage(width, height, img, context);
    }.bind(this);
    img.src = url;

    this.image = { value: img, path: url };
  }
}

export default CanvasView;

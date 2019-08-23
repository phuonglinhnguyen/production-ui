import CanvasImage from "./canvas_image";

class CanvasLayoutDefinition extends CanvasImage {
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

      context.drawImage(this.image.value, 0, 0);
    } catch (error) {
      console.log(error);
    }
    context.restore();
  }

  setImageUrl(url, callback) {
    const { centerX, centerY, width, height, context } = this;
    if (!width || !height) {
      return;
    }
    this.clear(width, height, context);   
    this.drawText(context, centerX, centerY);

    const img = new Image();
    img.onload = function() {
      const matrix = this.checkWidthHeightCanvasWithImage(
        img.width,
        img.height
      );

      if (callback) {
        callback(matrix);
      }
      context.drawImage(img, 0, 0);
    }.bind(this);
    img.src = url;

    this.image = { value: img, path: url };
  }
}

export default CanvasLayoutDefinition;

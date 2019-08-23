import Canvas from "../canvas";
import _ from "lodash";

class CanvasImage extends Canvas {
  setProps(props, callback) {
    const {
      widthCanvas: w,
      heightCanvas: h,
      imageUrl,
      coordinate_focus
    } = props;

    const { width, height, context, image } = this;
    if (w === 0 || h === 0) {
      return;
    }

    let update_w_h = width !== w || height !== h;
    let update_img = update_w_h;

    if (!_.isEqual(this.coordinate_focus, coordinate_focus)) {
      this.coordinate_focus = coordinate_focus;
      update_img = true;
    }

    if (!update_img) {
      if (image) {
        if (image.path !== imageUrl) {
          update_img = true;
        }
      } else if (imageUrl) {
        update_img = true;
      }
    }
    if (update_w_h || update_img) {
      this.resetTransform(context);

      if (update_w_h) {
        this.setWidthHeight(w, h);
        this.calCoordinateCenter(w, h);
      }

      if (update_img) {
        this.setImageUrl(imageUrl, callback);
      }
    } else {
      if (callback) {
        callback();
      }
    }
  }

  onMouseDown(event) {
    const { clientX, clientY } = event;

    this.updateCoordinateAfterClick(clientX, clientY);
  }

  onMouseMove(event) {
    const { clientX, clientY } = event;

    if (this.drag) {
      this.updateCoordinateAfterMoveDrag(clientX, clientY);
      this.redrawImage();
    } else {
      this.updateCoordinateAfterMove(clientX, clientY);
    }
  }

  onMouseWheel(event, delta, is_center) {
    if (delta) {
      const { centerX, centerY, lastX, lastY, context } = this;

      let x, y;
      if (is_center) {
        x = centerX;
        y = centerY;
      } else {
        if (!lastX && !lastY) {
          const { clientX, clientY } = event;
          this.updateCoordinateAfterMove(clientX, clientY);
        }
        x = lastX;
        y = lastY;
      }

      this.updateCoordinateAfterZoom(context, delta, x, y);
      this.redrawImage();
    }
  }

  onMouseUp() {
    this.drag = null;
    this.updateStyleCursor("auto");
  }

  rotateLeft(value) {
    let { rotate = 0 } = this;
    this.rotate = rotate - value;

    this.redrawImage();
  }

  rotateRight(value) {
    let { rotate = 0 } = this;
    this.rotate = rotate + value;

    this.redrawImage();
  }

  resetProps() {
    this.resetTransform();
    this.redrawImage();
  }
}

export default CanvasImage;

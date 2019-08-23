import Canvas from "../canvas";
import Corners from "../corner";
import Shape from "../shape";
import { BoxCornerSize } from "../../constants";

class CanvasView extends Canvas {
  /**
   * Set value
   */
  setProps(props) {
    try {
      const {
        widthCanvas: w,
        heightCanvas: h,
        matrix,
        draw: is_draw_by_mouse,
        select_shape: shape_selected,
        shapes = []
      } = props;
      const { width, height, context } = this;
      if (matrix) {
        this.clear(width, height, context);
        
        context.setTransform(
          matrix.a,
          matrix.b,
          matrix.c,
          matrix.d,
          matrix.e,
          matrix.f
        );
        this.matrix = matrix;
      }
  
      if (w === 0 || h === 0) {
        return;
      }
  
      let update_w_h = width !== w || height !== h;
  
      if (update_w_h) {
        this.resetTransform(context);
  
        if (update_w_h) {
          this.setWidthHeight(w, h);
          this.calCoordinateCenter(w, h);
        }
      }
      this.expect_resize = -1;
      this.is_support_draw = true;
      this.is_draw_by_mouse = is_draw_by_mouse || is_draw_by_mouse;
  
      this.setShapes(shape_selected, shapes);
      this.drawMultipleRectangle(shape_selected, shapes);
    } catch (error) {
      console.log(error)
    }
  }

  setShapes(shape_selected, shapes) {
    this.shape_selected = shape_selected;
    this.shapes = shapes;
  }

  /*
  * Draw
  */
  reDrawMultipleRectangle() {
    const { shapes, shape_selected } = this;
    this.drawMultipleRectangle(shape_selected, shapes);
  }

  drawMultipleRectangle(shape_selected, shapes) {
    const { width, height, context } = this;
    
    // Clear the entire canvas
    this.clear(width, height, context);

    // // 
    // draw all shapes 
    const l = shapes.length; 
    if (l > 0) { 
      for (let i = 0; i < l; i++) { 
        shapes[i].draw(context, shape_selected); 
      } 
    } 
  }

  drawOneRectangle(x, y, w, h, context) {
    context.strokeStyle = "#1e90ff";
    context.strokeRect(x, y, w, h);

    const y_corner = y + h;
    const x_corner = x + w;
    context.strokeStyle = "rgba(0,0,230,0.4)";
    context.lineWidth = 0.7;
    context.beginPath();
    context.moveTo(0, y_corner + 0.7);
    context.lineTo(this.width, y_corner + 0.7);
    context.stroke();

    context.beginPath();
    context.moveTo(x_corner + 0.5, 0);
    context.lineTo(x_corner + 0.5, this.height);
    context.stroke();

    return new Shape(x, y, w, h);
  }

  getCoordinateWhenDrawAndMove(
    clientX,
    clientY,
    canvasTop,
    canvasLeft,
    context
  ) {
    this.updateStyleCursor("crosshair");

    const matrix = context.getTransform();
    let x = (Math.min(clientX - canvasLeft, this.startX) - matrix.e) / matrix.a;
    let y = (Math.min(clientY - canvasTop, this.startY) - matrix.f) / matrix.a;
    let w = Math.abs(clientX - canvasLeft - this.startX) / matrix.a;
    let h = Math.abs(clientY - canvasTop - this.startY) / matrix.a;

    if (!w || !h) {
      return null;
    }
    return { x, y, w, h };
  }
  /**
   *  Get Rectangle when mouse click 
   */
  getRectangleByXY(clientX, clientY) {
    const { x, y } = this.getCoordinateRealMouseInCanvas(clientX, clientY);
    const { shapes } = this;
    var length = shapes.length;
    for (var i = length - 1; i >= 0; i--) {
      if (shapes[i].contains(x, y)) {
        var shape = shapes[i];
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)

        this.coordinate_shape_dragging = {
          dragoffx: x - shape.x,
          dragoffy: y - shape.y
        };

        return { index: i, shape: shape };
      }
    }

    return null;
  }

  /**
   * Drag shape
   */
  dragRectangle(x, y, shape_selected, coordinate_shape_dragging) {
    shape_selected.x = x - coordinate_shape_dragging.dragoffx;
    shape_selected.y = y - coordinate_shape_dragging.dragoffy;

    this.reDrawMultipleRectangle();
  }

  /**
   * Resize shape
   */
  resizeShape(x, y, expect_resize, shape_selected) {
    // time ro resize!
    var oldx = shape_selected.x;
    var oldy = shape_selected.y;

    // 0  #  1
    // #     #
    // 3  #  2
    switch (expect_resize) {
      case 0:
        shape_selected.x = x;
        shape_selected.y = y;
        shape_selected.w += oldx - x;
        shape_selected.h += oldy - y;
        break;
      case 1:
        shape_selected.y = y;
        shape_selected.w = x - oldx;
        shape_selected.h += oldy - y;
        break;
      case 2:
        shape_selected.w = x - oldx;
        shape_selected.h = y - oldy;
        break;
      default:
        shape_selected.x = x;
        shape_selected.w += oldx - x;
        shape_selected.h = y - oldy;
        break;
    }

    this.reDrawMultipleRectangle();
  }

  checkRectangle(rectangle) {
    if (rectangle.w < 0) {
      rectangle.w = -rectangle.w;
      rectangle.x = rectangle.x - rectangle.w;
    }
    if (rectangle.h < 0) {
      rectangle.h = -rectangle.h;
      rectangle.y = rectangle.y - rectangle.h;
    }

    return rectangle;
  }

  /**
   * Event mouse
   */

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
      this.reDrawMultipleRectangle();
    }
  }

  onMouseUp(callback_update_size_shape) {
    this.updateStyleCursor("auto");

    const { shape_selected, new_rectangle } = this;
    if (shape_selected) {
      this.checkRectangle(shape_selected);
      callback_update_size_shape(this.is_drawing, shape_selected);
    } else if (new_rectangle) {
      this.checkRectangle(new_rectangle);
      callback_update_size_shape(this.is_drawing, new_rectangle);
    }

    this.drag = null;
    this.is_drawing = false;
    this.is_resize_drag = false;
    this.expect_resize = -1;
    this.new_rectangle = null;
    this.coordinate_shape_dragging = null;
  }

  /**
   * css cursor when mouse hove on rectangle
   */
  getStyleCursor(x, y, canvas) {
    this.expect_resize = this.getPositionBoxCorner(x, y, Corners, canvas);
    if (this.expect_resize !== -1) {
      return;
    }

    // not over a select_shape box, return to normal
    this.is_resize_drag = false;
    this.updateStyleCursor("auto");
  }

  getPositionBoxCorner(x, y, Corners, canvas) {
    // if there's a selection see if we grabbed one of the selection handles
    for (var i = 0; i < 4; i++) {
      // 0  #  1
      // #     #
      // 3  #  2

      var cur = Corners[i];

      // we dont need to use the ghost context because
      // selection handles will always be rectangles
      if (
        x >= cur.x &&
        x <= cur.x + BoxCornerSize &&
        y >= cur.y &&
        y <= cur.y + BoxCornerSize
      ) {
        // we found one!
        switch (i) {
          case 0:
            canvas.style.cursor = "nw-resize";
            break;
          case 1:
            canvas.style.cursor = "ne-resize";
            break;
          case 2:
            canvas.style.cursor = "se-resize";
            break;
          default:
            canvas.style.cursor = "sw-resize";
            break;
        }

        return i;
      }
    }

    return -1;
  }

  rotateLeft(value) {
    let { rotate = 0 } = this;
    this.rotate = rotate - value;
  }

  rotateRight(value) {
    let { rotate = 0 } = this;
    this.rotate = rotate + value;
  }

  resetProps() {
    this.resetTransform();
    this.reDrawMultipleRectangle();
  }
}

export default CanvasView;

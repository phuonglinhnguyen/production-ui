import CanvasView from "../image/canvas_layout";
import CanvasDrawDrag from "../draw/canvas_draw_drag";

class CanvasLayoutDefinition {
  constructor(canvas_image, canvas_rect) {
    let canvases = [];

    canvases.push(new CanvasDrawDrag(canvas_rect));
    canvases.push(new CanvasView(canvas_image));

    this.canvases = canvases;
  }

  setProps(props) {
    this.canvases[1].setProps(props,
      matrix => {
        this.canvases[0].setProps({
          ...props,
          matrix
        });
      }
    );
  }

  onMouseWheel(event, delta, is_center) {
    this.canvases.forEach(function(canvas) {
      canvas.onMouseWheel(event, delta, is_center);
    });
  }

  onMouseDown(event, callback_selectshape) {
    let length = this.canvases.length;
    for (let index = 0; index < length; index++) {
      const is_stop = this.canvases[index].onMouseDown(
        event,
        callback_selectshape
      );
      if (is_stop) {
        break;
      }
    }
  }

  drawRectangle(clientX, clientY, canvas_rect) {
    // draw rectangle
    const { canvasTop, canvasLeft, context } = canvas_rect;

    const rectangle = canvas_rect.getCoordinateWhenDrawAndMove(
      clientX,
      clientY,
      canvasTop,
      canvasLeft,
      context
    );

    if (!rectangle) {
      return null;
    }

    canvas_rect.reDrawMultipleRectangle();
    const new_rectangle = canvas_rect.drawOneRectangle(
      rectangle.x,
      rectangle.y,
      rectangle.w,
      rectangle.h,
      context
    );
    canvas_rect.new_rectangle = new_rectangle;
  }

  onMouseMove(event) {
    const canvas_rect = this.canvases[0];

    if (canvas_rect.is_drawing) {
      return this.drawRectangle(event.clientX, event.clientY, canvas_rect);
    }

    let length = this.canvases.length;
    for (let index = 0; index < length; index++) {
      const is_stop = this.canvases[index].onMouseMove(event);
      if (is_stop) {
        break;
      }
    }
  }

  onMouseUp(event, callback) {
    this.canvases.forEach(function(canvas) {
      canvas.onMouseUp(event, callback);
    });
  }

  resetProps() {
    this.canvases.forEach(function(canvas) {
      canvas.resetProps();
    });
  }
}

export default CanvasLayoutDefinition;

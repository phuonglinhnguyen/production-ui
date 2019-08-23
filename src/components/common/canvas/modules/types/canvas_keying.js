import CanvasView from "../image/canvas_layout";
import CanvasDraw from "../draw/canvas_draw";
import Shape from "../shape";

class CanvasKeying {
  constructor(canvas_image, canvas_rect) {
    let canvases = [];

    canvases.push(new CanvasDraw(canvas_rect));
    canvases.push(new CanvasView(canvas_image));

    this.canvases = canvases;
  }

  setProps(props) {
    if (props.shapes) {
      const l = props.shapes.length;
      for (let index = 0; index < l; index++) {
        let s = props.shapes[index];
        props.shapes[index] = new Shape(s.x, s.y, s.w, s.h);
      }
    }

    this.canvases[1].setProps(props, matrix => {
      this.canvases[0].setProps({
        ...props,
        matrix
      });
    });
  }

  onMouseWheel(event, delta, is_center) {
    this.canvases.forEach(function(canvas) {
      canvas.onMouseWheel(event, delta, is_center);
    });
  }

  onMouseDown(event, callback_selectshape) {
    for (let index = 0; index < this.canvases.length; index++) {
      this.canvases[index].onMouseDown(event, callback_selectshape);
    }
  }

  onMouseMove(event) {
    for (let index = 0; index < this.canvases.length; index++) {
      this.canvases[index].onMouseMove(event);
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

export default CanvasKeying;

import CanvasView from "../image/canvas_layout";
import CanvasDraw from "../draw/canvas_draw";

class CanvasOMR {
  constructor(canvas_image, canvas_rect) {
    let canvases = [];

    let canvas_draw = new CanvasDraw(canvas_rect);

    canvas_draw.drawMultipleRectangle = function(shape_selected, section) {
      try {
        const { width, height, context } = this;
        // Clear the entire canvas
        this.clear(width, height, context);

        // draw all shapes
        let fields = section.fields;
        let fields_length = fields.length;
        for (let j = 0; j < fields_length; j++) {
          let argument_details = fields[j].argument_details;
          let argument_details_length = argument_details.length;
          for (let k = 0; k < argument_details_length; k++) {
            argument_details[k].shape.draw(context);
          }
        }
        section.shape.draw(context);
      } catch (error) {
        console.log(error);
      }
    };

    canvas_draw.getRectangleByXY = function(clientX, clientY) {
      const { x, y } = this.getCoordinateRealMouseInCanvas(clientX, clientY);
      const { shapes } = this;

      try {
        let fields = shapes.fields;
        let fields_length = fields.length;
        for (let j = 0; j < fields_length; j++) {
          let argument_details = fields[j].argument_details;
          let argument_details_length = argument_details.length;
          for (let k = 0; k < argument_details_length; k++) {
            const argument_detail = argument_details[k];
            const shape = argument_detail.shape;
            if (shape.contains(x, y)) {
              return {
                field_index: j,
                value_index: k,
                checked: !shape.checked
              };
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
      return null;
    };

    canvases.push(canvas_draw);
    canvases.push(new CanvasView(canvas_image));

    this.canvases = canvases;
  }

  setProps(props) {
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
    let length = this.canvases.length;
    for (let index = 0; index < length; index++) {
      this.canvases[index].onMouseDown(event, callback_selectshape);
    }
  }

  onMouseMove(event) {
    let length = this.canvases.length;
    for (let index = 0; index < length; index++) {
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

export default CanvasOMR;

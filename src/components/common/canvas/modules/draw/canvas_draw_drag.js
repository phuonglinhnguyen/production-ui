import Canvas from "./canvas_rectangle";

class CanvasDrawDrag extends Canvas {
   /**
   * Event mouse
   */
  onMouseDown(event, callback_selectshape) {
    const { expect_resize } = this;

    if (expect_resize && expect_resize !== -1) {
      this.is_resize_drag = true;
      return true;
    }

    const { clientX, clientY, ctrlKey } = event;
    this.updateCoordinateAfterClick(clientX, clientY);

    if (callback_selectshape) {
      const select = this.getRectangleByXY(clientX, clientY);
      if (!ctrlKey) {
        if (select) {
          callback_selectshape(select.index, select.shape);

          return;
        }
      }

      // havent returned means we have failed to select anything.
      // If there was an object selected, we deselect it
      callback_selectshape(-1, null);
    }

    if (this.is_support_draw && ctrlKey) {
      this.is_drawing = true;
    }

    return false;
  }
  
  onMouseMove(event) {
    const { clientX, clientY } = event;

    const {
      is_resize_drag,
      expect_resize,
      shape_selected,
      coordinate_shape_dragging,
      canvas
    } = this;

    if (shape_selected) {
      const { x, y } = this.getCoordinateRealMouseInCanvas(clientX, clientY);

      if (coordinate_shape_dragging || is_resize_drag) {
        if (coordinate_shape_dragging) {
          this.dragRectangle(x, y, shape_selected, coordinate_shape_dragging);
        } else {
          this.resizeShape(x, y, expect_resize, shape_selected);
        }
      } else {
        this.getStyleCursor(x, y, canvas);
      }
      return true;
    }

    if (this.drag) {
      this.updateCoordinateAfterMoveDrag(clientX, clientY);
      this.reDrawMultipleRectangle();
    } else {
      this.updateCoordinateAfterMove(clientX, clientY);
    }
    return false;
  }
}

export default CanvasDrawDrag;

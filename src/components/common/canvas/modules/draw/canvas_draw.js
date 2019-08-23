import Canvas from "./canvas_rectangle";

class CanvasDraw extends Canvas {
  /**
   * Event mouse
   */
  onMouseDown(event, callback_selectshape) {
    const { clientX, clientY, ctrlKey } = event;
    this.updateCoordinateAfterClick(clientX, clientY);

    if (callback_selectshape) {
      const select = this.getRectangleByXY(clientX, clientY);
      if (!ctrlKey) {
        if (select) {
          callback_selectshape(select);
          return true;
        }
      }

      // havent returned means we have failed to select anything.
      // If there was an object selected, we deselect it
      callback_selectshape(-1);
    }

    return false;
  }

  onMouseMove(event) {
    const { clientX, clientY } = event;

    if (this.coordinate_shape_dragging) {
      return;
    }

    if (this.drag) {
      this.updateCoordinateAfterMoveDrag(clientX, clientY);
      this.reDrawMultipleRectangle();
    } else {
      this.updateCoordinateAfterMove(clientX, clientY);
    }
  }
}

export default CanvasDraw;

import CanvasClassify from "./canvas_classify";
import CanvasKeying from "./canvas_keying";
import CanvasLayoutDefinition from "./canvas_layout";
import CanvasOMR from "./canvas_omr";

class CanvasView {
  constructor(type, canvas_image, canvas_rect) {
    if (type === "classify") {
      return new CanvasClassify(canvas_image);
    } else if (type === "layout_definition") {
      return new CanvasLayoutDefinition(canvas_image, canvas_rect);
    } else if (type === "omr") {
      return new CanvasOMR(canvas_image, canvas_rect);
    } else {
      return new CanvasKeying(canvas_image, canvas_rect);
    }
  }
}

export default CanvasView;

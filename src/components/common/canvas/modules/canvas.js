class Canvas {
  constructor(canvas) {
    const { width, height } = canvas;

    const context = canvas.getContext("2d");
    const { top, left } = canvas.getBoundingClientRect();

    this.canvas = canvas;
    this.context = context;
    this.canvasTop = top;
    this.canvasLeft = left;
    this.trackTransforms(context);

    this.setWidthHeight(width, height);
    this.calCoordinateCenter(width, height);
  }

  setWidthHeight(w, h) {
    this.width = w;
    this.height = h;
  }

  checkWidthHeightCanvasWithImage(wImage, hImage) {
    const { width, height, context, coordinate_focus } = this;
    if (coordinate_focus) {
      context.setTransform(1, 0, 0, 1, 0, 0);

      const x = width / 2 - (coordinate_focus.x + coordinate_focus.w / 2);
      const y = height / 2 - (coordinate_focus.y + coordinate_focus.h / 2);

      context.translate(x, y);
      if (coordinate_focus.w > width || coordinate_focus.h > height) {
        let factor1 = width / (coordinate_focus.w + 6);
        let factor2 = height / (coordinate_focus.h + 6);

        let factor = Math.min(factor1, factor2);
        let pt = context.transformedPoint(this.centerX, this.centerY);
        context.translate(pt.x, pt.y);
        context.scale(factor, factor);
        context.translate(-pt.x, -pt.y);
      }
    } else {
      const x = (width - wImage) / 2;
      const y = (height - hImage) / 2;

      context.setTransform(1, 0, 0, 1, x, y);
      if (x < 0 || y < 0) {
        let pt = context.transformedPoint(this.centerX, this.centerY);
        let factor = Math.pow(/*scaleFactor*/ 1.1, -1);
        while (true) {
          context.translate(pt.x, pt.y);
          context.scale(factor, factor);
          context.translate(-pt.x, -pt.y);
          const { e, f } = context.getTransform();
          if (e > 0 && f > 0) {
            break;
          }
        }
      }
    }

    this.matrix = context.getTransform();

    return context.getTransform();
  }

  /*
  * Event
  * Reset, clickDown, Zoom, Drag
  */
  clear(width, height, context) {
    const p1 = context.transformedPoint(0, 0);
    const p2 = context.transformedPoint(width, height);

    context.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
  }

  updateCoordinateAfterClick(clientX, clientY) {
    const { context } = this;
    const { x, y } = this.getCoordinateMouseInCanvas(clientX, clientY);
    this.drag = context.transformedPoint(x, y);
    this.startX = x;
    this.startY = y;
    this.updateStyleCursor("pointer");
  }

  updateCoordinateAfterZoom(context, delta, x, y) {
    var pt = context.transformedPoint(x || this.lastX, y || this.lastY);
    var factor = Math.pow(/*scaleFactor*/ 1.1, delta);
    context.translate(pt.x, pt.y);
    context.scale(factor, factor);
    context.translate(-pt.x, -pt.y);
  }

  updateCoordinateAfterMoveDrag(clientX, clientY) {
    const { drag, context } = this;
    const { x, y } = this.getCoordinateMouseInCanvas(clientX, clientY);
    const point = context.transformedPoint(x, y);
    context.translate(point.x - drag.x, point.y - drag.y);

    this.lastX = x;
    this.lastY = y;
  }

  updateCoordinateAfterMove(clientX, clientY) {
    const { x, y } = this.getCoordinateMouseInCanvas(clientX, clientY);
    this.lastX = x;
    this.lastY = y;
  }

  /**
   * Style cursor
   */
  updateStyleCursor(type) {
    this.canvas.style.cursor = type;
  }

  /**
   * Draw
   * Draw Text
   */
  drawText(context, x, y) {
    context.fillStyle = "#FFFFFF";
    context.font = "16px sans-serif";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText("Loading...", x, y);
  }

  /**
   * Coordinate
   */
  calCoordinateCenter = (w, h) => {
    this.centerX = w / 2;
    this.centerY = h / 2;
  };

  calCoordinate(xMouse, yMouse, xBounding, yBounding) {
    return {
      x: xMouse - xBounding,
      y: yMouse - yBounding
    };
  }

  getCoordinateMouseInCanvas(clientX, clientY) {
    const { canvasTop, canvasLeft } = this;

    return this.calCoordinate(clientX, clientY, canvasLeft, canvasTop);
  }

  getCoordinateRealMouseInCanvas(clientX, clientY) {
    const matrix = this.context.getTransform();
    const { canvasTop, canvasLeft } = this;

    const x = (clientX - canvasLeft - matrix.e) / matrix.a;
    const y = (clientY - canvasTop - matrix.f) / matrix.a;

    return { x, y };
  }

  /**
   * Matrix
   */
  resetTransform() {
    const { matrix, context } = this;
    if (matrix) {
      context.setTransform(
        matrix.a,
        matrix.b,
        matrix.c,
        matrix.d,
        matrix.e,
        matrix.f
      );
    } else {
      context.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  trackTransforms(context) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var xform = svg.createSVGMatrix();
    context.getTransform = function() {
      return xform;
    };

    var savedTransforms = [];
    var save = context.save;
    context.save = function() {
      savedTransforms.push(xform.translate(0, 0));
      return save.call(context);
    };
    var restore = context.restore;
    context.restore = function() {
      xform = savedTransforms.pop();
      return restore.call(context);
    };

    var scale = context.scale;
    context.scale = function(sx, sy) {
      xform = xform.scaleNonUniform(sx, sy);
      return scale.call(context, sx, sy);
    };
    var rotate = context.rotate;
    context.rotate = function(radians) {
      xform = xform.rotate(radians * 180 / Math.PI);
      return rotate.call(context, radians);
    };
    var translate = context.translate;
    context.translate = function(dx, dy) {
      xform = xform.translate(dx, dy);
      return translate.call(context, dx, dy);
    };
    var transform = context.transform;
    context.transform = function(a, b, c, d, e, f) {
      var m2 = svg.createSVGMatrix();
      m2.a = a;
      m2.b = b;
      m2.c = c;
      m2.d = d;
      m2.e = e;
      m2.f = f;
      xform = xform.multiply(m2);
      return transform.call(context, a, b, c, d, e, f);
    };
    var setTransform = context.setTransform;
    context.setTransform = function(a, b, c, d, e, f) {
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(context, a, b, c, d, e, f);
    };
    var pt = svg.createSVGPoint();
    context.transformedPoint = function(x, y) {
      pt.x = x;
      pt.y = y;
      return pt.matrixTransform(xform.inverse());
    };
  }
}
export default Canvas;

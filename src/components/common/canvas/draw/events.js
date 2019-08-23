import { BoxCornerSize } from "./constants";
import trackTransforms from "../draw/track_transforms";

export default function CanvasObject() {}

CanvasObject.prototype.setCanvas = function(canvas_rect, canvas_image, parent) {
  this.hide_rectangle = true;

  if (canvas_rect) {
    this.canvas_rect = canvas_rect;
    this.context_rect = canvas_rect.getContext("2d");
    trackTransforms(this.context_rect);
    this.hide_rectangle = false;
  }

  this.canvas_image = canvas_image;
  this.context_image = canvas_image.getContext("2d");
  trackTransforms(this.context_image);

  this.parent = parent;
  this.rect = canvas_image.getBoundingClientRect();
  this.shape_copy = null;
  this.width = canvas_image.width;
  this.height = canvas_image.height;
  this.centerX = canvas_image.width / 2;
  this.centerY = canvas_image.height / 2;
  this.rotate = 0;
  this.expectResize = -1;
  this.isResizeDrag = false;

  this.dragStart = null;
  this.dragoffx = 0;
  this.dragoffy = 0;
  this.dragging = false;
};

CanvasObject.prototype.setWidthHeight = function(width, height) {
  this.width = width;
  this.height = height;
  this.centerX = width / 2;
  this.centerY = height / 2;

  this.resetZoomRotate();
};

CanvasObject.prototype.setShapes = function(select_shape, shapes = []) {
  this.select_shape = select_shape;
  this.shapes = shapes;
};

CanvasObject.prototype.setImage = function(url) {
  const {
    centerX,
    centerY,
    width,
    height,
    canvas_image,
    context_image,
    hide_rectangle
  } = this;
  this.clearRect(context_image);

  if (width < 1 || height < 1 || !url) {
    return;
  }

  const imageObj = new Image();

  const that = this;

  context_image.fillStyle = "#FFFFFF";
  context_image.font = "16px sans-serif";
  context_image.textBaseline = "middle";
  context_image.textAlign = "center";
  context_image.fillText("Loading...", centerX, centerY);

  imageObj.onload = function() {
    setTimeout(function() {
      that.clearRect(context_image);

      if (!hide_rectangle) {
        context_image.drawImage(imageObj, 0, 0);
        return;
      }

      var imageAspectRatio = imageObj.width / imageObj.height;
      var canvas_imageAspectRatio = canvas_image.width / canvas_image.height;
      var renderableHeight, renderableWidth, xStart, yStart;

      // If image's aspect ratio is less than canvas_image's we fit on height
      // and place the image centrally along width
      if (imageAspectRatio < canvas_imageAspectRatio) {
        renderableHeight = canvas_image.height;
        renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
        xStart = (canvas_image.width - renderableWidth) / 2;
        yStart = 0;
      } else if (imageAspectRatio > canvas_imageAspectRatio) {
        // If image's aspect ratio is greater than canvas_image's we fit on width
        // and place the image centrally along height
        renderableWidth = canvas_image.width;
        renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
        xStart = 0;
        yStart = (canvas_image.height - renderableHeight) / 2;
      } else {
        // Happy path - keep aspect ratio
        renderableHeight = canvas_image.height;
        renderableWidth = canvas_image.width;
        xStart = 0;
        yStart = 0;
      }
      that.xStart = xStart;
      that.yStart = yStart;
      that.renderableWidth = renderableWidth;
      that.renderableHeight = renderableHeight;

      context_image.drawImage(
        imageObj,
        xStart,
        yStart,
        renderableWidth,
        renderableHeight
      );
    }, 0);
  };

  imageObj.src = url;

  this.imageObj = imageObj;
};

CanvasObject.prototype.setPropMouseUp = function(ev) {
  this.x0 = ev.clientX - this.rect.left;
  this.y0 = ev.clientY - this.rect.top;
};

CanvasObject.prototype.setCoordinatesWhenMouseDown = function(ev) {
  if (this.hide_rectangle) {
    this.canvas_image.style.cursor = "pointer";
  } else {
    this.canvas_rect.style.cursor = "pointer";
  }

  this.x0 = ev.clientX - this.rect.left;
  this.y0 = ev.clientY - this.rect.top;
};

CanvasObject.prototype.setCoordinatesWhenMouseMove = function(ev) {
  this.lastX = ev.clientX - this.rect.left;
  this.lastY = ev.clientY - this.rect.top;
};

CanvasObject.prototype.setPropsWhenMouseUp = function() {
  this.isResizeDrag = false;
  this.expectResize = -1;
  this.dragStart = null;
  this.dragging = false;

  if (this.hide_rectangle) {
    this.canvas_image.style.cursor = "auto";
  } else {
    this.canvas_rect.style.cursor = "auto";
  }
};

CanvasObject.prototype.getRectWhenDrawAndMove = function(ev) {
  this.canvas_rect.style.cursor = "crosshair";

  const matrix = this.getMatrix();
  const rect = this.rect;
  const parent = this.parent;

  let x =
    (Math.min(ev.clientX - rect.left, this.x0) - matrix.e) / matrix.a +
    parent.scrollLeft;
  let y =
    (Math.min(ev.clientY - rect.top, this.y0) - matrix.f) / matrix.a +
    parent.scrollTop;
  let w = Math.abs(ev.clientX - rect.left - this.x0) / matrix.a;
  let h = Math.abs(ev.clientY - rect.top - this.y0) / matrix.a;

  if (!w || !h) {
    return null;
  }

  return { x, y, w, h };
};

CanvasObject.prototype.beginDrag = function(ev) {
  const context = this.hide_rectangle ? this.context_image : this.context_rect;
  this.dragStart = context.transformedPoint(this.x0, this.y0);

  const mouse = this.getMouse(ev);
  const shapes = this.shapes || [];

  var l = shapes.length;
  for (var i = l - 1; i >= 0; i--) {
    if (shapes[i].contains(mouse.x, mouse.y)) {
      var shape = shapes[i];
      // Keep track of where in the object we clicked
      // so we can move it smoothly (see mousemove)

      this.dragging = true;
      this.dragoffx = mouse.x - shape.x;
      this.dragoffy = mouse.y - shape.y;

      return { index: i, shape: shape };
    }
  }

  return null;
};

CanvasObject.prototype.startDragRect = function(x, y) {
  this.select_shape.x = x - this.dragoffx;
  this.select_shape.y = y - this.dragoffy;
  if (!this.hide_rectangle) {
    this.redrawRect();
  }
};

CanvasObject.prototype.startDragImage = function(ev) {
  if (this.dragStart) {
    var pt = this.context_image.transformedPoint(this.lastX, this.lastY);
    this.context_image.translate(
      pt.x - this.dragStart.x,
      pt.y - this.dragStart.y
    );

    this.redrawImage();

    if (!this.hide_rectangle) {
      pt = this.context_rect.transformedPoint(this.lastX, this.lastY);
      this.context_rect.translate(
        pt.x - this.dragStart.x,
        pt.y - this.dragStart.y
      );

      this.redrawRect();
    }
  }
};

CanvasObject.prototype.setPropZoomRect = function(delta, x, y) {
  const context_rect = this.context_rect;

  var pt = context_rect.transformedPoint(x || this.lastX, y || this.lastY);
  var factor = Math.pow(/*scaleFactor*/ 1.1, delta);
  context_rect.translate(pt.x, pt.y);

  context_rect.scale(factor, factor);
  context_rect.translate(-pt.x, -pt.y);

  this.redrawRect();
};

CanvasObject.prototype.setPropZoomImage = function(delta, x, y) {
  const context_image = this.context_image;
  var pt = context_image.transformedPoint(x || this.lastX, y || this.lastY);
  var factor = Math.pow(/*scaleFactor*/ 1.1, delta);
  context_image.translate(pt.x, pt.y);

  context_image.scale(factor, factor);
  context_image.translate(-pt.x, -pt.y);

  this.redrawImage();
};

CanvasObject.prototype.clearRect = function(context_rect) {
  const p1 = context_rect.transformedPoint(0, 0);
  const p2 = context_rect.transformedPoint(this.width, this.height);

  context_rect.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
};

CanvasObject.prototype.drawRect = function(x, y, w, h) {
  const context_rect = this.context_rect;

  context_rect.strokeStyle = "#1e90ff";
  context_rect.strokeRect(x, y, w, h);

  const y_corner = y + h;
  const x_corner = x + w;
  context_rect.strokeStyle = "rgba(0,0,230,0.4)";
  context_rect.lineWidth = 0.7;
  context_rect.beginPath();
  context_rect.moveTo(0, y_corner + 0.7);
  context_rect.lineTo(this.width, y_corner + 0.7);
  context_rect.stroke();

  context_rect.beginPath();
  context_rect.moveTo(x_corner + 0.5, 0);
  context_rect.lineTo(x_corner + 0.5, this.height);
  context_rect.stroke();
};

CanvasObject.prototype.redrawRect = function() {
  const context_rect = this.context_rect;

  // Clear the entire canvas_rect
  this.clearRect(context_rect);

  // draw all shapes
  const shapes = this.shapes || [];
  const select_shape = this.select_shape;

  const l = shapes.length;
  if (l > 0) {
    for (let i = 0; i < l; i++) {
      shapes[i].draw(context_rect, select_shape);
    }
  }
};

CanvasObject.prototype.redrawImage = function() {
  if (!this.imageObj) {
    return;
  }

  const context_image = this.context_image;

  // Clear the entire canvas_rect
  this.clearRect(context_image);

  context_image.save();
  try {
    if (this.rotate !== 0) {
      context_image.translate(this.centerX, this.centerY);
      context_image.rotate(this.rotate * Math.PI / 180);
      context_image.translate(-this.centerX, -this.centerY);
    }

    if (this.hide_rectangle) {
      context_image.drawImage(
        this.imageObj,
        this.xStart,
        this.yStart,
        this.renderableWidth,
        this.renderableHeight
      );
    } else {
      context_image.drawImage(this.imageObj, 0, 0);
    }
  } catch (error) {
    console.log(error);
  }

  context_image.restore();
};

CanvasObject.prototype.rotateLeft = function(rotate) {
  this.rotate -= rotate;

  this.redrawImage();
};

CanvasObject.prototype.rotateRight = function(rotate) {
  this.rotate += rotate;

  this.redrawImage();
};

CanvasObject.prototype.resetZoomRotate = function() {
  if (this.context_rect) {
    this.context_rect.setTransform(1, 0, 0, 1, 0, 0);
    this.redrawRect();
  }

  if (this.context_image) {
    this.rotate = 0;
    this.context_image.setTransform(1, 0, 0, 1, 0, 0);
    this.redrawImage();
  }
};

CanvasObject.prototype.getMatrix = function() {
  return this.hide_rectangle
    ? this.context_image.getTransform()
    : this.context_rect.getTransform();
};

CanvasObject.prototype.getMouse = function(ev) {
  const matrix = this.getMatrix();
  const parent = this.parent;
  const rect = this.rect;

  const x = (ev.clientX - rect.left - matrix.e) / matrix.a + parent.scrollLeft;
  const y = (ev.clientY - rect.top - matrix.f) / matrix.a + parent.scrollTop;

  return { x: x, y: y };
};

CanvasObject.prototype.resizeShape = function(x, y) {
  const shape = this.select_shape;
  const expectResize = this.expectResize;

  // time ro resize!
  var oldx = shape.x;
  var oldy = shape.y;

  // 0  #  1
  // #     #
  // 3  #  2
  switch (expectResize) {
    case 0:
      shape.x = x;
      shape.y = y;
      shape.w += oldx - x;
      shape.h += oldy - y;

      break;
    case 1:
      shape.y = y;
      shape.w = x - oldx;
      shape.h += oldy - y;
      break;
    case 2:
      shape.w = x - oldx;
      shape.h = y - oldy;
      break;
    default:
      shape.x = x;
      shape.w += oldx - x;
      shape.h = y - oldy;
      break;
  }

  this.redrawRect();
};

CanvasObject.prototype.getStyleCursor = function(x, y, Corners) {
  this.expectResize = this.getPositionBoxCorner(x, y, Corners);
  if (this.expectResize !== -1) {
    return;
  }

  // not over a select_shape box, return to normal
  this.isResizeDrag = false;
  this.canvas_rect.style.cursor = "auto";
};

CanvasObject.prototype.getPositionBoxCorner = function(x, y, Corners) {
  const canvas_rect = this.canvas_rect;

  // if there's a selection see if we grabbed one of the selection handles
  for (var i = 0; i < 4; i++) {
    // 0  #  1
    // #     #
    // 3  #  2

    var cur = Corners[i];

    // we dont need to use the ghost context_rect because
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
          canvas_rect.style.cursor = "nw-resize";
          break;
        case 1:
          canvas_rect.style.cursor = "ne-resize";
          break;
        case 2:
          canvas_rect.style.cursor = "se-resize";
          break;
        default:
          canvas_rect.style.cursor = "sw-resize";
          break;
      }

      return i;
    }
  }

  return -1;
};

import Corners from "./corner";
import { BoxCornerSize } from "../constants";

export default function Shape(x, y, w, h, t) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // 'x || 0' just means 'if there is a value for x, use that. Otherwise use 0.'
  // But we aren't checking anything else! We could put 'Lalala' for the value of x
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.t = t || "";
}

// Draws this shape to a given context
Shape.prototype.draw = function(context, selection) {
  wrapText(
    context,
    this.t,
    this.x + this.w / 2,
    this.y + this.h / 2,
    this.w,
    25
  );

  // draw selection
  // this is a stroke along the box and also 8 new selection handles
  if (selection && this === selection) {
    context.strokeStyle = "#ffff00";
    context.strokeRect(selection.x, selection.y, selection.w, selection.h);

    // draw the boxes

    var half = BoxCornerSize / 2;

    // 0  #  1
    // #     #
    // 3  #  2

    // top left, middle, right
    Corners[0].x = this.x - half;
    Corners[0].y = this.y - half;

    Corners[1].x = this.x + this.w - half;
    Corners[1].y = this.y - half;

    //bottom left, middle, right
    Corners[2].x = this.x + this.w - half;
    Corners[2].y = this.y + this.h - half;

    Corners[3].x = this.x - half;
    Corners[3].y = this.y + this.h - half;

    context.fillStyle = "#6a5acd";
    for (var i = 0; i < 4; i++) {
      var cur = Corners[i];

      context.fillRect(cur.x, cur.y, BoxCornerSize, BoxCornerSize);
    }
  } else {
    if (this.checked) {
      this.fillRectangle(context)
    }
    context.strokeStyle = "#FF1744";
    context.lineWidth = 6;
    context.strokeRect(this.x, this.y, this.w, this.h);
  }
};
// When click on shape
Shape.prototype.fillRectangle = function(context) {
  context.fillStyle = "rgba(244, 67, 54, 0.71)";
  context.fillRect(this.x, this.y, this.w, this.h);
};

Shape.prototype.clearRectangle = function(context) {

  context.clearRect(this.x, this.y, this.w, this.h);
};

// Determine if a point is inside the shape's bounds
Shape.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Width) and its Y and (Y + Height)
  return (
    this.x <= mx &&
    this.x + this.w >= mx &&
    this.y <= my &&
    this.y + this.h >= my
  );
};

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(" ");
  var line = "";

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + " ";
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillStyle = "#0000ff";
  context.font = "16px sans-serif";
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.fillText(line, x, y);
}

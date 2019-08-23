// import React from "react";
// import ReactDOM from "react-dom";
// import PropTypes from "prop-types";

// import Shape from "../../draw/module/shape";
// import Corners from "../../draw/module/corner";

// import ToolBar from "./canvas_tool_bar_component";

// import CanvasObject from "../events";

// import _ from "lodash";

// let canvasObject;

// class Canvas extends React.Component {
//   constructor(props) {
//     super(props);

//     this.onKeyPress = this.onKeyPress.bind(this);
//     this.handleScroll = this.handleScroll.bind(this);
//     this.onMouseDown = this.onMouseDown.bind(this);
//     this.onMouseMove = this.onMouseMove.bind(this);
//     this.onMouseUp = this.onMouseUp.bind(this);
//   }

//   draw(props, preprops, select_shape, shapes) {
//     const { startDraw, completeDraw } = this.props;

//     if (startDraw) {
//       startDraw();
//     }

//     let is_draw = true;

//     if (preprops) {
//       is_draw = false;

//       if (props.imageUrl !== preprops.imageUrl) {
//         is_draw = true;
//       }

//       if (
//         props.widthCanvas !== preprops.widthCanvas ||
//         props.heightCanvas !== preprops.heightCanvas
//       ) {
//         canvasObject.setWidthHeight(props.widthCanvas, props.heightCanvas);

//         is_draw = true;
//       }
//     }

//     if (is_draw) {
//       canvasObject.setImage(props.imageUrl);
//     }

//     canvasObject.setShapes(select_shape, shapes);
//     if (!this.props.hide_rectangle) {
//       canvasObject.redrawRect();
//     }

//     if (completeDraw) {
//       completeDraw();
//     }
//   }

//   createCanvas() {
//     const canvas_image = this.refs.canvas_image;
//     const canvas_rect = this.refs.canvas_rect;
//     if (!canvasObject) {
//       canvasObject = new CanvasObject();
//     }
//     canvasObject.setCanvas(
//       this.props.hide_rectangle ? null : canvas_rect,
//       canvas_image,
//       ReactDOM.findDOMNode(canvas_image).parentNode
//     );

//     this.draw(this.props, null, this.props.select_shape, this.props.shapes);

//     const canvas = this.props.hide_rectangle ? canvas_image : canvas_rect;
//     canvas.addEventListener("mousewheel", this.handleScroll, {
//       passive: true
//     });
//     canvas.addEventListener("mousedown", this.onMouseDown);
//     canvas.addEventListener("mousemove", this.onMouseMove);
//     canvas.addEventListener("mouseup", this.onMouseUp);

//     window.addEventListener("keydown", this.onKeyPress);
//   }

//   componentDidMount() {
//     this.createCanvas();
//   }

//   componentWillUnmount() {
//     canvasObject = null;

//     window.removeEventListener("keydown", this.onKeyPress);
//   }

//   shouldComponentUpdate(nextProps) {
//     if (!_.isEqual(this.props.select_shape, nextProps.select_shape)) {
//       return true;
//     }
//     if (!_.isEqual(this.props.shapes, nextProps.shapes)) {
//       return true;
//     }
//     if (this.props.imageUrl !== nextProps.imageUrl) {
//       return true;
//     }
//     if (
//       this.props.widthCanvas !== nextProps.widthCanvas ||
//       this.props.heightCanvas !== nextProps.heightCanvas
//     ) {
//       return true;
//     }

//     return false;
//   }

//   componentDidUpdate(prevProps) {
//     this.draw(
//       this.props,
//       prevProps,
//       this.props.select_shape,
//       this.props.shapes
//     );
//   }

//   onKeyPress(e) {
//     if (this.props.select_index > -1) {
//       const key_code = e.keyCode;

//       if (key_code === 46) {
//         const deleteShape = this.props.deleteShape;
//         if (deleteShape) {
//           deleteShape(this.props.select_index);
//         }
//         return;
//       }

//       if (this.props.draw && e.ctrlKey) {
//         if (key_code === 67 /*c*/) {
//           canvasObject.shape_copy = this.props.shapes[this.props.select_index];
//         } else if (key_code === 86 /*v*/ && canvasObject.shape_copy) {
//           const shape = new Shape(
//             canvasObject.shape_copy.x + 20,
//             canvasObject.shape_copy.y + 20,
//             canvasObject.shape_copy.w,
//             canvasObject.shape_copy.h
//           );

//           canvasObject.shape_copy = shape;
//           /***@author nhhien 
//            * set copy by index
//           */
//           shape.copy_of_index =this.props.select_index;
//           this.props.addShape(shape);
//         }
//       }
//     }
//   }

//   zoom(delta) {
//     if (!this.props.hide_rectangle) {
//       canvasObject.setPropZoomRect(
//         delta,
//         canvasObject.centerX,
//         canvasObject.centerY
//       );
//     }
//     canvasObject.setPropZoomImage(
//       delta,
//       canvasObject.centerX,
//       canvasObject.centerY
//     );
//   }

//   onMouseDown(ev) {
//     if (canvasObject.expectResize !== -1) {
//       canvasObject.isResizeDrag = true;
//       return;
//     }

//     canvasObject.setCoordinatesWhenMouseDown(ev);

//     const { selectShape } = this.props;

//     const select = canvasObject.beginDrag(ev);

//     if (selectShape) {
//       if (!ev.ctrlKey && select) {
//         selectShape(select.index, select.shape);

//         return;
//       }

//       // havent returned means we have failed to select anything.
//       // If there was an object selected, we deselect it
//       selectShape(-1, null);
//     }

//     if (this.props.draw && ev.ctrlKey) {
//       canvasObject.draw = true;
//     }
//   }

//   onMouseMove(ev) {
//     const { select_shape, dragging, isResizeDrag } = canvasObject;

//     canvasObject.setCoordinatesWhenMouseMove(ev);

//     if (select_shape) {
//       const mouse = canvasObject.getMouse(ev);

//       if (dragging || isResizeDrag) {
//         if (dragging) {
//           // select shape and drag
//           canvasObject.startDragRect(mouse.x, mouse.y);
//         } else {
//           canvasObject.resizeShape(mouse.x, mouse.y);
//         }
//       } else {
//         canvasObject.getStyleCursor(mouse.x, mouse.y, Corners);
//       }
//     } else if (canvasObject.draw) {
//       // draw rectangle
//       const rect = canvasObject.getRectWhenDrawAndMove(ev);

//       if (!rect) {
//         return null;
//       }

//       canvasObject.redrawRect();

//       canvasObject.drawRect(rect.x, rect.y, rect.w, rect.h);

//       return new Shape(rect.x, rect.y, rect.w, rect.h);
//     } else {
//       canvasObject.startDragImage(ev);
//     }
//   }

//   onMouseUp(ev) {
//     if (canvasObject.draw) {
//       const shape = this.onMouseMove(ev);
//       if (shape) {
//         this.props.addShape(shape);
//       }
//       canvasObject.draw = false;
//     } else {
//       const select_shape = canvasObject.select_shape;
//       if (select_shape) {
//         if (select_shape.w < 0) {
//           select_shape.w = -select_shape.w;
//           select_shape.x = select_shape.x - select_shape.w;
//         }
//         if (select_shape.h < 0) {
//           select_shape.h = -select_shape.h;
//           select_shape.y = select_shape.y - select_shape.h;
//         }
//         this.props.updateSizeShape(this.props.select_index, select_shape);
//       }
//     }

//     canvasObject.setPropsWhenMouseUp();
//   }

//   handleScroll(ev) {
//     var delta = ev.wheelDelta
//       ? ev.wheelDelta / 120
//       : ev.detail ? -ev.detail : 0;
//     if (delta) {
//       canvasObject.setPropZoomImage(delta);
//       if (!this.props.hide_rectangle) {
//         canvasObject.setPropZoomRect(delta);
//       }
//     }
//   }

//   rotateLeft() {
//     canvasObject.rotateLeft(5);
//   }

//   rotateRight() {
//     canvasObject.rotateRight(5);
//   }

//   resetZoomRotate() {
//     canvasObject.resetZoomRotate();
//   }

//   render() {
//     const { hide_rectangle, draw, widthCanvas, heightCanvas } = this.props;

//     return (
//       <div style={{ width: widthCanvas, height: heightCanvas }}>
//         <canvas
//           ref="canvas_image"
//           width={widthCanvas}
//           height={heightCanvas}
//           style={{
//             backgroundColor: "#212121",
//             float: "left"
//           }}
//         />
//         {!hide_rectangle && (
//           <canvas
//             ref="canvas_rect"
//             width={widthCanvas}
//             height={heightCanvas}
//             style={{
//               left: 0,
//               position: "absolute",
//               background: "transparent"
//             }}
//           />
//         )}
//         <ToolBar
//           ref="canvas_tool_bar"
//           draw={draw}
//           zoomIn={() => this.zoom(2)}
//           zoomOut={() => this.zoom(-2)}
//           rotateLeft={this.rotateLeft.bind(this)}
//           rotateRight={this.rotateRight.bind(this)}
//           resetZoomRotate={this.resetZoomRotate.bind(this)}
//         />
//         {this.props.children}
//       </div>
//     );
//   }
// }

// Canvas.propTypes = {
//   widthCanvas: PropTypes.number.isRequired,
//   heightCanvas: PropTypes.number.isRequired,
//   imageUrl: PropTypes.string,

//   addShape: PropTypes.func,
//   selectShape: PropTypes.func,
//   completeDraw: PropTypes.func
// };

// export default Canvas;

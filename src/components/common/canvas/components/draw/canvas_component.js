import React from "react";

import ToolBar from "../common/canvas_tool_bar_component";
import CanvasLayout from "../../modules/types";

import _ from "lodash";

let canvasObject;

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  createCanvas() {
    const { canvas_rect, canvas_image } = this.refs;
    const {
      widthCanvas,
      heightCanvas,
      imageUrl,
      draw,
      coordinate_focus,
      select_shape,
      shapes
    } = this.props;

    canvasObject = new CanvasLayout(this.props.type, canvas_image, canvas_rect);
    canvasObject.setProps({
      widthCanvas,
      heightCanvas,
      imageUrl,
      draw,
      coordinate_focus,
      select_shape,
      shapes
    });

    canvas_rect.addEventListener("mousewheel", this.handleScroll, {
      passive: true
    });
    canvas_rect.addEventListener("mousedown", this.onMouseDown);
    canvas_rect.addEventListener("mousemove", this.onMouseMove);
    canvas_rect.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("keydown", this.onKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyPress);
  }

  componentDidMount() {
    this.createCanvas();
  }

  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(this.props.select_shape, nextProps.select_shape)) {
      return true;
    }
    if (!_.isEqual(this.props.shapes, nextProps.shapes)) {
      return true;
    }
    if (!_.isEqual(this.props.coordinate_focus, nextProps.coordinate_focus)) {
      return true;
    }
    if (this.props.imageUrl !== nextProps.imageUrl) {
      return true;
    }
    if (
      this.props.widthCanvas !== nextProps.widthCanvas ||
      this.props.heightCanvas !== nextProps.heightCanvas
    ) {
      return true;
    }

    return false;
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      widthCanvas,
      heightCanvas,
      imageUrl,
      draw,
      coordinate_focus,
      select_shape,
      shapes
    } = nextProps;

    canvasObject.setProps({
      widthCanvas,
      heightCanvas,
      imageUrl,
      draw,
      coordinate_focus,
      select_shape,
      shapes
    });
  }

  zoom(e, delta) {
    canvasObject.onMouseWheel(e, delta, /*is_center*/ true);
  }

  onKeyPress(e) {
    if (this.props.select_index > -1) {
      const key_code = e.keyCode;

      if (key_code === 46) {
        const deleteShape = this.props.deleteShape;
        if (deleteShape) {
          deleteShape(this.props.select_index);
        }
        return;
      }
    }
  }

  onMouseDown(event) {
    canvasObject.onMouseDown(event, this.props.selectShape);
  }

  onMouseMove(event) {
    canvasObject.onMouseMove(event);
  }

  onMouseUp(event) {
    const select_index = this.props.select_index;
    canvasObject.onMouseUp((is_drawing, select_shape) => {
      if (is_drawing) {
        this.props.addShape(select_shape);
      } else {
        this.props.updateSizeShape(select_index, select_shape);
      }
    });
  }

  handleScroll(event) {
    var delta = event.wheelDelta
      ? event.wheelDelta / 40
      : event.detail ? -event.detail : 0;

    canvasObject.onMouseWheel(event, delta);
  }

  rotateLeft() {
    canvasObject.rotateLeft(5);
  }

  rotateRight() {
    canvasObject.rotateRight(5);
  }

  resetZoomRotate() {
    canvasObject.resetProps();
  }

  render() {
    const { widthCanvas, heightCanvas } = this.props;

    return (
      <div style={{ width: widthCanvas, height: heightCanvas }}>
        <canvas
          ref="canvas_image"
          width={widthCanvas}
          height={heightCanvas}
          style={{
            backgroundColor: "#212121",
            float: "left"
          }}
        />
        <canvas
          ref="canvas_rect"
          width={widthCanvas}
          height={heightCanvas}
          style={{
            left: 0,
            position: "absolute",
            background: "transparent"
          }}
        />
        <ToolBar
          ref="canvas_tool_bar"
          draw={true}
          zoomIn={e => this.zoom(e, 3)}
          zoomOut={e => this.zoom(e, -3)}
          rotateLeft={this.rotateLeft.bind(this)}
          rotateRight={this.rotateRight.bind(this)}
          resetZoomRotate={this.resetZoomRotate.bind(this)}
        />
        {this.props.children}
      </div>
    );
  }
}

export default Canvas;

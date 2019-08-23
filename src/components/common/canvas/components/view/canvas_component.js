import React from "react";

import ToolBar from "../common/canvas_tool_bar_component";
import CanvasView from "../../modules/types";

import _ from "lodash";

let canvasObject;

class Canvas extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  createCanvas() {
    const canvas = this.refs.canvas;
    const { widthCanvas, heightCanvas, imageUrl } = this.props;

    canvasObject = new CanvasView(this.props.type, canvas);
    canvasObject.setProps({widthCanvas, heightCanvas, imageUrl});

    canvas.addEventListener("mousewheel", this.handleScroll, {
      passive: true
    });
    canvas.addEventListener("mousedown", this.onMouseDown);
    canvas.addEventListener("mousemove", this.onMouseMove);
    canvas.addEventListener("mouseup", this.onMouseUp);
  }

  componentDidMount() {
    this.createCanvas();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  componentWillUpdate(nextProps, nextState) {
    const { widthCanvas, heightCanvas, imageUrl } = nextProps;
    canvasObject.setProps({ widthCanvas,  heightCanvas, imageUrl});
  }

  zoom(e, delta) {
    canvasObject.onMouseWheel(e, delta, /*is_center*/ true);
  }

  onMouseDown(event) {
    canvasObject.onMouseDown(event);
  }

  onMouseMove(event) {
    canvasObject.onMouseMove(event);
  }

  onMouseUp(event) {
    canvasObject.onMouseUp();
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
          ref="canvas"
          width={widthCanvas}
          height={heightCanvas}
          style={{
            backgroundColor: "#212121",
            float: "left"
          }}
        />
        <ToolBar
          ref="canvas_tool_bar"
          draw={false}
          zoomIn={(e) => this.zoom(e, 3)}
          zoomOut={(e) => this.zoom(e, -3)}
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

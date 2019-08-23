import React from 'react';
import PropTypes from 'prop-types';
import ToolBar from './tool_bar';
import Paper from 'material-ui/Paper';
import ControlCanvas from './control';
import { isEqual } from 'lodash';
const rectangleDefault = { x: 0, y: 0, w: 1, h: 1 };
class Viewer extends ControlCanvas {
  state = {
    rectangle: undefined,
    line: 0,
    section: {},
    startY: 0,
    lineNo: 0,
    lineHeight: 0,
    focusLine: true,
  }
  componentDidMount = () => {
    const { initRef } = this.props;
    this.init();
    initRef && initRef(this)
  }
  componentWillUnmount = () => {
    const { initRef } = this.props;
    initRef && initRef(null);
  }
  componentWillReceiveProps(nextProps) {
    const self = this;
    const {showRectangle,showMask} = nextProps;
    this.showMask =showMask;
    if (this.props.imageUrl !== nextProps.imageUrl) {
      this.setImage(nextProps.imageUrl);
    }
    if (!isEqual(this.state.section, nextProps.section) || !isEqual(this.props.noOfLine, nextProps.noOfLine)) {
      if (nextProps.section && nextProps.section.settings) {
        let positionBoder = nextProps.section.position_percent;
        if (positionBoder&&nextProps.section.settings.multiple) {
          let lineNo = nextProps.section.settings.multiple.record_no * 1 || 1;
          let mask = nextProps.section.settings.multiple.mask
          if (!nextProps.isTraining && mask === "require_mask") {
            let startY = positionBoder.y;
            let lineHeight = positionBoder.h / lineNo;
            this.state.section = nextProps.section;
            this.state.startY = startY;
            this.state.lineHeight = lineHeight;
            this.state.lineHeightOriginal = nextProps.lineHeightOriginal;
            lineNo = nextProps.noOfLine;
            this.offsetTop = nextProps.offsetTop;
            this.state.lineNo = lineNo;
            this.define_mask = false;
            self.require_mask = true;
          } else {
            self.require_mask = false;
            let startY = positionBoder.y;
            let lineHeight = positionBoder.h / lineNo;
            this.state.section = nextProps.section;
            this.state.startY = startY;
            this.state.lineHeight = lineHeight;
            this.state.lineHeightOriginal = lineHeight * self.originalHeight / 100;
            lineNo = nextProps.noOfLine > lineNo ? nextProps.noOfLine : lineNo;
            this.state.lineNo = lineNo;
            if (mask === "define_mask") {
              this.define_mask = true;
              self.props.onChangeMask('lineHeightOriginal', self.state.lineHeightOriginal)
              self.props.onChangeMask('offsetTop', this.offsetTop)
            }
          }
        }
      }
    }
    this.state.line = nextProps.line||-1;
    if (showRectangle && nextProps.rectangle && Object.keys(nextProps.rectangle).length) {
      this.state.rectangle = this.getOriginalSize(Object.assign({}, rectangleDefault, nextProps.rectangle), nextProps.line);
    } else {
      this.state.rectangle = undefined;
    }

    if (nextProps.focusLine) {
      if (this.props.line !== nextProps.line) {
        this.moveToNewLine(nextProps.line, this.props.line)
      }
    }
    this.drawImage();
  }
  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = !isEqual(this.props.width, nextProps.width) || !isEqual(this.props.height, nextProps.height)
    return shouldUpdate;
  }

  componentDidUpdate(prevProps, prevState) {
    this.reset();
  }
  rotateLeft() {
    this.rotate -= 90;
    if (this.rotate === - 360) {
      this.rotate = 0
    }
    this.drawImage();
  }

  rotateRight() {
    this.rotate += 90;
    if (this.rotate === 360) {
      this.rotate = 0
    }
    this.drawImage();
  }
  render() {
    const { width, height } = this.props;
    return (
      <Paper zDepth={1}>
        <div
          style={{
            height: height,
            width: width,
            position: 'relative',
            overflow: 'visible'
          }}
        >
          <canvas
            ref={node => {
              this.setCanvasImageRef(node);
            }}
            width={width}
            height={height}
            style={{
              backgroundColor: '#212121',
              borderRadius: 2
            }}
          />
          <ToolBar
            zoomIn={() => this.setPropZoomRect(2, true)}
            zoomOut={() => this.setPropZoomRect(-2, true)}
            rotateLeft={this.rotateLeft.bind(this)}
            rotateRight={this.rotateRight.bind(this)}
          />
        </div>
      </Paper>
    );
  }
}
Viewer.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  rectangle: PropTypes.object,
  showRectangle:PropTypes.bool,
  showMask:PropTypes.bool,
  lineWidth: PropTypes.number,
  strokeStyle: PropTypes.string,
  autoZoom: PropTypes.bool,
  onChangeStateView: PropTypes.func,
  initRef: PropTypes.func,
};
export default Viewer;

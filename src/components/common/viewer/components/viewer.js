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
  }
  componentDidMount() {
    this.init();
  }
  componentWillReceiveProps(nextProps) {
    const self = this;
    if (this.props.imageUrl !== nextProps.imageUrl) {
      this.setImage(nextProps.imageUrl);
    }
    if (nextProps.rectangle && Object.keys(nextProps.rectangle).length) {
      this.setState({ rectangle: Object.assign({}, rectangleDefault, nextProps.rectangle) },
      ()=>{
        self.drawImage();
      });
    } else {
      this.setState({ rectangle: undefined },
        ()=>{
          self.drawImage();
        });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = !isEqual(this.props.width, nextProps.width)||!isEqual(this.props.height, nextProps.height) 
    return shouldUpdate;
  }

  componentDidUpdate(prevProps, prevState) {
    this.reset();
  }
  rotateLeft() {
    this.rotate -= 90;
    this.drawImage();
  }

  rotateRight() {
    this.rotate += 90;
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
  lineWidth: PropTypes.number,
  strokeStyle: PropTypes.string,
  autoZoom: PropTypes.bool,
};
export default Viewer;

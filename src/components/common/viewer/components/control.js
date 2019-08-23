import { Component } from 'react';
import TrackTransForms from './track_transforms';
export default class ControlCanvas extends Component {
  static defaultProps = {
    lineWidth: 2,
    strokeStyle: 'red',
  }
  constructor(props, context) {
    super(props);
    const self = this;
    this.factor = 1;
    this.inital = false;
    this.imageData = new Image();
    this.imageData.addEventListener('load', this.onLoaded)
    this.imageData.onerror = function (e) {
      self.setState({ loadedError: true });
    }
  }
  onLoaded = () => {
    let self = this;
    self.loaded = true;
    self.drawImage();
    self.rect = self._canvas.getBoundingClientRect();
    if (!self.inital) {
      self.inital = true
      self.factor = self.props.width / self.imageData.width
      self.trackTransForms.scale(self.factor, self.factor);
      self.drawImage();
    }
  }
  setCanvasImageRef(imgCanvas) {
    if (imgCanvas && !this._canvas) {
      this._canvas = imgCanvas;
      this._imgCtx = this._canvas.getContext('2d');
    }
  }
  init() {
    this.rect = this._canvas.getBoundingClientRect();
    this.trackTransForms = new TrackTransForms(this._canvas.getContext('2d'));
    this._imgCtx.lineWidth = this.props.lineWidth;
    this._imgCtx.strokeStyle = this.props.strokeStyle;
    this.rotate = 0;
    this.expectResize = -1;
    this.initListen();
    this.setImage(this.props.imageUrl);
  }
  initListen() {
    this._canvas.addEventListener(
      'DOMMouseScroll',
      this._handleScroll.bind(this),
      false
    );
    this._canvas.addEventListener(
      'mousewheel',
      this._handleScroll.bind(this),
      false
    );
    this._canvas.addEventListener(
      'mousedown',
      this._onMouseDown.bind(this),
      false
    );
    this._canvas.addEventListener(
      'mousemove',
      this._onMouseMove.bind(this),
      false
    );
    this._canvas.addEventListener('mouseup', this._onMouseUp.bind(this), false);
  }
  removeListener() {
    this._canvas.removeEventListener(
      'DOMMouseScroll',
      this._handleScroll.bind(this),
      false
    );
    this._canvas.removeEventListener(
      'mousewheel',
      this._handleScroll.bind(this),
      false
    );
    this._canvas.removeEventListener(
      'mousedown',
      this._onMouseDown.bind(this),
      false
    );
    this._canvas.removeEventListener(
      'mousemove',
      this._onMouseMove.bind(this),
      false
    );
    this._canvas.removeEventListener(
      'mouseup',
      this._onMouseUp.bind(this),
      false
    );
  }
  setImage(uri) {
    if (this.imageData.src !== uri) {
      this.loaded = false;
      this.setState({ loadedError: false });
      this.imageData.src = uri || '';
      this.reset()
    }
  }
  drawImage() {
    if (this.loaded)
      try {
        const ctx = this._imgCtx;
        const { rectangle } = this.state;
        this.clearRect();
        this.trackTransForms.save();
        this.trackTransForms.translate(
          this.imageData.width / 2,
          this.imageData.height / 2
        );
        this.trackTransForms.rotate(this.rotate * Math.PI / 180);
        ctx.drawImage(
          this.imageData,
          -this.imageData.width / 2,
          -this.imageData.height / 2,
          this.imageData.width,
          this.imageData.height
        );
        if (rectangle) {
          ctx.strokeStyle = this.props.strokeStyle;
          ctx.lineWidth = this.props.lineWidth / this.factor
          ctx.strokeRect(
            rectangle.x - this.imageData.width / 2,
            rectangle.y - this.imageData.height / 2,
            rectangle.w,
            rectangle.h
          );
        }
        this.trackTransForms.restore();
      } catch (error) {
      }
  }
  getCenterPoint() {
    return { x: this._canvas.width / 2, y: this._canvas.height };
  }
  reset() {
    this.trackTransForms.reset();
    const { rectangle } = this.state;
    const { autoZoom } = this.props;
    if (rectangle && autoZoom) {
      this.factor = Math.min((this._canvas.width / (rectangle.w + this.props.lineWidth)), (this._canvas.height / (rectangle.h + this.props.lineWidth)));
    }
    this.trackTransForms.scale(this.factor, this.factor);
    this.rect = this._canvas.getBoundingClientRect();
    // this.moveToRectange();
    this.drawImage();
  }
  getCenterRectange(rectange) {
    return {
      x: rectange.x + rectange.w / 2,
      y: rectange.y + rectange.h / 2
    };
  }
  moveToRectange() {
    const { rectangle } = this.state;
    if (rectangle) {
      let centerRectange = this.getCenterRectange(rectangle);
      let centerImage = {
        x: this.imageData.width / 2,
        y: this.imageData.height / 2
      };
      let _left = centerRectange.x - centerImage.x;
      let _top = centerRectange.y - centerImage.y;
      let _moveTop = 0;
      let _moveLeft = 0;
      switch (this.rotate / 180 % 2) {
        case 0:
          _moveTop = _top;
          _moveLeft = _left;
          break;
        case 0.5:
        case -1.5:
          _moveTop = _left;
          _moveLeft = -1 * _top;
          break;
        case 1:
        case -1:
          _moveTop = -1 * _top;
          _moveLeft = -1 * _left;
          break;
        case -0.5:
        case 1.5:
          _moveTop = -1 * _left;
          _moveLeft = _top;
          break;
        default:
          break;
      }
      this.trackTransForms.translate(
        this._canvas.width / this.factor / 2 - (centerImage.x + _moveLeft),
        this._canvas.height / this.factor / 2 - (centerImage.y + _moveTop)
      );
    }
  }
  clearRect() {
    const ctx = this._imgCtx;
    const trackTransForms = this.trackTransForms;
    const p1 = trackTransForms.transformedPoint(0, 0);
    const p2 = trackTransForms.transformedPoint(
      ctx.canvas.width,
      ctx.canvas.height
    );
    ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
  }
  setPropZoomRect(delta, center) {
    let pt, factor;

    if (center) {
      let centerPoint = this.getCenterPoint();
      pt = this.trackTransForms.transformedPoint(centerPoint.x, centerPoint.y);
    } else {
      pt = this.trackTransForms.transformedPoint(this.lastX, this.lastY);
    }
    factor = Math.pow(1.1, delta);
    this.factor *= factor;
    this.trackTransForms.translate(pt.x, pt.y);
    this.trackTransForms.scale(factor, factor);
    this.trackTransForms.translate(-pt.x, -pt.y);
    this.drawImage();
  }

  _onMouseDown(ev) {
    this.lastX = ev.clientX - this.rect.left;
    this.lastY = ev.clientY - this.rect.top;
    this.x0 = ev.clientX - this.rect.left;
    this.y0 = ev.clientY - this.rect.top;
    this.dragStart = this.trackTransForms.transformedPoint(this.x0, this.y0);
  }

  _onMouseMove(ev) {
    this.lastX = ev.clientX - this.rect.left;
    this.lastY = ev.clientY - this.rect.top;
    if (this.dragStart) {
      this._canvas.style.cursor = 'move';
      var pt = this.trackTransForms.transformedPoint(this.lastX, this.lastY);
      this.trackTransForms.translate(
        pt.x - this.dragStart.x,
        pt.y - this.dragStart.y
      );
      this.drawImage();
    }
  }
  _onMouseUp() {
    this.dragStart = null;
    this._canvas.style.cursor = 'auto';
  }
  _handleScroll(ev) {
    var delta = ev.wheelDelta ? ev.wheelDelta / 60 : ev.detail ? -ev.detail : 0;
    if (delta) {
      this.setPropZoomRect(delta);
    }
    return ev.preventDefault() && false;
  }
  setCoordinatesWhenMouseDown(ev) {
    this.x0 = ev.clientX - this.rect.left;
    this.y0 = ev.clientY - this.rect.top;
  }
}

import {
  Component
} from 'react';
import TrackTransForms from './track_transforms';
export default class ControlCanvas extends Component {
  static defaultProps = {
    lineWidth: 2,
    strokeStyle: 'rgba(255,38,30,0.8)',
    lineHeightOriginal: 0,
    offsetTop: 0,
    showRectangle: true,
    showMask: true,
    onChangeMask: (name, val) => { }
  }
  constructor(props, context) {
    super(props);
    const self = this;
    this.factor = 1;
    this.offsetTop = props.offsetTop;
    this.offsetLeft = 0;
    this.offsetLeftCurrent = 0;
    this.offsetTopCurrent = 0;
    this.imageData = new Image();
    this.imageData.addEventListener('load', this.initImage)
    this.imageData.onerror = function (e) {
      self.state.loadedError = true;
    }
    this.draw_line = {};

  }
  initImage = () => {
    const self = this;
    self.loaded = true;
    self.originalWidth = self.imageData.width;
    self.originalHeight = self.imageData.height;
    self.state.lineHeightOriginal = self.props.lineHeightOriginal && self.props.lineHeightOriginal > 0 ? self.props.lineHeightOriginal : self.state.lineHeight * self.originalHeight / 100
    this.factor = Math.min(self.props.width / (self.originalWidth), self.props.height / (self.originalHeight))
    if (self.props.section && self.props.section.settings && self.props.section.settings.multiple) {
      let mask = self.props.section.settings.multiple.mask
      if (mask !== "require_mask") {
        self.state.lineHeightOriginal = self.state.lineHeight * self.originalHeight / 100;
        if (mask === "define_mask") {
          self.props.onChangeMask('lineHeightOriginal', self.state.lineHeightOriginal)
          self.props.onChangeMask('offsetTop', this.offsetTop)
        }
      }
    }
    self.reset();
    this.trackTransForms.translate((self.props.width - (this.factor * self.originalWidth)) / 2 / this.factor, (self.props.height - (this.factor * self.originalHeight)) / 2 / this.factor);
    self.rect = self._canvas.getBoundingClientRect();
    self.drawImage();
  }
  resetInside = () => {
    const self = this;
    self.loaded = true;
    self.originalWidth = self.imageData.width;
    self.originalHeight = self.imageData.height;
    self.state.lineHeightOriginal = (self.props.lineHeightOriginal && self.props.lineHeightOriginal > 0)
      ?
      self.props.lineHeightOriginal :
      self.state.lineHeight * self.originalHeight / 100
    this.factor = Math.min(self.props.width / (self.originalWidth), self.props.height / (self.originalHeight))
    if (self.props.section && self.props.section.settings && self.props.section.settings.multiple) {
      let mask = self.props.section.settings.multiple.mask
      if (mask !== "require_mask") {
        self.state.lineHeightOriginal = self.state.lineHeight * self.originalHeight / 100;
        if (mask === "define_mask") {
          self.props.onChangeMask('lineHeightOriginal', self.state.lineHeightOriginal)
          self.props.onChangeMask('offsetTop', this.offsetTop)
        }
      }
    }
    self.reset();
    this.trackTransForms.translate((self.props.width - (this.factor * self.originalWidth)) / 2 / this.factor, (self.props.height - (this.factor * self.originalHeight)) / 2 / this.factor);
    self.rect = self._canvas.getBoundingClientRect();
    self.drawImage();
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
    this._canvas.addEventListener('contextmenu', this._onContext, false);

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
    this._canvas.removeEventListener('contextmenu', this._onContext, false);
  }
  setImage(uri) {
    if (this.imageData.src !== uri) {
      this.loaded = false;
      this.state.loadedError = false // eslint-disable-line
      this.imageData.src = uri || '';
    }
  }
  getOriginalSizeAttr = (val) => {
    return (val * this.originalHeight) / 100
  }
  getOriginalSize = (position, lineNew) => {
    const self = this;
    const {
      lineHeightOriginal,
      startY
    } = this.state;
    return {
      x: (position.x * self.originalWidth) / 100,
      y: startY * self.originalHeight / 100 + (lineNew) * lineHeightOriginal,
      w: (position.w * self.originalWidth) / 100,
      h: lineHeightOriginal,
    }
  }
  drawSections = (ctx) => {
    const self = this;
    const {
      lineNo,
      line,
      startY,
      lineHeightOriginal,
    } = this.state;
    if (lineHeightOriginal > 0) {

      let helfWidth = self.originalWidth / 2
      let lineWidth = this.props.lineWidth / this.factor;
      let lineStartY = startY * self.originalHeight / 100 - self.originalHeight / 2;
      lineStartY -= (this.offsetTop + this.offsetTopCurrent)
      let linebefore = lineStartY;
      let offsetText = Number(lineHeightOriginal * 0.85)
      ctx.fillStyle = 'rgba(251,152,125,1)';
      ctx.font = Number(lineHeightOriginal * 0.9) + "px Arial";
      let lengthText = ctx.measureText(lineNo).width
      let lineStartX = -Number(lineHeightOriginal) / 2 - lengthText - helfWidth;
      lineStartX -= (this.offsetLeft + this.offsetLeftCurrent)
      for (let i = 0; i < lineNo; i++) {
        let lineY = lineStartY + (i + 1) * lineHeightOriginal;
        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = line !== i ? 'rgba(142,232,148,0.5)' : 'rgba(250,67,39,0.8)';//'rgba(249,255,13,0.5)';
        ctx.moveTo(lineStartX, lineY);
        ctx.lineTo(helfWidth, lineY);
        ctx.stroke();
        ctx.fillText(i + 1, lineStartX, linebefore + offsetText);
        linebefore = lineY;
      }
    }
  }
  moveToNewLine = (current, lineNew) => {
    var pt = this.trackTransForms.transformedPoint(0, 0);
    var ptnew = this.trackTransForms.transformedPoint(0, (lineNew - current) * this.state.lineHeightOriginal * this.factor);
    this.trackTransForms.translate(
      ptnew.x - pt.x,
      ptnew.y - pt.y
    );
  }
  drawLine = (ctx) => {
    const self = this;
    let helfWidth = self.originalWidth / 2
    let lineStartX = 0;
    lineStartX -= (this.offsetLeft + this.offsetLeftCurrent)
    let top = this.draw_line.top;
    let lineWidth = this.props.lineWidth / this.factor;
    ctx.beginPath();
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = 'rgba(250,67,39,0.8)';//'rgba(249,255,13,0.5)';
    ctx.moveTo(lineStartX, top);
    ctx.lineTo(self.originalWidth, top);
    ctx.stroke();
  }
  drawImage = () => {
    if (this.loaded)
      try {
        const ctx = this._imgCtx;
        const {
          rectangle,
          lineHeightOriginal
        } = this.state;
        this.clearRect();
        this.trackTransForms.save();
        this.trackTransForms.translate(
          this.imageData.width / 2,
          this.imageData.height / 2
        );
        let rotateImage = this.rotate / 180 % 2;
        this.trackTransForms.rotate(rotateImage * Math.PI);
        ctx.drawImage(
          this.imageData, -this.imageData.width / 2, -this.imageData.height / 2,
          this.imageData.width,
          this.imageData.height
        );
        this.trackTransForms.rotate((2 - rotateImage) * Math.PI);
        if (this.showMask) {
          this.drawSections(ctx);
        }
        if (rectangle) {
          ctx.strokeStyle = this.props.strokeStyle;
          ctx.lineWidth = this.props.lineWidth / this.factor;
          ctx.strokeRect(
            rectangle.x - this.imageData.width / 2,
            rectangle.y - this.imageData.height / 2 - (this.offsetTop + this.offsetTopCurrent) - lineHeightOriginal / 2,
            rectangle.w,
            rectangle.h + lineHeightOriginal
          );
          ctx.fillStyle = 'rgba(15,6,227,1)';
          ctx.fillText((this.state.line + 1) === 0 ? 1 : (this.state.line + 1), rectangle.x - this.imageData.width / 2, rectangle.y - this.imageData.height / 2 - (this.offsetTop + this.offsetTopCurrent) - lineHeightOriginal / 2);
        }
        this.trackTransForms.restore();
        if (this.draw_line) {
          this.drawLine(ctx);
        }
        this.updateStateView(ctx, rotateImage);
      } catch (error) {
      }
  }
  updateStateView = (ctx, rotateImage) => {
    const { onChangeStateView, width, height } = this.props;
    const {
      rectangle,
      lineHeightOriginal
    } = this.state;
    let p1 = this.trackTransForms.transformedPoint(0, 0);
    if (p1.x > 5 || p1.y > 5 || ((this.imageData.width - p1.x) * this.factor >> 0) > width || ((this.imageData.height - p1.y) * this.factor >> 0) > height) {
      if (!this.overflow) {
        onChangeStateView && onChangeStateView({ overflow: true });
        this.overflow = true;
      }
    } else {
      if (this.overflow) {
        onChangeStateView && onChangeStateView({ overflow: false });
        this.overflow = false;
      }
    }
  }
  getCenterPoint() {
    return {
      x: this._canvas.width / 2,
      y: this._canvas.height
    };
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
    const {
      rectangle
    } = this.state;
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
  _onContext = (ev) => {
    ev.preventDefault();
    this.rightClick = true;
    this.lastX = ev.clientX - this.rect.left;
    this.lastY = ev.clientY - this.rect.top;
    this.x0 = ev.clientX - this.rect.left;
    this.y0 = ev.clientY - this.rect.top;
    return false;
  }
  _onMouseDown(ev) {
    if (ev.button === 0) {
      this.lastX = ev.clientX - this.rect.left;
      this.lastY = ev.clientY - this.rect.top;
      this.x0 = ev.clientX - this.rect.left;
      this.y0 = ev.clientY - this.rect.top;
      this.dragStart = this.trackTransForms.transformedPoint(this.x0, this.y0);
    } else if (ev.button === 2) {
      let dragStart = this.trackTransForms.transformedPoint(ev.clientX - this.rect.left, ev.clientY - this.rect.top);
      this.draw_line = { top: dragStart.y };
      this.drawImage();
    }
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
    } else if (this.rightClick && (!this.require_mask || this.props.isTraining)) {
      this._canvas.style.cursor = 'move';
      // this.offsetLeftCurrent=(this.x0 - this.lastX)/this.factor
      this.offsetTopCurrent = (this.y0 - this.lastY) / this.factor;
      this.offsetLeftCurrent = (this.x0 - this.lastX) / this.factor;
      this.drawImage();
    }
  }
  _onMouseUp() {
    if (this.rightClick && !this.require_mask) {
      this.offsetLeft += this.offsetLeftCurrent;
      this.offsetLeftCurrent = 0;
      this.offsetTop += this.offsetTopCurrent;
      this.offsetTopCurrent = 0;
      if (this.define_mask) {
        this.props.onChangeMask('offsetTop', this.offsetTop)
      }
    }
    this.dragStart = null;
    this.rightClick = false;
    this._canvas.style.cursor = 'auto';
    this.drawImage();
  }
  _handleScroll(ev) {
    const self = this;
    var delta = ev.wheelDelta ? ev.wheelDelta / 60 : ev.detail ? -ev.detail : 0;
    if (ev.ctrlKey) {
      self.state.lineHeightOriginal = self.state.lineHeightOriginal + delta / 6;
      if (this.define_mask) {
        this.props.onChangeMask('lineHeightOriginal', self.state.lineHeightOriginal)
      }
      self.drawImage();
    } else
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
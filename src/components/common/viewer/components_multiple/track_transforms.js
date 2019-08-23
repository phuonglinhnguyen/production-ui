export default class TrackTransForms {
  constructor(ctx) {
    this.ctx = ctx;
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.xform = this.svg.createSVGMatrix();
    this.pt = this.svg.createSVGPoint();
    this.savedTransforms = [];
  }
  reset = () => {
    this.savedTransforms = [];
    this.setTransform(1, 0, 0, 1, 0, 0);
  };
  setCtx = ctx => {
    this.ctx = ctx;
  };
  getTransform = () => {
    return this.xform;
  };
  save = () => {
    this.savedTransforms.push(this.xform.translate(0, 0));
    return this.ctx.save();
  };
  restore = () => {
    this.xform = this.savedTransforms.pop();
    return this.ctx.restore();
  };
  scale = (sx, sy) => {
    this.xform = this.xform.scaleNonUniform(sx, sy);
    return this.ctx.scale(sx, sy);
  };
  rotate = radians => {
    this.xform = this.xform.rotate(radians * 180 / Math.PI);
    return this.ctx.rotate(radians);
  };
  translate = (dx, dy) => {
    this.xform = this.xform.translate(dx, dy);
    return this.ctx.translate(dx, dy);
  };
  transform = (a, b, c, d, e, f) => {
    let m2 = this.svg.createSVGMatrix();
    m2.a = a;
    m2.b = b;
    m2.c = c;
    m2.d = d;
    m2.e = e;
    m2.f = f;
    this.xform = this.xform.multiply(m2);
    return this.ctx.transform(a, b, c, d, e, f);
  };
  setTransform = (a, b, c, d, e, f) => {
    this.xform.a = a;
    this.xform.b = b;
    this.xform.c = c;
    this.xform.d = d;
    this.xform.e = e;
    this.xform.f = f;
    return this.ctx.setTransform(a, b, c, d, e, f);
  };
  transformedPoint = (x, y) => {
    this.pt.x = x;
    this.pt.y = y;
    return this.pt.matrixTransform(this.xform.inverse());
  };
}

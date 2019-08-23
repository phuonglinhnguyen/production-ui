import React, { Component } from 'react';
const getDimensions = element => {
  return [element.clientWidth, element.clientHeight];
};
export const AutoSizer = ComposeComponent => {
  return class AutoSizer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        width: 500,
        height: 500
      };
      this._setRef = this._setRef.bind(this);
      this.onResize = this.onResize.bind(this);
    }
    componentDidUpdate(prevProps, prevState) {
      if (this.props.stateView !== prevProps.stateView) {
      }
      this.updateDimensions();
    }
    updateDimensions() {
      const { width, height } = this.state;
      const dimensions = getDimensions(this._parent);
      if (dimensions[0] !== width || dimensions[1] !== height) {
        this.setState({ width: dimensions[0], height: dimensions[1] });
      }
    }
    getWindow() {
      return this.refs.container
        ? this.refs.container.ownerDocument.defaultView || window
        : window;
    }
    onResize() {
      if (this.rqf) return;
      this.rqf = this.getWindow().requestAnimationFrame(() => {
        this.rqf = null;
        this.updateDimensions();
      });
    }
    componentDidMount() {
      this._parent = this._autoSizer.parentNode;
      this.updateDimensions();
      this.getWindow().addEventListener('resize', this.onResize, false);
    }
    componentWillUnmount() {
      this.getWindow().removeEventListener('resize', this.onResize);
    }
    _setRef(autoSizer) {
      this._autoSizer = autoSizer;
    }
    render() {
      const { height, width } = this.state;
      return (
        <div
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          ref={this._setRef}
        >
          <ComposeComponent width={width} height={height} {...this.props} />
        </div>
      );
    }
  };
};
export default AutoSizer;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class Wrapper extends Component {
  static propTypes = {
    children: PropTypes.node,
    offset: PropTypes.object
  };
  render() {
    const {
      muiTheme,
      offset = {
        top: 112,
        left: 0,
        right: 0,
        bottom: 0
      },
      style
    } = this.props;
    let offsetHeight = (offset.top || 0) + (offset.bottom || 0);
    let offsetWidth = (offset.left || 0) + (offset.right || 0);
    let _style = {
      width: `calc(100vw ${offsetWidth > 0 ? '-' : '+'} ${Math.abs(
        offsetWidth
      )}px)`,
      height: `calc(100vh ${offsetHeight > 0 ? '-' : '+'} ${Math.abs(
        offsetHeight
      )}px)`,
      position: 'relative',
      background: muiTheme.layout.background
    };
    // style={...style,width:500,height:500}
    if (style) {
      _style = { ..._style, ...style };
    }
    return (
      <div style={_style}>
        {this.props.children}
      </div>
    );
  }
}

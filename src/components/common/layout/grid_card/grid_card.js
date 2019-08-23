import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class GridCard extends Component {
  static propTypes = {
    children: PropTypes.node,
    offset: PropTypes.object
  };
  static defaultProps = {
    offset: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  };
  render() {
    const { offset } = this.props;
    let offsetHeight = offset.top + offset.bottom;
    let offsetWidth = offset.left + offset.right;
    return (
      <div
        style={{
          width: `calc(100%) `,
          height: `calc(100%) `,
          position: 'relative',
          display: 'inline-block',
          overflow: 'auto'
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

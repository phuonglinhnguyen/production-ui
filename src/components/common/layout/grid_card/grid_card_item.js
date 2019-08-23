import React, { Component } from 'react';
export default class ItemGrid extends Component {
  render() {
    return (
      <div
        style={{
          width: `200px`,
          height: `200px`,
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'top',
          margin: '16px 20px 0 0'
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

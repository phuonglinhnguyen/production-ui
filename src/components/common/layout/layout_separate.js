import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const LAYOUT_LEFT_RIGHT = 1;
export const LAYOUT_TOP_BOTTOM = 2;
const defaultWrapperStyle = {
  width: 'calc(100%)',
  height: 'calc(100%)',
  display: 'inline-flex',
  justifyContent: 'space-between',
  flexWrap: 'nowrap',
  // padding: ' 16px 16px  0px 16px'
};
const defaultFirstStyle = {
  width: 'calc(70%)',
  height: 'calc(100%)',
  position: 'relative'
};
const defaultSecondStyle = {
  width: '30%',
  height: '100%',
  position: 'relative'
};
export default class LayoutSeparate extends Component {
  static propTypes = {
    wrapperStyle: PropTypes.object,
    firstStyle: PropTypes.object,
    secondStyle: PropTypes.object,
    viewType: PropTypes.oneOf([LAYOUT_LEFT_RIGHT, LAYOUT_TOP_BOTTOM]),
    first: PropTypes.node.isRequired,
    second: PropTypes.node.isRequired
  };
  static defaultProps = {
    first: '',
    second: ''
  };
  render() {
    const { viewType, wrapperStyle, firstStyle, secondStyle } = this.props;
    let _wrapperStyle = { ...defaultWrapperStyle };
    let _firstStyle = { ...defaultFirstStyle };
    let _secondStyle = { ...defaultSecondStyle };
    if (viewType === LAYOUT_TOP_BOTTOM) {
      _wrapperStyle = {
        ..._wrapperStyle,
        height: 'calc(100%)',
        display: 'flex',
        flexDirection: 'column',
        // padding: '16px 16px  0px 16px'
      };
      _firstStyle = {
        ..._firstStyle,
        width: '100%',
        height: 'calc(65%)'
      };
      _secondStyle = { ..._secondStyle, width: '100%', height: '35%' };
    }
    _wrapperStyle = { ..._wrapperStyle, ...(wrapperStyle || {}) };
    _firstStyle = { ..._firstStyle, ...(firstStyle || {}) };
    _secondStyle = { ..._secondStyle, ...(secondStyle || {}) };
    return (
      <div style={_wrapperStyle}>
        <div style={_firstStyle}>
          {this.props.first}
        </div>
        <div style={_secondStyle}>
          {this.props.second}
        </div>
      </div>
    );
  }
}

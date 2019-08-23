import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import IconZoomIn from 'material-ui/svg-icons/action/zoom-in';
import IconZoomOut from 'material-ui/svg-icons/action/zoom-out';
import IconTotateLeft from 'material-ui/svg-icons/image/rotate-left';
import IconTotateRight from 'material-ui/svg-icons/image/rotate-right';
import { I18n } from 'react-redux-i18n';
import Draggable from 'react-draggable';
import { debounce } from '../../../../utils/common';

const styles = {
  tool_bar: {
    bottom: 16,
    left: 'calc(50% - 90px)',
    position: 'absolute',
    textAlign: 'center',
    cursor: 'move'
  },
  button: {
    minWidth: 45
  },
  button_active: {
    minWidth: 45,
    backgroundColor: '#616161'
  },
  icon_color: '#BDBDBD',
  icon_color_active: '#FAFAFA'
};

export default class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.label_zoom_in = I18n.t('canvas.zoom_in');
    this.label_zoom_out = I18n.t('canvas.zoom_out');
    this.label_rotate_left = I18n.t('canvas.rotate_left');
    this.label_rotate_right = I18n.t('canvas.rotate_right');
    this.state = {
      visibleMouseMove: false,
      visibleImportant: false
    };
    this.dimToolBar = debounce(this.dimToolBar.bind(this), 500);
  }
  dimToolBar() {
    this.setState({ visibleMouseMove: false });
  }
  onBlurVisibleToolBar() {
    this.setState({ visibleMouseMove: true });
    this.dimToolBar();
  }
  mouseEnter() {
    this.setState({ visibleImportant: true });
  }

  mouseLeave() {
    this.setState({ visibleImportant: false });
  }
  _setRef(node) {
    if (!this.node && node) {
      this.node = node;
      this._parent = node.parentNode;
      this._parent.addEventListener(
        'mousemove',
        this.onBlurVisibleToolBar.bind(this),
        false
      );
    }
  }
  componentWillUnmount() {
    this._parent.removeEventListener(
      'mousemove',
      this.onBlurVisibleToolBar.bind(this),
      false
    );
  }
  render() {
    const { zoomIn, zoomOut, rotateLeft, rotateRight } = this.props;
    const { visibleImportant, visibleMouseMove } = this.state;
    let background = 'rgba(0,0,0,0.5)',
      icon_color = '#FAFAFA',
      boxShadow = '2px 3px 2px rgba(0, 0, 0, 0.45)',
      height = 40,
      borderRadius = '8px';
    if (!visibleImportant && !visibleMouseMove) {
      background = 'rgba(0,0,0,0.1)';
      icon_color = '#9E9E9E';
      boxShadow = '';
      height = 36;
      borderRadius = '3px';
    }
    return (
      <Draggable bounds="parent" ref="toolbar">
        <div
          style={{
            ...styles.tool_bar,
            background: background,
            boxShadow: boxShadow,
            height: height,
            borderRadius: borderRadius
          }}
          onMouseEnter={this.mouseEnter.bind(this)}
          onMouseLeave={this.mouseLeave.bind(this)}
          ref={this._setRef.bind(this)}
        >
          <FlatButton
            style={styles.button}
            onClick={zoomIn}
            title={this.label_zoom_in}
            icon={<IconZoomIn color={icon_color} />}
          />
          <FlatButton
            style={styles.button}
            onClick={zoomOut}
            title={this.label_zoom_out}
            icon={<IconZoomOut color={icon_color} />}
          />
          <FlatButton
            style={styles.button}
            onClick={rotateLeft}
            title={this.label_rotate_left}
            icon={<IconTotateLeft color={icon_color} />}
          />
          <FlatButton
            style={styles.button}
            onClick={rotateRight}
            title={this.label_rotate_right}
            icon={<IconTotateRight color={icon_color} />}
          />
          
        </div>
      </Draggable>
    );
  }
}

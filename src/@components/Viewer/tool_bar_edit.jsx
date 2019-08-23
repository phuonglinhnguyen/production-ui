import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconZoomIn from '@material-ui/icons/ZoomIn'
import IconZoomOut from '@material-ui/icons/ZoomOut'
import IconTotateLeft from '@material-ui/icons/RotateLeft'
import IconTotateRight from '@material-ui/icons/RotateRight'
import IconSettings from '@material-ui/icons/Settings'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import { I18n } from 'react-redux-i18n';
import { debounce } from '../../utils/common';


const styles = {
  tool_bar: {
    bottom: 16,
    right: '90px',
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


const cancelEvent = (event) => {
  event.preventDefault();
  event.stopPropagation();
}
const ITEM_HEIGHT = 48;


class ToolbarEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleClick=(name)=>(event)=>{

  }
  render() {
    const { zoomIn, zoomOut, rotateLeft, rotateRight, config = {}, classes,
  } = this.props;
  const { visibleImportant, visibleMouseMove, anchorEl, anchorElTangle } = this.state;
    let background = 'rgba(0,0,0,0.5)',
      icon_color = '#FAFAFA',
      boxShadow = '2px 3px 2px rgba(0, 0, 0, 0.45)',
      height = 36,
      borderRadius = '8px';
    if (!visibleImportant && !visibleMouseMove) {
      background = 'rgba(0,0,0,0.1)';
      icon_color = '#9E9E9E';
      boxShadow = '';
      height = 32;
      borderRadius = '8px';
    }
    const open = Boolean(anchorEl);
    return (
        <div
          style={{
            ...styles.tool_bar,
            background: background,
            boxShadow: boxShadow,
            height: height,
            borderRadius: borderRadius
          }}
        >
          <Button size="small" title={this.label_rotate_left} ><IconTotateLeft /></Button>
          <Button size="small" title={this.label_rotate_right} ><IconTotateRight /></Button>
        </div>
    );
  }
}
export default withStyles(styles)(ToolbarEdit);
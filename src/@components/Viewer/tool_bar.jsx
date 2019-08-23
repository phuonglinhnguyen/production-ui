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
// import IconZoomIn from 'material-ui/svg-icons/action/zoom-in';
// import IconZoomOut from 'material-ui/svg-icons/action/zoom-out';
// import IconTotateLeft from 'material-ui/svg-icons/image/rotate-left';
// import IconTotateRight from 'material-ui/svg-icons/image/rotate-right';
import { I18n } from 'react-redux-i18n';
import Draggable from 'react-draggable';
import { debounce } from '../../utils/common';
import Slider, { defaultValueReducer } from '@material-ui/lab/Slider';

function valueReducer(rawValue, props, event) {
  const { disabled, max, min, step } = props;

  function roundToStep(number) {
    return Math.round(number / step) * step;
  }

  if (!disabled && step) {
    if (rawValue > min && rawValue < max) {
      if (rawValue === max - step) {
        // If moving the Slider using arrow keys and value is formerly an maximum edge value
        return roundToStep(rawValue + step / 2);
      }
      if (rawValue === min + step) {
        // Same for minimum edge value
        return roundToStep(rawValue - step / 2);
      }
      return roundToStep(rawValue);
    }
    return rawValue;
  }

  return defaultValueReducer(rawValue, props, event);
}
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
const options = [
  {
    name: 'draw_poly',
    title: 'Draw Poly',
  },
  {
    name: 'draw',
    title: 'Drawing Grid',
  },
  {
    name: 'focusField',
    title: 'Focus Field',
  },
  {
    name: 'focusLine',
    title: 'Focus Line',
  }
]
const getBetweenNum = (val, min, max) => {
  //  return val<=min?min:val>=max?max
  return Math.min(Math.max(val, min), max)
}
const cancelEvent = (event) => {
  event.preventDefault();
  event.stopPropagation();
}
const ITEM_HEIGHT = 48;
const stylesPopover = theme => ({
  paper: {
    padding: theme.spacing.unit,
    height: 100,
    width: 40,
    overflow:'hidden'
  },
  root: {
    display: 'flex',
    height: 70,
  },
  slider: {
    padding: '8px 20px',
  },
});

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.label_zoom_in = I18n.t('canvas.zoom_in');
    this.label_zoom_out = I18n.t('canvas.zoom_out');
    this.label_rotate_left = I18n.t('canvas.rotate_left');
    this.label_rotate_right = I18n.t('canvas.rotate_right');
    this.state = {
      visibleMouseMove: false,
      visibleImportant: false,
      rotateStep: 0,
      tangle: 0,
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
  mouseEnter = () => {
    this.setState({ visibleImportant: true });
  }

  mouseLeave = () => {
    this.setState({ visibleImportant: false });
  }
  _setRef = (node) => {
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
  handleOpenSetting = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseSetting = (event) => {
    cancelEvent(event)
    this.setState({ anchorEl: null });
  };
  handleChange = name => event => {
    cancelEvent(event)
    this.props.onChange(name,event.target.checked )
    // this.setState({ [name]: event.target.checked });
  };
  handleChangeItem = (name, data) => {
    this.props.onChange(name, data)
  }
  handleChangeRotateStep = (step) => () => {
    step = step > 3 ? 0 : step < 0 ? 3 : step;
    this.setState({ rotateStep: step, tangle: 0 });
    this.props.onChange('rotate', step * 90);
  }
  handleRotate = (event, value) => {
    this.setState({ tangle: value });
    this.props.onChange('rotate', this.state.rotateStep * 90 + value / 100);
  };
  handlePopoverClose = () => {
    this.setState({ anchorElTangle: null });
  };
  handleOpenTange = event => {
    this.setState({ anchorElTangle: event.currentTarget });
  };
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
      borderRadius = '3px';
    }
    const open = Boolean(anchorEl);
    return (
      // <Draggable bounds="parent" ref="toolbar">
        <div
          style={{
            ...styles.tool_bar,
            background: background,
            boxShadow: boxShadow,
            height: height,
            borderRadius: borderRadius
          }}
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
          ref={this._setRef}
        >
          {/* <Button size="small" title={this.label_zoom_in} ><IconZoomIn /></Button> */}
          {/* <Button size="small" title={this.label_zoom_out} ><IconZoomOut /></Button> */}
          <Button size="small" title={this.label_rotate_left} onClick={this.handleChangeRotateStep(this.state.rotateStep - 1)} ><IconTotateLeft /></Button>
          <Button size="small" title={this.label_rotate_right} onClick={this.handleChangeRotateStep(this.state.rotateStep + 1)} ><IconTotateRight /></Button>
          <Button size="small" title={'Tangle'} onClick={this.handleOpenTange}>{this.state.tangle / 100}</Button>
          <Popover
            // className={classes.popover}
            classes={{
              paper: classes.paper,
            }}
            open={Boolean(anchorElTangle)}
            anchorEl={anchorElTangle}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            onClose={this.handlePopoverClose}
            disableRestoreFocus
          >
            <div className={classes.root}>
              <Slider
                valueReducer={valueReducer}
                classes={{ container: classes.slider }}
                min={0}
                max={9000}
                step={1}
                vertical
                value={this.state.tangle}
                aria-labelledby="label"
                onChange={this.handleRotate}
              />
            </div>
          </Popover>
          <Button size="small" title={this.label_setting} onClick={this.handleOpenSetting} ><IconSettings /></Button>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={this.handleCloseSetting}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: 200,
              },
            }}
          >
            {options.map(option => (
              <MenuItem key={option.name} onClick={event =>{cancelEvent(event); this.handleChangeItem(option.name, !Boolean(config[option.name]))}}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(config[option.name])}
                      onChange={this.handleChange(option.name)}
                      value={option.name}
                    />
                  }
                  label={option.title}
                />
              </MenuItem>
            ))}
          </Menu>
          {/* <FlatButton
            style={styles.button}
            onClick={zoomIn}
            title={}
            icon={<IconZoomIn color={icon_color} />}
          />
          <FlatButton
            style={styles.button}
            onClick={zoomOut}
            title={}
            icon={<IconZoomOut color={icon_color} />}
          />
          <FlatButton
            style={styles.button}
            onClick={rotateLeft}
            title={}
            icon={<IconTotateLeft color={icon_color} />}
          />
          <FlatButton
            style={styles.button}
            onClick={rotateRight}
            title={}
            icon={<IconTotateRight color={icon_color} />}
          /> */}

        </div>
      // </Draggable>
    );
  }
}
export default withStyles(stylesPopover)(Toolbar);
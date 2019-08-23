Object.defineProperty(exports, '__esModule', {
  value: true
});

var _colors = require('material-ui/styles/colors');

var _spacing = require('material-ui/styles/spacing');

var _colorManipulator = require('material-ui/utils/colorManipulator');

var _spacing2 = _interopRequireDefault(_spacing);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = {
  spacing: _spacing2.default,
  fontFamily: 'Roboto, sans-serif',
  borderRadius: 2,
  palette: {
    primary1Color: _colors.indigo500,
    primary2Color: _colors.indigo700,
    primary3Color: _colors.grey400,
    accent1Color: _colors.pinkA200,
    accent1FadeColor: (0, _colorManipulator.fade)(_colors.pinkA200, 0.34),
    accent2Color: _colors.grey200,
    accent3Color: _colors.grey500,
    textColor: _colors.darkBlack,
    secondaryTextColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.54),
    alternateTextColor: _colors.white,
    canvasColor: _colors.white,
    borderColor: _colors.grey300,
    disabledColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.4),
    pickerHeaderColor: _colors.indigo500,
    clockCircleColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.07),
    shadowColor: _colors.fullBlack,
    background1Color: _colors.grey100,
    background2Color: _colors.grey200,
    background3Color: _colors.grey300,
    background4Color: _colors.grey400,
    card1Color: _colors.cyan800,
    statistical1Color : _colors.cyan500,
    statistical2Color : _colors.red900,
    statistical3Color : _colors.teal500,
    statistical4Color : _colors.deepPurple500
  },

  formInput: {
    background: _colors.grey100
  },
  layout: {
    background: _colors.grey200
  },
  qcReasonColor: {
    error: {
      background: _colors.red400,
      color: 'white'
    },
    no_error: {
      background: _colors.blue400,
      color: 'white'
    },
    focus: {
      background: _colors.yellow50,
      color: _colors.grey900
    },
    default: {
      background: 'transparent',
      color: _colors.grey900
    }
  },
  layout_definition: {
    warning_position: {
      color: _colors.lime900
    }
  },
  notification: {
    info: {
      color: _colors.indigoA200
    },
    success: {
      color: _colors.greenA400
    },
    warning: {
      color: _colors.yellow300
    },
    error: {
      color: _colors.red500
    }
  }
};

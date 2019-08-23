import * as React from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Snackbar from 'material-ui/Snackbar';
import LinearProgress from 'material-ui/LinearProgress';
import lodash from 'lodash';

import { closeSnackbar } from './actionCreator';


class CommonProcessing extends React.Component {
    shouldComponentUpdate(nextProps) {
      const props = { ...this.props };
      for (var key in props) {
        if (props.hasOwnProperty(key) && nextProps.hasOwnProperty(key)) {
          if (
            !lodash.isEqual(props[key], nextProps[key]) &&
            typeof props[key] !== 'function'
          ) {
            return true;
          }
        }
      }
      return false;
    }
  
    render() {
      let { Translate, muiTheme } = this.props;
      let {
        is_error,
        is_processing,
        show_snack_bar,
        common_name,
        status_text,
        reason
      } = this.props.snackbar;
  
      return (
        <div>
          {is_processing && (
            <div className="component-processing">
              <LinearProgress
                style={{ position: 'fixed', zIndex: 1000 }}
                mode="indeterminate"
              />
            </div>
          )}
  
          <Snackbar
            open={show_snack_bar}
            autoHideDuration={4000}
            message={
              <Translate value={status_text} name={common_name} reason={reason} />
            }
            onRequestClose={this.props.closeSnackbar}
            contentStyle={{
              whiteSpace: 'pre-line',
              color: is_error
                ? muiTheme.palette.accent1Color
                : muiTheme.palette.accent2Color
            }}
            bodyStyle={{ height: 'auto' }}
          />
        </div>
      );
    }
  }
  
  CommonProcessing.propTypes = {
    is_processing: PropTypes.bool,
    show_snack_bar: PropTypes.bool,
  
    status_text: PropTypes.string
  };








const mapStateToProps = state => {
  const { snackbar } = state;
  return { snackbar };
};

const mapDispatchToProps = dispatch => ({
  closeSnackbar: () => {
    dispatch(closeSnackbar());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CommonProcessing);

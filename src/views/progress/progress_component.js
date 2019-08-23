import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  root: {
      maxWidth: 'max-content',
      width: '100%',
      margin: '0 auto'
  }
});

class ProgressComponent extends React.Component {
  state = {
    completed: 0,
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };

  render() {
    const { classes, size } = this.props;
    return (
      <div  className={classes.root}>
        <CircularProgress
          className={classes.progress}
          variant="determinate"
          value={this.state.completed}
          size={size && size || 30}
        />
        {/* <CircularProgress
          className={classes.progress}
          variant="determinate"
          value={this.state.completed}
          color="secondary"
        /> */}
      </div>
    );
  }
}

ProgressComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProgressComponent);

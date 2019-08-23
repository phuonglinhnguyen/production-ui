import React from 'react';

import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import { GridList, GridTile } from 'material-ui/GridList';

import { isEqual } from 'lodash';

import { Translate } from 'react-redux-i18n';

const styles = {
  main: {
    alignItems: 'center',
    background: '#212121',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1
  },
  gridList: {
    color: '#BDBDBD',
    paddingTop: 50,
    width: 450
  },
  button: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 400,
    lineHeight: '35px',
    paddingLeft: 3,
    paddingRight: 3
  },
  label_decription: {
    paddingRight: 15,
    textAlign: 'right'
  },
  label_shortcut: {
    color: '#FFFFFF'
  }
};

class VerifyKeyImageEmpty extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    const charCode = event.charCode;

    if (charCode === 13 && this.props.is_empty_state) {
      this.props.getTask(false);
    }
  }

  componentDidMount() {
    window.addEventListener('keypress', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyDown);
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    const { is_empty_state, is_getting_task, getTask } = this.props;
    if (!is_empty_state) {
      return null;
    }

    if (is_getting_task) {
      return (
        <Paper style={styles.main}>
          <RaisedButton
            icon={<CircularProgress size={25} />}
            label={<Translate value={'productions.verify_key.getting_task'} />}
          />
        </Paper>
      );
    }

    return (
      <Paper style={styles.main}>
        <div
          style={{
            color: 'white',
            fontSize: 20
          }}
        >
          {'Please press ENTER KEY or '}
          <FlatButton
            label={<Translate value="productions.verify_key.click_here" />}
            labelStyle={styles.button}
            onClick={() => getTask()}
            style={{ minWidth: 80 }}
          />
          {' to get task'}
        </div>
        <GridList style={styles.gridList} cellHeight={30} cols={2}>
          <Subheader style={{ color: '#FFFFFF' }}>
            <Translate value={'productions.verify_key.shortcuts'} />
          </Subheader>
          <GridTile style={styles.label_decription}>
            <Translate value={'productions.verify_key.save_task'} />
          </GridTile>
          <GridTile style={styles.label_shortcut}>{'Alt + S'}</GridTile>
        </GridList>
      </Paper>
    );
  }
}

export default VerifyKeyImageEmpty;

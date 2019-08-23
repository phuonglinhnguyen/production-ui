import React from 'react';

import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import { GridList, GridTile } from 'material-ui/GridList';

import ArrowDown from 'material-ui/svg-icons/navigation/arrow-downward';
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-upward';

import _ from 'lodash';

import { Translate } from 'react-redux-i18n';

const styles = {
  main: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    background: '#212121'
  },
  gridList: {
    width: 450,
    paddingTop: 50,
    color: "#BDBDBD",
  },
  button: {
    fontWeight: 400,
    fontSize: 20,
    paddingLeft: 3,
    paddingRight: 3,
    color: '#FFFFFF',
    lineHeight: '35px'
  },
  label_decription: {
    textAlign: 'right',
    paddingRight: 15
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

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  render() {
    const { is_empty_state, is_fetching_task_verify_key, getTask } = this.props;
    if (!is_empty_state) {
      return null;
    }

    if (is_fetching_task_verify_key) {
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
          <GridTile style={styles.label_decription}>
            <Translate value={'productions.verify_key.select_layout'} />
          </GridTile>
          <GridTile style={styles.label_shortcut}>
            <Translate value={'productions.verify_key.number_keys'} />
          </GridTile>
          <GridTile style={styles.label_decription}>
            <Translate value={'productions.verify_key.go_next_back_up_down'} />
          </GridTile>
          <GridTile>
            <ArrowDown color="#FFFFFF" />
            <ArrowUp color="#FFFFFF" />
          </GridTile>
        </GridList>
      </Paper>
    );
  }
}

export default VerifyKeyImageEmpty;

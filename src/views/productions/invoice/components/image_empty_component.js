import React from 'react';

import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import { GridList, GridTile } from 'material-ui/GridList';

import ArrowDown from 'material-ui/svg-icons/navigation/arrow-downward';
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';

import _ from 'lodash';

import { Translate } from 'react-redux-i18n';

const styles = {
  main: {
    top: 0,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    background: '#212121'
  },
  gridList: {
    width: 450,
    paddingTop: 50,
    color: '#BDBDBD'
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

class InvoiceImageEmpty extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getTaskInvoice = this.getTaskInvoice.bind(this);
  }

  getTaskInvoice(first_load) {
    const { action_getTask, history, params, username } = this.props;
    const taskKeyDef = params.taskKeyDef;
    if (first_load && taskKeyDef.indexOf('/') < 0) {
      return;
    }
    return action_getTask(username, params, history);
  }

  handleKeyDown(event) {
    const charCode = event.charCode;

    if (charCode === 13 && this.props.is_empty_state) {
      this.getTaskInvoice(false);
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
    const { is_claimming_task, is_saving } = this.props;
    if (is_saving) {
      return (
        <Paper style={{ ...styles.main, height: '100%' }}>
          <RaisedButton
            icon={<CircularProgress size={25} />}
            label={
              <Translate value={'productions.keying_invoice.saving_task'} />
            }
          />
        </Paper>
      );
    }

    if (is_claimming_task) {
      return (
        <Paper style={{ ...styles.main, height: '100%' }}>
          <RaisedButton
            icon={<CircularProgress size={25} />}
            label={
              <Translate value={'productions.keying_invoice.getting_task'} />
            }
          />
        </Paper>
      );
    }

    return (
      <Paper style={{ ...styles.main, height: '100%' }}>
        <div
          style={{
            color: 'white',
            fontSize: 20
          }}
        >
          {'Please press ENTER KEY or '}
          <FlatButton
            label={<Translate value="productions.keying_invoice.click_here" />}
            labelStyle={styles.button}
            onClick={() => this.getTaskInvoice()}
            style={{ minWidth: 80 }}
          />
          {' to get task'}
        </div>
        <GridList style={styles.gridList} cellHeight={30} cols={2}>
          <Subheader style={{ color: '#FFFFFF' }}>
            <Translate value={'productions.keying_invoice.shortcuts'} />
          </Subheader>
          <GridTile style={styles.label_decription}>
            <Translate value={'productions.keying_invoice.save_task'} />
          </GridTile>
          <GridTile style={styles.label_shortcut}>{'Alt + S'}</GridTile>
          <GridTile style={styles.label_decription}>
            <Translate
              value={'productions.keying_invoice.go_next_back_up_down'}
            />
          </GridTile>
          <GridTile>
            <ArrowForward color="#FFFFFF" />
            <ArrowBack color="#FFFFFF" />
            <ArrowUp color="#FFFFFF" />
            <ArrowDown color="#FFFFFF" />
          </GridTile>
        </GridList>
      </Paper>
    );
  }
}

export default InvoiceImageEmpty;

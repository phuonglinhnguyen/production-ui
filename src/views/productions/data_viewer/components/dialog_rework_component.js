import React from 'react';

import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox/Checkbox';

import { isEqual, findIndex } from 'lodash';

import { TextField } from 'material-ui';

class ReworkDialogComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: [],
      comment: '',
      checked: true,
      error_select: '',
      error_comment: ''
    };
    this.menuItems = this.menuItems.bind(this);
    this.handleSaveRework = this.handleSaveRework.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    for (let key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        if (
          !key.includes('action') &&
          !isEqual(nextProps[key], this.props[key])
        ) {
          return true;
        }
      }
    }
    for (let key_state in nextState) {
      if (!isEqual(nextState[key_state], this.state[key_state])) {
        return true;
      }
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      values: [],
      comment: '',
      error_select: '',
      error_comment: ''
    });
  }

  handleChange = (event, index, values) => {
    const { fields } = this.props;
    if (Array.isArray(values[values.length - 1])) {
      if (values.length === fields.length + 1) {
        return this.setState({ values: [] });
      }
      return this.setState({ values: fields, error_select: '' });
    }
    this.setState({ values, error_select: '' });
  };

  handleChangeComment = event =>
    this.setState({ comment: event.target.value, error_comment: '' });

  menuItems() {
    const { fields } = this.props;
    const { values } = this.state;
    return fields.map(_f => (
      <MenuItem
        key={_f.name}
        insetChildren={true}
        checked={values && findIndex(values, _v => _v.id === _f.id) > -1}
        value={_f}
        primaryText={_f.name}
      />
    ));
  }

  handleSaveRework = (values, comment, checked) => {
    const { Translate, action_saveRework } = this.props;
    if (values.length === 0) {
      return this.setState({
        error_select: (
          <Translate value="productions.data_viewer.select_field_error" />
        )
      });
    }
    if (!comment) {
      return this.setState({
        error_comment: (
          <Translate value="productions.data_viewer.comment_error" />
        )
      });
    }

    action_saveRework(values, comment, checked);
  };

  render() {
    const { Translate, action_closeDialog, fields, open_dialog } = this.props;
    const {
      values,
      comment,
      checked,
      error_comment,
      error_select
    } = this.state;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => action_closeDialog()}
      />,
      <FlatButton
        label="Rework"
        primary={true}
        onClick={() => this.handleSaveRework(values, comment, checked)}
      />
    ];

    return (
      <Dialog
        actions={actions}
        modal={false}
        open={open_dialog}
        title="Rework settings"
      >
        <SelectField
          errorText={error_select}
          multiple={true}
          hintText={<Translate value="productions.data_viewer.rework_field" />}
          value={values}
          fullWidth={true}
          onChange={this.handleChange}
        >
          <MenuItem
            insetChildren={true}
            checked={values && values.length === fields.length}
            value={fields}
            primaryText={'All'}
          />
          {this.menuItems()}
        </SelectField>
        <TextField
          errorText={error_comment}
          fullWidth={true}
          floatingLabelText={
            <Translate value="productions.data_viewer.comment" />
          }
          value={comment}
          onChange={this.handleChangeComment}
        />
        <Checkbox
          label={<Translate value="productions.data_viewer.rework_owner" />}
          checked={checked}
          onCheck={(e, isChecked) => this.setState({ checked: isChecked })}
        />
      </Dialog>
    );
  }
}

export default ReworkDialogComponent;

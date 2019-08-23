import React from 'react';

import VerifyKeyDataFields from './verify_key_data_document_component';
import VerifyKeyDataAction from '../../common/button_actions';

import _ from 'lodash';

const styles = {
  main: {
    flex: '1',
    margin: '16px 5px 16px 4px'
  }
};

class VerifyKeyData extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.saveTask = this.saveTask.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props, nextProps);
  }

  handleKeyDown(event) {
    if (event.keyCode === 112 || event.keyCode === 113) {
      const index_name = event.keyCode === 112 ? 'value_1' : 'value_2';
      this.props.action_onKeyDownSelectValue(index_name);
      event.preventDefault();
    }
  }

  componentWillMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.props.action_resetState();
  }

  saveTask() {
    const {
      username,
      history,
      params,
      next_task,

      action_saveTask
    } = this.props;
    action_saveTask(
      username,
      params.projectId,
      params.layoutName,
      params.sectionName,
      params.taskKeyDef.split('/')[0],
      next_task,
      history
    );
  }

  render() {
    const {
      action_onBlurField,
      action_onFocusField,
      action_onKeyPressFocus,
      action_onModifyFieldValue,
      action_onSelectRecord,
      action_updateNextTask,
      data_document,
      data_final,
      error_document,
      field_definitions,
      focus_details,
      is_empty_state,
      is_fetching_task_verify_key,
      is_saving,
      next_task,
      primary1Color,
      accent1Color,
      muiTheme
    } = this.props;

    return (
      <div style={styles.main}>
        <VerifyKeyDataAction
          is_disabled={is_empty_state}
          is_saving={is_saving}
          next={next_task}
          saveTask={this.saveTask}
          updateNextTask={action_updateNextTask}
          muiTheme={muiTheme}
        />

        <VerifyKeyDataFields
          action_onBlurField={action_onBlurField}
          action_onFocusField={action_onFocusField}
          action_onKeyPressFocus={action_onKeyPressFocus}
          action_onModifyFieldValue={action_onModifyFieldValue}
          action_onSelectRecord={action_onSelectRecord}
          data_document={data_document}
          data_final={data_final}
          error_document={error_document}
          field_definitions={field_definitions.data}
          focus_details={focus_details}
          is_empty_state={is_empty_state || is_fetching_task_verify_key}
          primary1Color={primary1Color}
          accent1Color={accent1Color}
        />
      </div>
    );
  }
}

export default VerifyKeyData;

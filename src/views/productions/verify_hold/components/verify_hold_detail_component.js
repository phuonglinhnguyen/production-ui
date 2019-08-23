import React from 'react';

import VerifyHoldData from './verify_hold_detail_item_component';
import VerifyHoldDataAction from '../../common/button_actions';

import { isEqual } from 'lodash';

const styles = {
  main: {
    flex: '0 0 30%',
    height: '100%',
    position: 'relative'
  }
};

class VerifyHoldTask extends React.Component {
  constructor(props) {
    super(props);

    this.saveTask = this.saveTask.bind(this);
  }

  shouldComponentUpdate(nextProps) {
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
    return false;
  }
  componentWillUnmount() {
    this.props.action_resetState();
  }

  saveTask() {
    const { username, history, match, action_saveTask } = this.props;
    const { projectId, taskKeyDef, docSize } = match.params;
    const arrs = taskKeyDef.split('/');

    action_saveTask(projectId, arrs[0], docSize, username, history);
  }

  render() {
    const {
      Translate,
      action_modifyComment,
      action_modifyHold,
      action_updateNextTask,
      is_empty_state,
      is_saving,
      muiTheme,
      next_task,
      section_error,
      task
    } = this.props;

    return (
      <div style={styles.main}>
        <VerifyHoldDataAction
          is_disabled={is_empty_state}
          is_saving={is_saving}
          muiTheme={muiTheme}
          next={next_task}
          saveTask={this.saveTask}
          updateNextTask={action_updateNextTask}
        />
        {!is_empty_state && (
          <VerifyHoldData
            Translate={Translate}
            action_modifyComment={action_modifyComment}
            action_modifyHold={action_modifyHold}
            muiTheme={muiTheme}
            section_error={section_error}
            task={task}
          />
        )}
      </div>
    );
  }
}

export default VerifyHoldTask;

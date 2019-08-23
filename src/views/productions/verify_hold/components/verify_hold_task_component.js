import React from 'react';

import VerifyHoldTaskItem from './verify_hold_task_item_component';

import { isEqual } from 'lodash';

class VerifyHoldTask extends React.Component {
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

  render() {
    const {
      Translate,
      action_selectTask,
      is_empty_state,
      muiTheme,
      task_index_selected,
      tasks
    } = this.props;

    return (
      <div
        className="special_scroll"
        style={{
          flex: '0 0 20%',
          overflowX: 'auto',
          height: 'calc(100vh) - 64px'
        }}
      >
        {!is_empty_state &&
          tasks.map((_t, i) => {
            return (
              <VerifyHoldTaskItem
                key={`task-${i}`}
                Translate={Translate}
                action_selectTask={action_selectTask}
                is_selected={task_index_selected === i}
                muiTheme={muiTheme}
                task={_t}
                task_index={i}
              />
            );
          })}
      </div>
    );
  }
}

export default VerifyHoldTask;

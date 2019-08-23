import React from 'react';

import VerifyHoldImageCanvas from './verify_hold_image_canvas_component';
import VerifyHoldImageEmpty from './verify_hold_image_empty_component';

import { isEqual } from 'lodash';

class VerifyHoldTask extends React.Component {
  componentWillMount() {
    this.getTask(true);
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

  getTask(first_load) {
    const { username, history, action_getTask, match } = this.props;
    const { projectId, taskKeyDef, docSize } = match.params;

    if (first_load && taskKeyDef.indexOf('/') < 0) {
      return;
    }
    const arrs = taskKeyDef.split('/');

    action_getTask(projectId, arrs[0], docSize, username, history);
  }

  render() {
    const {
      Translate,
      is_empty_state,
      is_getting_task,
      url_image
    } = this.props;
    const styles = {
      main: {
        flex: '0 0 50%',
        height: '100%',
        position: 'relative'
      }
    };

    return (
      <div style={styles.main}>
        <VerifyHoldImageCanvas
          Translate={Translate}
          is_empty_state={is_empty_state}
          url_image={url_image}
        />
        <VerifyHoldImageEmpty
          getTask={this.getTask.bind(this)}
          is_empty_state={is_empty_state}
          is_getting_task={is_getting_task}
        />
      </div>
    );
  }
}

export default VerifyHoldTask;

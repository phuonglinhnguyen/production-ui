import React from 'react';

import VerifyKeyImageCanvas from './verify_key_image_canvas_component';
import VerifyKeyImageEmpty from './verify_key_image_empty_component';

import _ from 'lodash';

const styles = {
  main: {
    flex: '0 0 60%',
    position: 'relative',
    margin: '16px 4px 16px 16px'
  }
};

class VerifyKeyImage extends React.Component {
  componentWillMount() {
    this.getTask(true);
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props, nextProps);
  }

  getTask(first_load) {
    const {
      layoutName,
      projectId,
      sectionName,
      taskKeyDef
    } = this.props.match.params;
    const { username, history } = this.props;

    if (first_load && taskKeyDef.indexOf('/') < 0) {
      return;
    }
    const arrs = taskKeyDef.split('/');

    this.props.action_getTask(
      projectId,
      arrs[0],
      first_load && arrs.length > 0 ? arrs[1] : null,
      username,
      history,
      layoutName,
      sectionName
    );
  }

  render() {
    const {
      is_empty_state,
      is_fetching_task_verify_key,
      is_render,
      positions,
      url_image
    } = this.props;

    return (
      <div style={styles.main}>
        <VerifyKeyImageCanvas
          is_empty_state={is_empty_state}
          is_render={is_render}
          positions={positions}
          url_image={url_image}
        />
        <VerifyKeyImageEmpty
          getTask={this.getTask.bind(this)}
          is_empty_state={is_empty_state}
          is_fetching_task_verify_key={is_fetching_task_verify_key}
        />
      </div>
    );
  }
}

export default VerifyKeyImage;

import React from "react";

import ClassifyDataAction from "../../common/button_actions";
import GroupImagesDataTableComponent from "./group_images_data_table_component";

// import _ from "lodash";
// import { Translate } from "react-redux-i18n";

const styles = {
  main: {
    flex: "1",
    padding: "4px 4px 4px 6px"
  }
};

class ClassifyData extends React.Component {
  constructor(props) {
    super(props);

    this.saveTask = this.saveTask.bind(this);
  }

  componentWillUnmount() {
    this.props.actions.resetState();
  }

  saveTask(reason) {
    const { username, match, actions } = this.props;
    const { projectId, taskKeyDef } = match.params;
    actions.saveTask(username, projectId, taskKeyDef, reason);
  }

  render() {
    const {
      group_images,

      actions
    } = this.props;
    return (
      <div style={styles.main} className="cool_scroll">
        <ClassifyDataAction
          next={group_images.next}
          reasons={group_images.complete_reason}
          is_saving={group_images.is_saving}
          is_disabled={group_images.is_disabled}
          updateNextTask={actions.updateNextTask}
          saveTask={() => this.saveTask(null)}
          saveTaskWithReason={reason => this.saveTask(reason)}
        />
        <GroupImagesDataTableComponent
          groups={group_images.groups}
          reasons={group_images.complete_reason}
          is_empty={group_images.is_empty}
          selectReason={actions.selectReason}
          changeBarcode={actions.changeBarcode}
        />
      </div>
    );
  }
}

export default ClassifyData;

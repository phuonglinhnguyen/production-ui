import React from "react";

import Snackbar from "material-ui/Snackbar";

import ClassifyImageListGridComponent from "./group_images_list_grid_component";
import ClassifyImageListEmptyComponent from "./group_images_list_empty_component";
import ClassifyImageListCanvasComponent from "./group_images_list_canvas_component";

import { Translate } from "react-redux-i18n";

const styles = {
  main: {
    flex: "0 0 70%",
    position: "relative"
  }
};

class GroupImagesList extends React.Component {
  constructor(props) {
    super(props);

    this.getTask = this.getTask.bind(this);
  }

  getTask() {
    const { projectId, taskKeyDef } = this.props.match.params;
    const { username, history } = this.props;

    this.props.actions.getTask(projectId, taskKeyDef, username, history);
  }

  render() {
    const {
      group_images,
      muiTheme,

      actions
    } = this.props;
    return (
      <div ref="main_div" style={styles.main}
      >
        <ClassifyImageListEmptyComponent
          {...group_images}
          getTask={this.getTask}
        />
        <ClassifyImageListGridComponent
          {...group_images}
          actions={actions}
          primary1Color={muiTheme.palette.primary1Color}
        />
        <ClassifyImageListCanvasComponent
          image_name={group_images.image_name}
          image_s3={group_images.image_s3}
          is_show_canvas={group_images.is_show_canvas}
          hideCanvas={actions.hideCanvas}
          primary1Color={muiTheme.palette.primary1Color}
        />
        <Snackbar
          open={group_images.is_show_error}
          message={<Translate value={group_images.status_text} />}
          onRequestClose={actions.closeSnackBar}
        />
      </div>
    );
  }
}

export default GroupImagesList;

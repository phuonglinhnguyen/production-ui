import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import GroupImagesListComponent from "../components/group_images_list_component";
import GroupImagesDataComponent from "../components/group_images_data_component";

import * as actions from "../actions/group_images_action";

import muiThemeable from "material-ui/styles/muiThemeable";

const GroupImagesContainer = props => {
  const style_main = {
    height: "calc(100vh - 67px)",
    width:"100%",
    display: "flex",
    flexWrap: "Wrap",
    backgroundColor: props.muiTheme.palette.background1Color
  };
  return (
    <div style={style_main}>
      <GroupImagesListComponent {...props} />
      <GroupImagesDataComponent {...props} />
    </div>
  );
};

const mapStateToProps = state => {
  const group_images = state.production.group_images;
  const { user } = state;

  return {
    username: user.user.username,
    group_images
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
  muiThemeable()(GroupImagesContainer)
);

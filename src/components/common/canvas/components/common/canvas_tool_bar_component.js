import React from "react";

import FlatButton from "material-ui/FlatButton";
import { List, ListItem, makeSelectable } from "material-ui/List";

import Draggable from "react-draggable";

import CenterFocusStrong from "material-ui/svg-icons/image/center-focus-strong";
import IconZoomIn from "material-ui/svg-icons/action/zoom-in";
import IconZoomOut from "material-ui/svg-icons/action/zoom-out";
import IconTotateLeft from "material-ui/svg-icons/image/rotate-left";
import IconTotateRight from "material-ui/svg-icons/image/rotate-right";

import wrapState from "../../../../SelectableList/SelectableList";

import _ from "lodash";

import { I18n } from "react-redux-i18n";

let SelectableList = makeSelectable(List);
SelectableList = wrapState(SelectableList);

const styles = {
  tool_bar: {
    top: 10,
    left: 10,
    position: "absolute",
    width: 45,
    backgroundColor: "#424242",
    borderRadius: "3px",
    boxShadow: "2px 3px 2px rgba(0, 0, 0, 0.45)"
  },
  button: {
    minWidth: 45,
    height: 45
  },
  icon_color: "#FFFFFF"
};

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type_index: 0,
      open: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
    );
  }

  handleRequestChange(type_index) {
    this.setState({ type_index: type_index });
  }

  render() {
    const {
      draw,

      zoomIn,
      zoomOut,
      rotateLeft,
      rotateRight,
      resetZoomRotate
    } = this.props;

    const { type_index } = this.state;

    const label_zoom_in = I18n.t("commons.canvas.zoom_in");
    const label_zoom_out = I18n.t("commons.canvas.zoom_out");
    const label_rotate_left = I18n.t("commons.canvas.rotate_left");
    const label_rotate_right = I18n.t("commons.canvas.rotate_right");
    const label_reset_zoom_rotate = I18n.t("commons.canvas.reset_zoom_rotate");

    return (
      <Draggable bounds="parent">
        <div style={styles.tool_bar}>
          <SelectableList
            defaultValue={type_index}
            style={{ padding: 0 }}
            handleRequestChange={this.handleRequestChange.bind(this)}
          >
            <ListItem
              value={3}
              innerDivStyle={{ padding: 0 }}
              children={
                <FlatButton
                  key={3}
                  style={styles.button}
                  onClick={zoomIn}
                  title={label_zoom_in}
                  icon={<IconZoomIn color={styles.icon_color} />}
                />
              }
            />
            <ListItem
              value={4}
              innerDivStyle={{ padding: 0 }}
              children={
                <FlatButton
                  key={4}
                  style={styles.button}
                  onClick={zoomOut}
                  title={label_zoom_out}
                  icon={<IconZoomOut color={styles.icon_color} />}
                />
              }
            />
            {!draw && (
              <ListItem
                value={5}
                innerDivStyle={{ padding: 0 }}
                children={
                  <FlatButton
                    key={5}
                    style={styles.button}
                    onClick={rotateLeft}
                    title={label_rotate_left}
                    icon={<IconTotateLeft color={styles.icon_color} />}
                  />
                }
              />
            )}
            {!draw && (
              <ListItem
                value={6}
                innerDivStyle={{ padding: 0 }}
                children={
                  <FlatButton
                    key={6}
                    style={styles.button}
                    onClick={rotateRight}
                    title={label_rotate_right}
                    icon={<IconTotateRight color={styles.icon_color} />}
                  />
                }
              />
            )}
            <ListItem
              value={7}
              innerDivStyle={{ padding: 0 }}
              children={
                <FlatButton
                  key={7}
                  style={styles.button}
                  onClick={resetZoomRotate}
                  title={label_reset_zoom_rotate}
                  icon={<CenterFocusStrong color={styles.icon_color} />}
                />
              }
            />
          </SelectableList>
        </div>
      </Draggable>
    );
  }
}

export default Toolbar;

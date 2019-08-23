import React, { PureComponent } from "react";

import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import CircularProgress from "material-ui/CircularProgress";
import { GridList, GridTile } from "material-ui/GridList";
import Subheader from "material-ui/Subheader";

import { Translate } from "react-redux-i18n";

const styles = {
  main: {
    position: "absolute",
    top: 0,
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    background: "#212121"
  },
  button: {
    fontWeight: 400,
    fontSize: 20,
    paddingLeft: 3,
    paddingRight: 3,
    color: "#FFFFFF",
    lineHeight: "35px"
  },
  gridList: {
    width: 450,
    paddingTop: 50,
    color: "#BDBDBD"
  },
  label_decription: {
    textAlign: "right",
    paddingRight: 15
  },
  label_shortcut: {
    color: "#FFFFFF"
  }
};

class OMRImageEmpty extends PureComponent {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keypress", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keypress", this.handleKeyDown);
  }

  handleKeyDown(event) {
    const charCode = event.charCode;
    const tag = event.target.tagName.toLowerCase();

    if (tag === "input") {
      return;
    }

    if (charCode === 13 && this.props.is_empty_task) {
      this.props.action_getTask(false);
    }
  }

  render() {
    const { is_empty_task, is_fetching_task_omr, action_getTask } = this.props;

    if (!is_empty_task) {
      return null;
    }

    if (is_fetching_task_omr) {
      return (
        <div style={styles.main}>
          <RaisedButton
            icon={<CircularProgress size={25} />}
            label={<Translate value={"productions.classify.getting_task"} />}
          />
        </div>
      );
    }

    return (
      <div style={styles.main}>
        <div
          style={{
            color: "white",
            fontSize: 20
          }}
        >
          {"Please press ENTER KEY or "}
          <FlatButton
            style={{ minWidth: 80 }}
            labelStyle={styles.button}
            onClick={() => action_getTask(false)}
            label={<Translate value="productions.classify.click_here" />}
          />
          {" to get task"}
        </div>

        <GridList style={styles.gridList} cellHeight={30} cols={2}>
          <Subheader style={{ color: "#FFFFFF" }}>
            <Translate value={"productions.classify.shortcuts"} />
          </Subheader>
          <GridTile style={styles.label_decription}>
            <Translate value={"productions.classify.save_task"} />
          </GridTile>
          <GridTile style={styles.label_shortcut}>{"Ctrl + S"}</GridTile>
        </GridList>
      </div>
    );
  }
}

export default OMRImageEmpty;

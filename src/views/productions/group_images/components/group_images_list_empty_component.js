import React from "react";

import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import CircularProgress from "material-ui/CircularProgress";
import { GridList, GridTile } from "material-ui/GridList";
import Subheader from "material-ui/Subheader";

// import ArrowBack from "material-ui/svg-icons/navigation/arrow-back";
// import ArrowForward from "material-ui/svg-icons/navigation/arrow-forward";
// import ArrowDown from "material-ui/svg-icons/navigation/arrow-downward";
// import ArrowUp from "material-ui/svg-icons/navigation/arrow-upward";

import _ from "lodash";

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
  gridList: {
    width: 450,
    paddingTop: 50,
    color: "#BDBDBD"
  },
  button: {
    fontWeight: 400,
    fontSize: 20,
    paddingLeft: 3,
    paddingRight: 3,
    color: "#FFFFFF",
    lineHeight: "35px"
  },
  label_decription: {
    textAlign: "right",
    paddingRight: 15
  },
  label_shortcut: {
    color: "#FFFFFF"
  }
};

class GroupImagesEmpty extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    const charCode = event.charCode;
    const tag = event.target.tagName.toLowerCase();

    if (tag === "input") {
      return;
    }

    if (charCode === 13 && this.props.is_empty) {
      this.props.getTask();
    }
  }

  componentDidMount() {
    window.addEventListener("keypress", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keypress", this.handleKeyDown);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  render() {
    const { is_empty, is_getting, getTask } = this.props;
   
    if (!is_empty) {
      return null;
    }

    if (is_getting) {
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
            onClick={() => getTask(false)}
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
          <GridTile style={styles.label_shortcut}>{"Alt + S"}</GridTile>
        </GridList>
      </div>
    );
  }
}

export default GroupImagesEmpty;

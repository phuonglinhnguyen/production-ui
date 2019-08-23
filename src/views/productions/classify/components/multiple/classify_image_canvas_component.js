import React from "react";
import ReactDOM from "react-dom";

import FlatButton from "material-ui/FlatButton";
import Draggable from "react-draggable";

import NavigateBefore from "material-ui/svg-icons/navigation/chevron-left";
import NavigateNext from "material-ui/svg-icons/navigation/chevron-right";
import NavigateClose from "material-ui/svg-icons/navigation/close";

import CanvasContainer from "../../../../../components/common/canvas/components/view/canvas_component";

import _ from "lodash";
import { getIndexItem } from "../../common/handle_keydown";

const styles = {
  tool_action: {
    bottom: 30,
    left: "calc(50% - 165px)",
    position: "absolute",
    width: "auto",
    backgroundColor: "#FFFFFF",
    borderRadius: "3px",
    boxShadow: "2px 3px 2px rgba(0, 0, 0, 0.45)"
  },
  layout_label: {
    position: "absolute",
    minHeight: 35,
    width: 360,
    fontSize: 70,
    top: "39%",
    left: "calc(50% - 195px)",
    border: "5px solid #FF1744",
    textAlign: "center",
    color: "#FF1744",
    opacity: 0.75
  }
};

class ClassifyImageCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clientHeight: 0,
      clientWidth: 0
    };
  }

  componentDidMount() {
    var node = ReactDOM.findDOMNode(this).parentNode.parentNode;

    this.setState({
      clientHeight: node.clientHeight,
      clientWidth: node.clientWidth - 2
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
    );
  }

  handleClick(keyCode) {
    const {
      cols,
      selected_index_document,
      data_tasks_length,
      handleClick
    } = this.props;

    handleClick(
      getIndexItem(selected_index_document, cols, keyCode, data_tasks_length)
    );
  }

  render() {
    const {
      primary1Color,
      data_tasks_length,
      selected_index_document,

      show_canvas,
      selected_document,
      action_hideDocSelected
    } = this.props;
    const { clientHeight, clientWidth } = this.state;

    let s2_url = "";
    if (selected_document) {
      s2_url = selected_document.s2_url;
    }

    return (
      <div
        style={{
          display: show_canvas ? "initial" : "none",
          position: "absolute",
          top: 0,
          zIndex: 1
        }}
      >
        {selected_document &&
          selected_document.layout && (
            <div style={styles.layout_label}>
              {selected_document.layout.name}
            </div>
          )}
        <CanvasContainer
          imageUrl={show_canvas ? `${s2_url}` : ""}
          type="classify"
          hide_rectangle={true}
          heightCanvas={clientHeight}
          widthCanvas={clientWidth}
        >
          <Draggable bounds="parent">
            <div style={styles.tool_action}>
              <FlatButton
                icon={<NavigateBefore />}
                onClick={() => this.handleClick(37)}
              />
              <div
                style={{
                  width: 15,
                  display: "inline",
                  padding: "0px 15px 0 15px"
                }}
              >
                <span
                  style={{
                    color: primary1Color,
                    fontWeight: 500,
                    paddingRight: 3
                  }}
                >
                  {selected_index_document + 1}
                </span>/{data_tasks_length}
              </div>
              <FlatButton
                icon={<NavigateNext />}
                onClick={() => this.handleClick(39)}
              />
              <FlatButton
                onClick={() => action_hideDocSelected()}
                icon={<NavigateClose />}
              />
            </div>
          </Draggable>
        </CanvasContainer>
      </div>
    );
  }
}
export default ClassifyImageCanvas;

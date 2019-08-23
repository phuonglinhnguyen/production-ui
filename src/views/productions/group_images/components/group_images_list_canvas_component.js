import React from "react";
import ReactDOM from "react-dom";

import FlatButton from "material-ui/FlatButton";

import NavigateClose from "material-ui/svg-icons/navigation/close";

import Draggable from "react-draggable";
import CanvasContainer from "../../../../components/common/canvas/components/view/canvas_component";

import _ from "lodash";

const styles = {
  tool_action: {
    bottom: 30,
    left: "calc(50% - 44px)",
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
    left: "calc(50% - 44px)",
    border: "5px solid #FF1744",
    textAlign: "center",
    color: "#FF1744",
    opacity: 0.75
  }
};

class GroupImagesCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clientHeight: 0,
      clientWidth: 0
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    const { is_show_canvas, hideCanvas } = this.props;

    // const tag = event.target.id.toLowerCase();

    let keyCode = event.keyCode;

    if (keyCode === 27 && is_show_canvas) {
      hideCanvas();
      return;
    }
  }

  componentWillMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  componentDidMount() {
    var node = ReactDOM.findDOMNode(this).parentNode;

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

  render() {
    const {
      is_show_canvas,

      image_s3,
      image_name,

      hideCanvas
    } = this.props;
    const { clientHeight, clientWidth } = this.state;

    return (
      <div
        style={{
          display: is_show_canvas ? "initial" : "none",
          position: "absolute",
          top: 0,
          zIndex: 1
        }}
      >
        <CanvasContainer
          imageUrl={is_show_canvas ? `${image_s3}` : ""}
          type="classify"
          hide_rectangle={true}
          heightCanvas={clientHeight}
          widthCanvas={clientWidth}
        >
          <Draggable bounds="parent">
            <div style={styles.tool_action}>
             <div
                style={{
                  width: 15,
                  display: "inline",
                  padding: "0px 15px 0 15px"
                }}
              >
                <span
                  style={{
                    fontWeight: 500,
                    paddingRight: 3
                  }}
                >
                  {image_name}
                </span>
              </div>
              <FlatButton
                primary={true}
                onClick={() => hideCanvas()}
                icon={<NavigateClose />}
              />
            </div>
          </Draggable>
        </CanvasContainer>
      </div>
    );
  }
}
export default GroupImagesCanvas;

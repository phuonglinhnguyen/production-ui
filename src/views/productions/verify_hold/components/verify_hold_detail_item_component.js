import React from "react";
import ReactDOM from "react-dom";

import Checkbox from "material-ui/Checkbox";

import VerifyHoldSection from "./verify_hold_detail_section_component";

import { isEqual } from "lodash";

class VerifyHoldData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clientHeight: 0,
      clientWidth: 0
    };
  }

  componentDidMount() {
    let node = ReactDOM.findDOMNode(this).parentNode;
    const top = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
    this.setState({
      clientHeight: window.innerHeight - top - 2,
      clientWidth: node.clientWidth - 2
    });
  }

  shouldComponentUpdate(nextProps) {
    for (let key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        if (
          !key.includes("action") &&
          !isEqual(nextProps[key], this.props[key])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  render() {
    const {
      action_modifyComment,
      action_modifyHold,
      Translate,
      muiTheme,
      section_error,
      task
    } = this.props;
    const { clientWidth, clientHeight } = this.state;
    return (
      <div
        className="special_scroll"
        style={{
          height: clientHeight,
          overflowX: "hidden",
          overflowY: "auto",
          width: clientWidth
        }}
      >
        {task.is_wrong_line && (
          <Checkbox
            style={{ margin: 20 }}
            label="Aprrove Bad"
            checked={task.hold}
            onCheck={() => action_modifyHold(!task.hold)}
          />
        )}
        {task.hold_data.map((_s, i) => {
          return (
            <VerifyHoldSection
              key={`section-item-${i}`}
              Translate={Translate}
              action_modifyComment={action_modifyComment}
              alternateTextColor={muiTheme.palette.alternateTextColor}
              comment={_s.comment}
              data_document={_s.data_document}
              hold_count={_s.hold_count}
              is_error={section_error === i}
              lead_comment={_s.lead_comment}
              primary1Color={muiTheme.palette.primary1Color}
              reason={_s.complete_reason}
              section_index={i}
              title={
                task.is_wrong_line
                  ? `Layout : ${_s.layout_name}, Reason : ${
                      _s.complete_reason_title
                    }`
                  : `Section : ${_s.section_name}, Reason : ${
                      _s.complete_reason_title
                    }`
              }
              user={_s.user}
            />
          );
        })}
      </div>
    );
  }
}

export default VerifyHoldData;

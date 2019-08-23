import React from "react";
import ReactDOM from "react-dom";
import Paper from "material-ui/Paper";
import CanvasContainer from "../../../../components/common/canvas/components/draw/canvas_component";

import _ from "lodash";

class OMRImageCanvasComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clientHeight: 0,
      clientWidth: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }
  
  componentDidMount() {
    var node = ReactDOM.findDOMNode(this).parentNode;

    this.setState({
      clientHeight: node.clientHeight - 2,
      clientWidth: node.clientWidth
    });
  }

  selectShape({ field_index, value_index, checked }) {
    this.props.action_selectRectangle(
      field_index,
      value_index,
      checked,
      this.props.data_task
    );
  }

  render() {
    const { data_task } = this.props;
    const { clientHeight, clientWidth } = this.state;

    return (
      <div style={{ display: data_task ? "initial" : "none" }}>
        {data_task && (
          <Paper>
            <CanvasContainer
              imageUrl={data_task.s2_url}
              shapes={data_task.section}
              coordinate_focus={data_task.section.shape}
              type="omr"
              hide_rectangle={true}
              selectShape={this.selectShape.bind(this)}
              heightCanvas={clientHeight}
              widthCanvas={clientWidth}
            />
          </Paper>
        )}
      </div>
    );
  }
}

export default OMRImageCanvasComponent;

import React from "react";
import ReactDOM from "react-dom";

import CanvasContainer from "../../../../../components/common/canvas/components/view/canvas_component";

import _ from "lodash";

class ClassifyImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clientHeight: 0,
      clientWidth: 0
    };
  }

  componentDidMount() {
    var node = ReactDOM.findDOMNode(this).parentNode;

    this.setState({
      clientHeight: node.clientHeight - 2,
      clientWidth: node.clientWidth
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
    );
  }

  render() {
    const {
      url_image,
    } = this.props;
    const { clientHeight, clientWidth } = this.state;

    return (
      <CanvasContainer
        type="classify"
        imageUrl={url_image}
        hide_rectangle={true}
        heightCanvas={clientHeight}
        widthCanvas={clientWidth}
      />
    );
  }
}

export default ClassifyImage;

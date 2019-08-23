import React from 'react';
import ReactDOM from 'react-dom';

import Paper from 'material-ui/Paper';

import CanvasContainer from '../../../../components/common/canvas/components/draw/canvas_component';

import _ from 'lodash';

class VerifyKeyImage extends React.Component {
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
      clientWidth: node.clientWidth + 2
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
    );
  }

  render() {
    const { url_image, positions, is_empty_state } = this.props;
    const { clientHeight, clientWidth } = this.state;

    if (is_empty_state || positions.x === 0) {
      return <div />;
    }
    return (
      <Paper>
        <CanvasContainer
          type="keying"
          heightCanvas={clientHeight}
          widthCanvas={clientWidth}
          imageUrl={`${url_image}?action=thumbnail&width=2048`}
          coordinate_focus={positions}
          shapes={[positions]}
        />
      </Paper>
    );
  }
}

export default VerifyKeyImage;

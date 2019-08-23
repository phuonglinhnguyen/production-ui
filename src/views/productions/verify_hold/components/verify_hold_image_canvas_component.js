import React from 'react';
import ReactDOM from 'react-dom';

import RaisedButton from 'material-ui/RaisedButton';

import ExpandMoreIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ArrowRightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import ArrowLeftIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

import CanvasContainer from '../../../../components/common/canvas/components/draw/canvas_component';

import _ from 'lodash';

class VerifyKeyImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clientHeight: 0,
      clientWidth: 0,
      current_index: 0
    };
    this.changeImageIndex = this.changeImageIndex.bind(this);
  }

  componentDidMount() {
    var node = ReactDOM.findDOMNode(this).parentNode;
    this.setState({
      clientHeight: node.clientHeight,
      clientWidth: node.clientWidth
    });
  }

  componentWillReceiveProps(nextProps) {
    var node = ReactDOM.findDOMNode(this).parentNode;
    this.setState({
      current_index: 0,
      clientHeight: node.clientHeight,
      clientWidth: node.clientWidth
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
    );
  }

  changeImageIndex(index) {
    this.setState({
      current_index: index
    });
  }

  render() {
    const { Translate, url_image, is_empty_state } = this.props;
    const { clientHeight, clientWidth, current_index } = this.state;

    if (is_empty_state) {
      return <div />;
    }
    return (
      <React.Fragment>
        <CanvasContainer
          heightCanvas={clientHeight}
          hide_rectangle={true}
          imageUrl={url_image[current_index] || ''}
          type="classify"
          widthCanvas={clientWidth}
        />
        <RaisedButton
          style={{
            minWidth: 40,
            position: 'absolute',
            margin: 0,
            bottom: 0,
            right: clientWidth / 2
          }}
          label={`${current_index + 1}/${url_image.length}`}
          primary={true}
        />
        <RaisedButton
          style={{
            minWidth: 40,
            position: 'absolute',
            margin: 0,
            top: clientHeight / 2,
            right: 5,
            display: current_index + 1 === url_image.length ? 'none' : null
          }}
          tooltip={<Translate value="commons.action.next" />}
          icon={<ArrowRightIcon />}
          onClick={() => this.changeImageIndex(current_index + 1)}
        />
        <RaisedButton
          style={{
            minWidth: 40,
            position: 'absolute',
            margin: 0,
            top: clientHeight / 2,
            left: 5,
            display: current_index === 0 ? 'none' : null
          }}
          tooltip={<Translate value="commons.action.previous" />}
          icon={<ArrowLeftIcon />}
          onClick={() => this.changeImageIndex(current_index - 1)}
        />
      </React.Fragment>
    );
  }
}

export default VerifyKeyImage;

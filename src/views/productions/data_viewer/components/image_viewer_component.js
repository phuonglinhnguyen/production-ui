import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import ExpandMoreIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ArrowRightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import ArrowLeftIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

import CanvasContainer from '../../../../components/common/canvas/components/draw/canvas_component';

import { isEqual } from 'lodash';
import { Paper } from 'material-ui';

class ImageViewerComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current_index: 0
    };
    this.changeImageIndex = this.changeImageIndex.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    for (let key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        if (
          !key.includes('action') &&
          !isEqual(nextProps[key], this.props[key])
        ) {
          return true;
        }
      }
    }
    return !isEqual(nextState.current_index, this.state.current_index);
  }

  changeImageIndex(index) {
    this.setState({
      current_index: index
    });
  }

  render() {
    const { action_openCloseImageViewer, s2_url, Translate ,doc_name} = this.props;
    const { current_index } = this.state;
    return (
      <Paper style={{ position: 'relative' }}>
         <CanvasContainer
          heightCanvas={400}
          hide_rectangle={true}
          imageUrl={`${s2_url[current_index]}?action=thumbnail&width=2048`}
          type="classify"
          widthCanvas={window.innerWidth}
        />
        <RaisedButton
          style={{
            minWidth: 40,
            position: 'absolute',
            margin: 0,
            bottom: 0,
            right: window.innerWidth / 2
          }}
          primary={true}
          tooltip={<Translate value="commons.action.close" />}
          icon={<ExpandMoreIcon />}
          onClick={() => action_openCloseImageViewer(false)}
        />
        <RaisedButton
          style={{
            minWidth: 40,
            position: 'absolute',
            margin: 0,
            bottom: 0,
            left: window.innerWidth/ 2
          }}
          primary={true}
          label={`${doc_name} (${current_index  + 1}/${s2_url.length})`}
        />
        <RaisedButton
          style={{
            minWidth: 40,
            position: 'absolute',
            margin: 0,
            top: 200,
            right: 5,
            display: current_index + 1 === s2_url.length ? 'none' : null
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
            top: 200,
            left: 5,
            display: current_index === 0 ? 'none' : null
          }}
          tooltip={<Translate value="commons.action.previous" />}
          icon={<ArrowLeftIcon />}
          onClick={() => this.changeImageIndex(current_index - 1)}
        />
      </Paper>
    );
  }
}

export default ImageViewerComponent;

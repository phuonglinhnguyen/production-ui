import React from 'react';

import Paper from 'material-ui/Paper';

import Canvas from '@dgtx/ocr-viewer-component';
// import { transform } from '@dgtx/post-vision-transformation';

class ImageCanvasComponent extends React.Component {
  state = {
    height: 0,
    width: 0,
    ratio: 1
  };

  handleChangeRatio(ratio) {
    this.setState({ ratio });
  }

  componentDidMount() {
    let height = window.innerHeight - 85;
    const width = document.getElementById('div-image').offsetWidth;
    if (this.props.show_thumbnail) {
      height = window.innerHeight - 258;
    }
    this.setState({ height, width });
  }

  updateDimensions() {
    const { height, width } = this.state;
    let height_ = window.innerHeight - 85;
    const width_ = document.getElementById('div-image').offsetWidth;
    if (this.props.show_thumbnail) {
      height_ = window.innerHeight - 258;
    }
    if (height === height_ && width === width_) {
      return;
    }
    this.setState({ height: height_, width: width_ });
  }

  componentDidUpdate() {
    const { height, width } = this.state;
    let height_ = window.innerHeight - 85;
    const width_ = document.getElementById('div-image').offsetWidth;
    if (this.props.show_thumbnail) {
      height_ = window.innerHeight - 258;
    }
    if (height === height_ && width === width_) {
      return;
    }
    this.setState({ height: height_, width: width_ });
  }

  render() {
    const { height, width, ratio } = this.state;
    const {
      action_onModifyFieldValue,
      image_selected = '',
      image_index,
      ocr_item = '',
      words_position = []
    } = this.props;
    return (
      <Paper>
        <Canvas
          data={[
            {
              image_uri: image_selected,
              data_ocr: ocr_item
            }
          ]}
          height={height}
          highlightPolygons={[
            {
              page_index: 0,
              shapes: words_position.filter(_w => _w.page_index == image_index), //eslint-disable-line
              style: {
                lineWidth: 2,
                strokeStyle: 'transparent',
                fillStyle: 'rgba(255,255,0,0.3)'
              }
            }
          ]}
          onChangeRatio={this.handleChangeRatio.bind(this)}
          onClick={(event, data) => {
            data.word.page_index = image_index;
            action_onModifyFieldValue(data, true);
          }}
          onDrap={(event, data) => {
            if (data.text) {
              for (const key in data.words) {
                let element = data.words[key];
                element.page_index = image_index;
              }
              action_onModifyFieldValue(data, true);
            }
          }}
          ratio={ratio}
          resultInline={false}
          width={width}
          wordStylesDefault={{
            lineWidth: 1,
            strokeStyle: 'transparent',
            fillStyle: 'transparent'
          }}
          wordStylesHover={{
            lineWidth: 1,
            strokeStyle: 'transparent',
            fillStyle: 'transparent'
          }}
          wordStylesSelect={{
            lineWidth: 1,
            strokeStyle: 'transparent',
            fillStyle: 'rgba(255,255,0,0.3)'
          }}
        />
      </Paper>
    );
  }
}

export default ImageCanvasComponent;

import React from 'react';

import { CardMedia } from 'material-ui/Card';

import ReactSlick from 'react-slick';

class ThumbnailComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      settings: {
        lazyLoad: true,
        infinite: false,
        slidesToShow: 7,
        slidesToScroll: 1,
        speed: 500
      }
    };
  }

  render() {
    let { settings } = this.state;
    const { action_selectImage, image_uris = [], slider = 0 } = this.props;
    if(image_uris.length > 7){
      settings.slidesToScroll = 7
    }
    return (
      <div style={{ width: '100%' }}>
        <ReactSlick ref={c => (this.slider = c)} {...settings}>
          {image_uris.map((d, i) => (
            <CardMedia
              key={i}
              onClick={() => action_selectImage(i)}
              overlay={`Image ${i + 1}`}
              overlayContainerStyle={{ textAlign: 'center' }}
              style={{
                cursor: 'pointer',
                color: i === slider ? '#D50000' : '#eeeeee',
                fontWeight: 500,
                border: i === slider ? '3px solid #D50000' : null
              }}
            >
              <img
                alt={''}
                src={`${d}?action=thumbnail&width=100`}
                style={{ padding: 0, margin: i === slider ? 0 : 3 }}
              />
            </CardMedia>
          ))}
        </ReactSlick>
      </div>
    );
  }
}

export default ThumbnailComponent;

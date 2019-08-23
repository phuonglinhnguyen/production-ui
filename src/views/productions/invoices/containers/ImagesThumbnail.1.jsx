import React from 'react';
import clone from 'clone'
import { Card, CardActionArea, CardMedia, CardContent, Typography, withStyles } from '@material-ui/core';

import ReactSlick from 'react-slick';
const styles = (theme) => {
    return {
    }
}
@withStyles(styles)
class ThumbnailComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            settings: {
                lazyLoad: true,
                infinite: false,
                slidesToScroll: 1,
                speed: 500
            },
            slidesToShow: 8
        };
    }
    shouldComponentUpdate(){
        return false;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.contentWidth !== this.props.contentWidth) {
            let slidesToShow = Number(nextProps.contentWidth / 110);
            const state = clone(this.state)
            state.settings.slidesToScroll = slidesToShow;
            this.setState(state)
        }
    }
    render() {
        let { settings, slidesToShow } = this.state;
        const { onSelectImage, image_uris = [], slider = 0, classes } = this.props;
        if (image_uris.length > 7) {
            settings.slidesToScroll = 7
        }
        return (
            <ReactSlick  {...settings}>
                {image_uris.map((d, i) => (
                    <div>
                        <div style={{ width: '100%', height: '120px', position: 'relative' }}>
                            <Card
                                onClick={event => onSelectImage(i)}
                                style={
                                    i === slider ? {
                                        cursor: 'pointer',
                                        margin: '2px',
                                        color: '#D50000',
                                        border: '6px solid rgba(120,120,120,0.8)',
                                    } : {
                                            cursor: 'pointer',
                                            margin: '8px',
                                            color: '#eeeeee',
                                        }}>
                                <CardActionArea>
                                    <CardMedia
                                        height="65px"
                                        className={classes.media}
                                        image={`${d}?action=thumbnail&width=100`}
                                        title={`Image ${i + 1}`}
                                        style={{ height: 110 }}
                                    />
                                    <div style={{
                                        // textAlign: 'center',
                                        position: 'absolute',
                                        left: 0,
                                        bottom: 0,
                                        width: '100%',
                                        background: 'rgba(0,0,0,0.3)',
                                        textAlign: 'center'
                                    }}>
                                        {`Image ${i + 1}`}
                                    </div>
                                    {i !== slider ? (<div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        width: '100%',
                                        height: '126px',
                                        background: 'rgba(0,0,0,0.4)',
                                        zIndex: 1,
                                    }} />) : ''}
                                </CardActionArea>
                            </Card>
                        </div>
                    </div>
                ))}
            </ReactSlick>
        );
    }
}
export default ThumbnailComponent;

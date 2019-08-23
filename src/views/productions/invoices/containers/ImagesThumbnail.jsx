import React from 'react';

import { Card, CardActionArea, CardMedia, CardContent, Typography, withStyles } from '@material-ui/core';

import ReactSlick from 'react-slick';
const styles = (theme) => {
    return {
        slick_list: {
            overflow: "hidden",
            margin: 0,
            padding: 0,
            position: "relative",
            display: "block",
        },
        slick_track: {
            width: "4263px",
            opacity: 1,
            position: "relative",
            top: 0,
            left: 0,
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            // transform: 'translate3d(-609px, 0px, 0px)'
        },
        slick_slide: {
            outline: "none",
            width: "203px",
            display: "block",
            float: "left",
            height: "100%",
            minHeight: "1px"
        }
    }
}
const cancelEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
}

class ThumbnailComponent extends React.Component {
    constructor(props) {
        super(props);
        this._wrapper = React.createRef();

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

    handleOnMouseClick = (event) => {
        cancelEvent(event)
    }
    handleOnMouseDown = (event) => {
        cancelEvent(event)
    }
    componentDidMount = () => {
        this._wrapper.current.addEventListener("mousedown", this.handleOnMouseDown, false);

    }
    componentWillUnmount = () => {
        this._wrapper.current.removeEventListener("mousedown", this.handleOnMouseDown, false)
    }
    componentDidCatch = () => {

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.contentWidth !== this.props.contentWidth) {
            let slidesToShow = Number(nextProps.contentWidth / 110);
            this.setState({ slidesToShow })
        }
    }
    render() {
        let { settings, slidesToShow } = this.state;
        const { onSelectImage, image_uris = [], slider = 0, classes } = this.props;
        if (image_uris.length > 7) {
            settings.slidesToScroll = 7
        }
        // return '';
        return (
            <div
                ref={this._wrapper}
                style={
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '126px',
                        background: 'rgba(0,0,0,0.35)',
                        zIndex: 30,
                    }
                }>
                <div style={
                    {
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                    }
                }>
                    <ReactSlick ref={c => (this.slider = c)} slidesToShow={slidesToShow} {...settings}>
                        {image_uris.map((d, i) => (
                            <div className={classes.slick_slide}>
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
                </div>
            </div>
        );
    }
}
export default withStyles(styles)(ThumbnailComponent);

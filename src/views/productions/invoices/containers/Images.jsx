import * as React from 'react'
import { isEqual } from 'lodash'
import { AutoSizer } from '../../../../@components/common';
import { withStyles } from '@material-ui/core';
import ImagesThumbnail from './ImagesThumbnail';
import Viewer from '../../../../@components/Viewer/components/Viewer'
import { withRouter } from 'react-router';
import { getDataObject } from '@dgtx/coreui';

const styles = (theme) => {
    return {

    }
}
const cancelEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
}
const joinText = (current, add) => {
    if (current) {
        if (current.lastIndexOf(' ') === current.length - 1) {
            return current + add;
        } else {
            return current + " " + add;

        }
    }
    return add
}
const converPoints = (points) => {
    return points.map(item => `x:${Math.round(item.x)},y:${Math.round(item.y)}`).join(';')
}


class Images extends React.Component {
    state = { slider: 0 }
    handleDrap = (data) => {
        const { handleChange, active, valueField } = this.props;
        if (active) {
            if (!(valueField.words && valueField.words[0] && valueField.words[0].points)) {
                const value = {
                    text: joinText(valueField.text, data.text),
                    words: [].concat((valueField.words || []), data.words || [])
                }
                handleChange({ ...active, value })
            }
        }
    }
    handleDraw = (data) => {
        const { handleChange, active, valueField } = this.props;
        const value = {
            text: converPoints(data.points),
            words: [{ points: data.points }],
        }
        handleChange({ ...data.item.data, value })
    }
    handleDrawDelete = (data) => {
        const { handleChange } = this.props;
        const value = {
            text: "",
            words: [],
        }
        handleChange({ ...data.item.data, value })
    }
    handleClick = (data) => {
        const { handleChange, active, valueField } = this.props;
        if (active) {
            if (!(valueField.words && valueField.words[0] && valueField.words[0].points)) {
                const value = {
                    text: joinText(valueField.text, data.text),
                    words: [].concat((valueField.words || []), data.words || [])
                }
                handleChange({ ...active, value })
            }
        }
    }
    // shouldComponentUpdate = (nextProps, nextState) => {
    //     return (
    //         !isEqual(this.state, nextState)||
    //         !isEqual(this.props.width, nextProps.width) ||
    //         !isEqual(this.props.height, nextProps.height) ||
    //         !isEqual(this.props.images, nextProps.images) ||
    //         !isEqual(this.props.current, nextProps.current) ||
    //         !isEqual(this.props.lines, nextProps.lines) ||
    //         !isEqual(this.props.sections, nextProps.sections) ||
    //         !isEqual(this.props.stateView, nextProps.stateView) ||
    //         !isEqual(this.props.valueField.words, nextProps.valueField.words)
    //     )
    // }
    render() {
        const { images, width, height, handleChange,
            active,
            lines,
            username,
            match,
            single, current, sections, valueField, polylines } = this.props;
        const { projectId, taskKeyDef } = match.params;
        let key_storage_config = `${projectId}_${taskKeyDef}`;
        let highlightPolygons = []
        try {

            if (Array.isArray(valueField.words) && valueField.words.filter(Boolean) && valueField.words.every(item => Boolean(item.position))) {
                highlightPolygons = [
                    {
                        page_index: 0,
                        shapes: Array.isArray(valueField.words) && valueField.words.filter(Boolean) || [],
                        style: {
                            lineWidth: 2,
                            strokeStyle: 'transparent',
                            fillStyle: 'rgba(255,255,0,0.3)'
                        }
                    }
                ]
            }
        } catch (error) {
            console.log(error);
        }
        return (
            <div
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
                ref={this._wrapper}
            >
                {images.length > 1 ?
                    <ImagesThumbnail
                        contentWidth={width}
                        onSelectImage={slider => { this.setState({ slider }) }}
                        image_uris={images.map(item => item.image_uri)}
                        slider={this.state.slider} />
                    : ''
                }
                <Viewer
                    keyStorage={key_storage_config}
                    username={username}
                    editable={true}
                    data={[images[this.state.slider]]}
                    config={{
                        valueField,
                        current,
                        active,
                        lines,
                        sections,
                        single,
                    }
                    }
                    polylines={polylines}
                    width={width}
                    height={height}
                    highlightPolygons={highlightPolygons}
                    onClick={this.handleClick}
                    onDrap={this.handleDrap}
                    onDraw={this.handleDraw}
                    onDrawDelete={this.handleDrawDelete}
                />
            </div>
        )
    }
}

export default withRouter(AutoSizer(withStyles(styles, { withTheme: true })(Images)));

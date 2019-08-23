import React, { Component, Pu } from 'react'
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import Quill from 'quill';


import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

import styles from './styles';

class RichTextInput extends Component {
    state = { value: '' }
    static propTypes = {
        toolbar: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
        fullWidth: PropTypes.bool,
        value: PropTypes.any,
    };
    static defaultProps = {
        toolbar: true,
        fullWidth: true,
        value: '',
    };
    componentDidMount = () => {
        const {
            value,
            toolbar,
        } = this.props;
        this.quill = new Quill(this.divRef, {
            modules: {
                toolbar: [
                    [{ 'size': [] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'script': 'super' }, { 'script': 'sub' }],
                    [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                    ['direction', { 'align': [] }],
                    ['link', 'image', 'video', 'formula'],
                    ['clean']
                ]
            },
            theme: 'snow',
        })
        this.quill.setContents(this.quill.clipboard.convert(value));
        this.editor = this.divRef.querySelector('.ql-editor');
        this.quill.on('text-change', debounce(this.onTextChange, 2));
        this.setState({ value })
    }
    componentWillReceiveProps = (nextProps) => {
        if (this.state.value !== nextProps.value) {
            this.quill.setContents(this.quill.clipboard.convert(nextProps.value));
        this.setState({ value: nextProps.value})
        }
    }

    componentWillUnmount() {
        this.quill.off('text-change', this.onTextChange);
        this.quill = null;
    }
    onTextChange = () => {
        const value =
            this.editor.innerHTML == '<p><br></p>' ? '' : this.editor.innerHTML;
        this.setState({ value })
        this.props.onChange(value);
    };
    updateDivRef = ref => {
        this.divRef = ref;
    };
    render() {
        const { error, helperText = false, fullWidth } = this.props;
        return (
            <FormControl
                error={error !== null && error != undefined}
                fullWidth={fullWidth}
                style={{ height: '100%' }}
                className="rich-text-input"
            >
                <div ref={this.updateDivRef} />
                {error && <FormHelperText error>{error}</FormHelperText>}
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        );
    }
}
export default withStyles(styles)(RichTextInput)
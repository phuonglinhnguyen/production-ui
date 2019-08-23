import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover/Popover';
import LinearProgress from 'material-ui/LinearProgress';
import Toggle from 'material-ui/Toggle';
import clone from 'clone';
import ReactDOM from 'react-dom';
import keycode from 'keycode';
import { API_LOOKUP_SPECIAL_CHARACTER } from '../../../../../constants';
import { isEqual } from 'lodash';
import { loadConfigLookup, getParamLookup, getValueByIndex, cancelEvent, getValueSingleCharacter, getValueSingle } from './lookup_common';
import { LookupService, FieldBroadcastService } from './services';
import { debounce } from '../../../../../utils/common';
import * as hotkeyAction from './hotkey';
import MenuNoneReference from './menu_lookup/menu_none_reference';
import scrollIntoView from 'scroll-into-view'
const ACTION_HOTKEY = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'];
const ACTION_KEYS = ['left', 'right', 'up', 'down', 'esc', 'enter', 'tab', 'space'];

const SCROLL_BEHAVIOR_OPTIONS = ['auto', 'instant', 'smooth'];
const SCROLL_BLOCK_OPTIONS = ['start', 'center', 'end', 'nearest'];
const SCROLL_INLINE_OPTIONS = ['start', 'center', 'end', 'nearest'];

const SCROLL_KEY_OTIONS = {
    SCROLL_BEHAVIOR: 'behavior',
    SCROLL_BLOCK: 'block',
    SCROLL_INLINE: 'inline'
}

const initialState = {
    loading: false,
    value: '',
    disabled: false,
    anchorEl: undefined,
    isLookup: false,
    lookupUrl: '',
    data_broadcasts: {},
}
export default class InputLookup extends Component {
    constructor(props, context) {
        super(props, context);
        this.props = props;
        this.context = context;
        this.state = clone(initialState);
        this.inputInstanceId = Date.now();
        this.data_broadcasts = {};
    }
    static defaultProps = {
        broadcastChannel: 0,
        value: '',
        scroll_extenal: false,
        disabled: false,
        scrollTo: {
            top: 0,
            left: 0,
            leftOffset: 0,
            topOffset: 144,
            [SCROLL_KEY_OTIONS.SCROLL_BEHAVIOR]: SCROLL_BEHAVIOR_OPTIONS[0],
            [SCROLL_KEY_OTIONS.SCROLL_BLOCK]: SCROLL_BLOCK_OPTIONS[0],
            [SCROLL_KEY_OTIONS.SCROLL_INLINE]: SCROLL_INLINE_OPTIONS[0],
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        let shouldUpdate = !isEqual(this.state, nextState) || !isEqual(this.props, nextProps);
        return shouldUpdate;
    }

    handleChangeByBroadcast = (metadata) => {
        const { field, onUpdateInput, broadcastChannel } = this.props;
        const { data } = metadata;
        FieldBroadcastService.changeData(broadcastChannel, field.name, data);
        onUpdateInput && onUpdateInput(data, { source: 'change_by_broadcast' });
        if (this.mounted)
            try {
                this.setState({ value: data })
            } catch (error) {
            }
    }
    componentWillMount() {
        const { broadcastChannel, field, disabled } = this.props;
        this.inputInstanceId = this.inputInstanceId + field.name;
        FieldBroadcastService.changeData(broadcastChannel, field.name, this.props.value);
        if (this.props.value !== this.state.value) {
            this.setState({ value: this.props.value });
        }
        this.setState({ disabled })
    }
    componentWillReceiveProps(nextProps) {
        const { field, broadcastChannel, disabled } = nextProps;
        if (!isEqual(field, this.props.field)) {
            if (this.state.lookupConfig) {
                FieldBroadcastService.unsubsribe(broadcastChannel, this.state.lookupConfig.subscribeFields, this.handleChangeByBroadcast)
            }
            let lookupConfig = loadConfigLookup(field);
            if (lookupConfig) {
                if (lookupConfig.lookup_after_time) {
                    this.getLookup = debounce(this.loadLookup, lookupConfig.lookup_after_time);
                } else {
                    this.getLookup = this.loadLookup;
                }
                this.setState({ lookupConfig })
                FieldBroadcastService.subscribe(broadcastChannel, lookupConfig.name, this.handleChangeByBroadcast);
            }
        }
        if (nextProps.value !== this.state.value) {
            this.setState({ value: nextProps.value });
        }
        if (disabled !== this.props.disabled) {
            this.setState({ disabled })
        }

        FieldBroadcastService.changeData(broadcastChannel, field.name, nextProps.value);
    }

    componentDidMount() {
        let self = this;
        this.mounted = !0;
        const { field, broadcastChannel, addRef, tabIndex } = this.props;
        FieldBroadcastService.changeData(broadcastChannel, field.name, this.props.value);
        addRef && addRef(this.refs.valueField, tabIndex);
        this.deplayLoadingLookup = debounce(this.loadingLookup, 350);
        let lookupConfig = loadConfigLookup(field);
        if (lookupConfig) {
            if (lookupConfig.lookup_after_time) {
                this.getLookup = debounce(this.loadLookup, lookupConfig.lookup_after_time);
            } else {
                this.getLookup = this.loadLookup;
            }
            this.setState({ lookupConfig }, () => {
                if (self.await_mount_load) {
                    self.await_mount_load = false;
                    self.getLookup('', 0, lookupConfig);
                }
            })
            FieldBroadcastService.subscribe(broadcastChannel, lookupConfig.name, this.handleChangeByBroadcast);
        }
        LookupService.addListener(this.inputInstanceId, this.handleLookup);
    }
    componentWillUnmount() {
        const { broadcastChannel } = this.props;
        this.mounted = !1;
        if (this.state.lookupConfig) {
            FieldBroadcastService.unsubsribe(broadcastChannel, this.state.lookupConfig.name, this.handleChangeByBroadcast)
        }
        LookupService.removeListener(this.inputInstanceId, this.handleLookup);
        this.closePopover();
    }
    handleLookup = (data) => {
        const { lookupDatas, metadata } = data
        this.setLoading(false);
        let open = !!lookupDatas;
        if (lookupDatas && lookupDatas[1] && lookupDatas[1].length === 0) {
            lookupDatas.splice(1, 1)
        }
        this.props.onOpen && this.props.onOpen(open)
        this.setState({
            lookupDatas: lookupDatas || [],
            selectionStart: metadata.selectionStart,
            special: metadata.special,
            openPopoverLookup: open,
            anchorEl: ReactDOM.findDOMNode(this.refs.valueField)
        });
    }
    blur = () => {
        this.refs.valueField && this.refs.valueField.blur();
    }
    focus = (scroll, content) => {
        this.refs.valueField && this.refs.valueField.focus();
        const { autoScroll, } = this.props;
        if (autoScroll) this.needScroll(content);

    }

    needScroll = (content) => {
        const self = this;
        const { scrollTo, scroll_extenal } = this.props;
        const node = ReactDOM.findDOMNode(this.refs.valueField);
        if (scroll_extenal) {
            self.scrolling = true;
            scrollIntoView(node, {
                time: 45,
                align: {
                    top: scrollTo.top,
                    left: scrollTo.left,
                    topOffset: scrollTo.topOffset,
                    leftOffset: scrollTo.leftOffset,
                },
                function(type) {
                    if ('complete' === type) {
                        self.scrolling = false;
                        setTimeout(() => {
                            self.setState({
                                openPopoverLookup: !!self.awaitOpen,
                                anchorEl: ReactDOM.findDOMNode(self.refs.valueField)
                            }, () => {
                                self.awaitOpen = !1;
                            });
                        }, 40)
                    }
                }
            })
            // let _needScroll = needScroll(node, scrollTo, !multiLine);
            // if (_needScroll) {
            //     self.scrolling = true;
            //     scrollIntoView(node, {
            //         time: 10,
            //         align: {top: 0.5,
            //             left: 0,
            //             leftOffset:  0,
            //             topOffset:  10},
            //     }, function (type) {
            //         if ('complete' === type) {
            //             self.scrolling = false;
            //             setTimeout(() => {
            //                 self.setState({
            //                     openPopoverLookup: !!self.awaitOpen,
            //                     anchorEl: ReactDOM.findDOMNode(self.refs.valueField)
            //                 }, () => {
            //                     self.awaitOpen = !1;
            //                 });
            //             }, 1)
            //         }
            //     }
            //     );
            // }
        } else {
            node.scrollIntoView(scrollTo);
            if (content) {
                content.scrollTop -= scrollTo.topOffset
            }
        }
    }
    handleChangeInput = (event) => {
        const { onUpdateInput, field, broadcastChannel } = this.props;
        const { lookupConfig } = this.state;
        let val = event.target.value;
        let selectionStart = event.target.selectionStart;
        if (field.control_type === "COMBOBOX") {
            this.getLookup('', selectionStart, lookupConfig);
        } else {
            onUpdateInput && onUpdateInput(val, { source: 'change' }, event);
            this.setState({ value: val });
            FieldBroadcastService.changeData(broadcastChannel, field.name, val);
            if (lookupConfig)
                this.getLookup(val, selectionStart, lookupConfig);
        }
    }
    handleFocus = (event) => {
        const { field } = this.props;
        const { lookupConfig } = this.state;
        if (field.control_type === "COMBOBOX") {
            if (this.mounted) {
                let selectionStart = event.target.selectionStart;
                this.getLookup('', selectionStart, lookupConfig);
            } else {
                this.await_mount_load = true;
            }
        }
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    }
    handleBlur = (event) => {
        const self = this;
        const { onBlur } = this.props;
        if (self.mounted) {
            self.props.onOpen && self.props.onOpen(!1);
            self.setState({ selection: null, focustion: null });
            setTimeout(() => {
                self.closePopover();
            }, 250);
        }
        onBlur && onBlur(event);
    }
    setValueSelection = (selection, lookupDatas, event) => {
        let data = getValueByIndex(selection.row, selection.col, lookupDatas);
        this.setValueByLookup(data, event);
    }
    setValueByLookup = (data, event) => {
        if (!data) return;
        const { onUpdateInput, field, broadcastChannel, onOpen } = this.props;
        const { selectionStart, lookupConfig, special, value } = this.state;
        onOpen && onOpen(!1);
        let val;
        if (field.control_type === "COMBOBOX") {
            val = data[lookupConfig.key_value];
        }
        else
            if (special) {
                val = getValueSingleCharacter(value, special.selectionStart, data, special.character);
            } else {
                if (lookupConfig.allow_multiple) {
                    val = getValueSingle(value, selectionStart, data[lookupConfig.key_value]);
                } else {
                    val = data[lookupConfig.key_value];
                }
            }
        this.setState({
            value: val,
            openPopoverLookup: !1,
            selection: null,
            focustion: null,
        });
        onUpdateInput && onUpdateInput(val, { source: 'select' }, event);
        FieldBroadcastService.changeData(broadcastChannel, field.name, val);
        if (!special && Array.isArray(lookupConfig.lookup_broadcast)) {
            lookupConfig.lookup_broadcast.forEach((_droadCast) => {
                let valBroad = data[_droadCast.column_broadcast] || '';
                FieldBroadcastService.publish(broadcastChannel, _droadCast.field_broadcasted, { author: field.name, data: valBroad })
            });
        }
        this.loadLookup(val, selectionStart, lookupConfig)
    }
    handleKeyDown = (event) => {
        const self = this;
        const { onKeyDown, nextFocus, field, onUpdateInput, broadcastChannel, copyValue } = this.props;
        const {
            openPopoverLookup,
            lookupDatas,
            selectionStart,
            selection,
            value,
            lookupConfig,
        } = this.state;
        let _keyCode = keycode(event);
        let _selectionStart = event.target.selectionStart;
        if (openPopoverLookup) {
            if (ACTION_HOTKEY.includes(_keyCode)) {
                let indeHotKey = hotkeyAction.getIndex(_keyCode)
                if (indeHotKey > -1) {
                    cancelEvent(event);
                    let valOfHotKey = getValueByIndex(indeHotKey, event.shiftKey ? 1 : 0, lookupDatas);
                    if (valOfHotKey) {
                        this.setValueByLookup(valOfHotKey, event);
                    }
                }
            } else if (ACTION_KEYS.includes(_keyCode)) {
                switch (_keyCode) {
                    case 'left':
                        if (selection) {
                            cancelEvent(event);
                            let _col = selection.col > 0 ? selection.col - 1 : lookupDatas.length - 1;
                            let _lengthColNew = lookupDatas[_col].length;
                            let _row = (_lengthColNew - 1 < selection.row) ? _lengthColNew - 1 : selection.row;
                            this.setState({
                                selection: { col: _col, row: _row },
                                gotoIndexCusor: selectionStart,
                            });
                        } else if (_selectionStart > 0) {
                            self.loadLookup(value, _selectionStart, lookupConfig)
                        } else {
                            self.closePopover();
                            nextFocus(event, { goto: 'left' }, self);
                        }
                        break;
                    case 'right':
                        if (selection) {
                            cancelEvent(event);
                            let _col = selection.col < lookupDatas.length - 1 ? selection.col + 1 : 0;
                            let _lengthColNew = lookupDatas[_col].length;
                            let _row = (_lengthColNew - 1 < selection.row) ? _lengthColNew - 1 : selection.row;
                            this.setState({
                                selection: { col: _col, row: _row },
                                gotoIndexCusor: selectionStart,
                            });
                        } else if (value && value.length === _selectionStart) {
                            self.closePopover();
                            nextFocus(event, { goto: 'right' }, self);
                        } else {
                            self.loadLookup(value, _selectionStart, lookupConfig)
                        }
                        break;
                    case 'enter':
                        if (selection) {
                            cancelEvent(event);
                            self.setValueSelection(selection, lookupDatas, event);
                            if (field.control_type === "COMBOBOX") {
                                self.closePopover();
                                // nextFocus(event, { goto: 'next' }, self);
                            }
                        } else {
                            self.closePopover();
                            nextFocus(event, { goto: 'next' }, self);
                        }
                        break;
                    case 'esc':
                    case 'tab':

                        self.closePopover();
                        break;

                    case 'space':
                        if (selection) {
                            cancelEvent(event);
                            self.setValueSelection(selection, lookupDatas, event);
                            self.closePopover();
                        }
                        break;
                    case 'up':
                        cancelEvent(event);
                        if (selection) {
                            let _row = selection.row > 0 ? selection.row - 1 : lookupDatas[selection.col].length - 1
                            this.setState({
                                selection: { col: selection.col, row: _row },
                                gotoIndexCusor: _selectionStart,
                            });
                        } else {
                            this.setState({
                                selection: { col: 0, row: lookupDatas[0].length - 1 },
                                gotoIndexCusor: _selectionStart,
                            });
                        }
                        break;
                    case 'down':
                        cancelEvent(event);
                        if (selection) {
                            let _row = selection.row < lookupDatas[selection.col].length - 1 ? selection.row + 1 : 0
                            this.setState({
                                selection: { col: selection.col, row: _row },
                                gotoIndexCusor: _selectionStart,
                            });
                        } else {
                            this.setState({
                                selection: { col: 0, row: 0 },
                                gotoIndexCusor: _selectionStart,
                            });
                        }
                        break;
                    default:
                        break;
                }
            }
        } else {
            switch (_keyCode) {
                case 'f9':
                    cancelEvent(event);
                    self.loadLookup(value, _selectionStart, lookupConfig, { isFull: !1, selectionStart: _selectionStart })
                    break;
                case 'f10':
                    cancelEvent(event);
                    self.loadLookup(value, _selectionStart, lookupConfig, { isFull: !0, selectionStart: _selectionStart })
                    break;
                case 'f5':
                    cancelEvent(event);
                    copyValue && copyValue(field.name, (data) => {
                        if (data) {
                            FieldBroadcastService.changeData(broadcastChannel, field.name, data);
                            onUpdateInput && onUpdateInput(data, { source: 'change_by_capture' });
                            if (self.mounted)
                                try {
                                    self.setState({ value: data })
                                } catch (error) {
                                }
                        }
                    })
                    // StorageFieldCaptureService.get_data({field_name:field.name},(data)=>{
                    //     if(data){
                    //         FieldBroadcastService.changeData(broadcastChannel, field.name, data);
                    //         onUpdateInput && onUpdateInput(data, { source: 'change_by_capture' });
                    //         if (self.mounted)
                    //             try {
                    //                 self.setState({ value: data })
                    //             } catch (error) {
                    //             }
                    //     }
                    // })
                    break;

                case 'left':
                    if (_selectionStart > 0) {
                        self.loadLookup(value, _selectionStart, lookupConfig)
                    } else {
                        nextFocus(event, { goto: 'left' }, self);
                    }
                    break;
                case 'right':
                    if (value && value.length !== _selectionStart) {
                        self.loadLookup(value, _selectionStart, lookupConfig)
                    } else {
                        nextFocus(event, { goto: 'right' }, self);
                    }
                    break;
                case 'enter':
                    cancelEvent(event);
                    nextFocus(event, { goto: 'next' }, self);
                    break;
                case 'up':
                    if (_selectionStart === 0) {
                        nextFocus(event, { goto: 'up' }, self);
                    }
                    break;
                case 'down':
                    if (value.length === _selectionStart) {
                        nextFocus(event, { goto: 'down' }, self);
                    }
                    break;
                default:
                    onKeyDown && onKeyDown(event);
                    break;
            }
        }

    }
    handleOnClick = (event) => {
        const { onClick, autoScroll } = this.props;
        if (autoScroll) this.isClick = true;
        const { lookupConfig } = this.state;
        onClick && onClick(event, this);
        let val = event.target.value;
        let selectionStart = event.target.selectionStart;

        if (lookupConfig)
            this.getLookup(val, selectionStart, lookupConfig);
    }
    loadLookup = (value, selectionStart, lookupConfig, special) => {
        const { broadcastChannel, field } = this.props;
        if (special) {
            let character = value.substring(selectionStart - 1, selectionStart);
            special['uri'] = API_LOOKUP_SPECIAL_CHARACTER;
            special['character'] = character;
            special['land'] = field.special_land;
            let metadata = {
                lookupConfig,
                value,
                special,
                selectionStart,
            }
            this.setLoading();
            LookupService.loadLookup(this.inputInstanceId, metadata)
        } else
            if (lookupConfig) {
                if (lookupConfig.argument_details) {
                    let metadata = {
                        lookupConfig,
                        value,
                        params: '',
                        selectionStart,
                    }
                    this.setLoading();
                    LookupService.loadLookup(this.inputInstanceId, metadata)
                } else
                    if (value && value.length >= lookupConfig.characters_trigger_lookup) {
                        let params = getParamLookup(lookupConfig, value, selectionStart, FieldBroadcastService, broadcastChannel);
                        params = params.map(item => encodeURI(item))
                        let metadata = {
                            lookupConfig,
                            value,
                            params: JSON.stringify(params),
                            selectionStart,
                        }
                        this.setLoading();
                        LookupService.loadLookup(this.inputInstanceId, metadata)
                    } else {
                        if (this.state.openPopoverLookup) {
                            this.closePopover();
                        }
                    }
            }
    }
    setLoading(on = true) {
        if (on) {
            this.deplayLoadingLookup();
        } else {
            this.deplayLoadingLookup.clear();
            this.setState({
                loading: false,
            });
        }
    }
    loadingLookup = () => {
        this.setState({
            loading: true,
        });
    }
    _getInput = () => {
        const {
            tabIndex,
            disabled,
            defaultValue,
            errorStyle,
            errorText,
            floatingLabelFixed,
            floatingLabelFocusStyle,
            floatingLabelShrinkStyle,
            floatingLabelStyle,
            floatingLabelText,
            fullWidth,
            hintText,
            hintStyle,
            inputStyle,
            multiLine,
            rows,
            name,
            rowsMax,
            textareaStyle,
            underlineDisabledStyle,
            underlineFocusStyle,
            underlineShow,
            underlineStyle,
            textFieldStyle,
            autoFocus = false,
            readOnly = false,
            field
        } = this.props;
        let _disabled = this.state.disabled;
        return <TextField //material-ui 0.19.1 React16 warning for valueLink property on textarea :issues :https://github.com/mui-org/material-ui/issues/7779
            ref='valueField'
            autoComplete='off'
            tabIndex={tabIndex}
            readOnly={readOnly}
            defaultValue={defaultValue}
            autoFocus={autoFocus}
            disabled={_disabled}
            errorStyle={errorStyle}
            errorText={errorText}
            floatingLabelFixed={floatingLabelFixed}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
            floatingLabelShrinkStyle={floatingLabelShrinkStyle}
            floatingLabelStyle={floatingLabelStyle}
            floatingLabelText={floatingLabelText}
            fullWidth={fullWidth}
            hintText={hintText}
            hintStyle={hintStyle}
            inputStyle={inputStyle}
            multiLine={multiLine}
            rows={rows}
            rowsMax={rowsMax}
            name={name}
            textareaStyle={textareaStyle}
            underlineDisabledStyle={underlineDisabledStyle}
            underlineFocusStyle={underlineFocusStyle}
            underlineShow={underlineShow}
            underlineStyle={underlineStyle}
            style={textFieldStyle}
            value={this.state.value || ''}
            onChange={this.handleChangeInput}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onKeyDown={this.handleKeyDown}
            onClick={this.handleOnClick}
        />
    }
    closePopover = () => {
        if (this.mounted) {
            this.props.onOpen && this.props.onOpen(!1);
            this.setState({ selection: null, focustion: null, openPopoverLookup: !1 });
        }
    }
    _getMenuLookup = () => {
        const {
            lookupConfig,
            lookupDatas,
            selection,
            anchorEl,
            special } = this.state;
        if ((lookupConfig || special) && anchorEl) {
            let positionElement = anchorEl.getBoundingClientRect();
            let maxHeight = window.innerHeight - (positionElement.top + positionElement.height);
            return (
                <MenuNoneReference
                    lookupDatas={lookupDatas}
                    lookupConfig={lookupConfig}
                    isSpecial={!!special}
                    maxHeight={maxHeight}
                    onSelectLookupItem={this.setValueByLookup}
                    selection={selection}
                />);
        }
        return '';

    }
    render() {
        const {
            canAutoPosition,
            anchorOrigin,
            targetOrigin,
            popoverProps,
            fullWidth,
            animated,
            animation,
            field,
        } = this.props;
        const {
            loading,
            anchorEl,
            openPopoverLookup,
        } = this.state;
        const { style: popoverStyle, ...popoverOther } = popoverProps || {};
        return (
            <div style={{
                display: 'inline-block',
                position: 'relative',
                width: fullWidth ? '100%' : 256
            }}>
                {this._getInput()}
                {
                    field.switch_disable ? (<div style={{ position: 'absolute', top: 3, right: 5 }}>
                        <Toggle
                            onClick={_ => this.setState({ disabled: !this.state.disabled })}
                            toggled={!this.state.disabled}
                        />
                    </div>) : ''
                }
                <Popover
                    style={Object.assign(
                        { background: 'rgba(255,255,255,0.95)' },
                        { width: anchorEl ? anchorEl.clientWidth : '100%', minWidth: '500px' },
                        popoverStyle,
                        { minHeight: '50px' }
                    )}
                    canAutoPosition={canAutoPosition}
                    anchorOrigin={anchorOrigin}
                    targetOrigin={targetOrigin}
                    open={openPopoverLookup}
                    anchorEl={anchorEl}
                    useLayerForClickAway={false}
                    animated={animated}
                    animation={animation}
                    onRequestClose={this.closePopover}
                    {...popoverOther}
                >
                    {loading ? (
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', zIndex: 10 }}>
                            <LinearProgress mode='indeterminate' />
                        </div>) : null}
                    {this._getMenuLookup()}
                </Popover>
            </div>
        );
    }
}
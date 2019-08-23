
import * as React from 'react';
import { isEqual } from 'lodash';
import keycode from 'keycode';
import scrollIntoView from 'scroll-into-view'
import { debounce } from '../../utils/common';
import ReactDOM from 'react-dom';
import clone from 'clone';
import { LookupService, FieldBroadcastService } from './services';
import { Switch, TextField, Input, Popover, Popper, Fade, Typography, Paper, CircularProgress } from '@material-ui/core'
import EventListener from 'react-event-listener';
import {
    loadHandleBroadCast,
    loadConfigLookup,
    getParamLookup,
    getValueByIndex,
    cancelEvent,
    getValueSingleCharacter,
    getValueSingle,
    getValueSingleMultiple,
    getLinkByField,
    getValueCopy
} from './lookup_common';
import * as hotkeyAction from './hotkey';
import MenuNoneReference from './menu_lookup/menu_none_reference';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import lime from '@material-ui/core/colors/lime';
const ACTION_HOTKEY = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'];
const ACTION_KEYS = ['left', 'right', 'up', 'down', 'esc', 'enter', 'tab', 'space'];
const LOOKUP_LANGUAGE_CHANEL = 'lookup_language';
const API_LOOKUP_SPECIAL_CHARACTER = `${
    window.location.origin
    }/special_character.json`;

type ScrollToProps = {
    top: number,
    left: number,
    leftOffset: number,
    topOffset: number,
    behavior: 'auto' | 'instant' | 'smooth',
    block: 'start' | 'center' | 'end' | 'nearest',
    inline: 'start' | 'center' | 'end' | 'nearest',
}
type FieldProps = {
    name: string,
}
type Props = {
    broadcastChannel: number,
    value: string,
    scrollExtenal: boolean,
    disabled: boolean,
    scrollTo: ScrollToProps,
    field: FieldProps,
    canAutoPosition: boolean,
    fullWidth: boolean,
    switchDisable: any,
};
const initialState = {
    loading: false,
    value: '',
    anchorEl: undefined,
    isLookup: false,
    lookupUrl: '',
    data_broadcasts: {},
}
function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function setCaretToPos(input, pos) {
    setSelectionRange(input, pos, pos);
}

const getFieldCopyByshortcut = (field, code) => {
    try {
        return field.field_setting.shortcut_copy_field.filter(item => item.shortcut.toLocaleLowerCase() === code)[0].field_name
    } catch (error) {
        return;
    }
}

const getFieldFocusByshortcut = (field, code) => {
    try {
        return field.field_setting.shortcut_focus_field.filter(item => item.shortcut.toLocaleLowerCase() === code)[0].field_name
    } catch (error) {
        return;
    }
}

class Inputlookup extends React.Component<Props> {
    static defaultProps = {
        broadcastChannel: 0,
        value: '',
        value_check: '',
        component: TextField,
        scroll_extenal: false,
        disabled: false,
        scrollTo: {
            top: 0,
            left: 0,
            leftOffset: 0,
            topOffset: 144,
            behavior: 'auto',
            block: 'start',
            inline: 'start',
        }
    }
    constructor(props: Props, context: any) {
        super(props, context);
        this.isBlur = true;
        this.state = clone(initialState);
        this.inputInstanceId = Date.now();
        this.data_broadcasts = {};
        this.deplayLoadingLookup = debounce(this.loadingLookup, 350);

    }

    componentWillMount() {
        const { broadcastChannel, field, disabled, lookupLang } = this.props;
        this.inputInstanceId = this.inputInstanceId + field.name;
        FieldBroadcastService.changeData(broadcastChannel, field.name, this.props.value);
        if (this.props.value !== this.state.value) {
            this.setState({ value: this.props.value });
        }
        let lookupLangs;
        if (lookupLang) {
            lookupLangs = lookupLang.split(',')
        }

        this.setState({ lookupLangs })
    }

    componentDidMount() {
        let self = this;
        this.mounted = !0;
        const { field, broadcastChannel, addRef, tabIndex } = this.props;
        FieldBroadcastService.changeData(broadcastChannel, field.name, this.props.value);
        addRef && addRef(this.refs.valueField, tabIndex);
        this.deplayLoadingLookup = debounce(this.loadingLookup, 350);
        let lookupConfig = loadConfigLookup(field);
        let handleBroadCast = field.handle_broadcast && loadHandleBroadCast(field.handle_broadcast)
        if (lookupConfig) {
            if (lookupConfig.lookup_after_time) {
                this.getLookup = debounce(this.loadLookup, lookupConfig.lookup_after_time);
            } else {
                this.getLookup = this.loadLookup;
            }
            this.setState({ handleBroadCast, lookupConfig }, () => {
                if (self.await_mount_load) {
                    self.await_mount_load = false;
                    self.getLookup('', 0, lookupConfig);
                }
            })
        } else {
            this.setState({ handleBroadCast })
        }
        FieldBroadcastService.subscribe(broadcastChannel, field.name, this.handleChangeByBroadcast);
        if (field.field_setting && field.field_setting.copy_field) {
            this._copy_field = field.field_setting.copy_field
            FieldBroadcastService.subscribe(broadcastChannel, `@@change${field.field_setting.copy_field}`, this.handleCopyChangeByBroadcast);
        }
        LookupService.addListener(this.inputInstanceId, this.handleLookup);
    }
    handlePublishBroadCast = (value) => {
        const { field, broadcastChannel } = this.props;
        if (Array.isArray(field.fields_change_broadcast) && field.fields_change_broadcast.length) {
            field.fields_change_broadcast.forEach(field_name => {
                FieldBroadcastService.publish(broadcastChannel, field_name, { author: field.name, data: value })
            })
        }
    }
    componentWillReceiveProps(nextProps: Props) {
        const self = this;
        const { field, broadcastChannel, disabled, lookupLang } = nextProps;
        if (lookupLang !== this.props.lookupLang) {
            let lookupLangs;
            if (lookupLang) {
                lookupLangs = lookupLang.split(',')
            }
            this.setState({ lookupLangs })
        }
        if (!isEqual(field, this.props.field) || (broadcastChannel !== this.props.broadcastChannel)) {
            if (this._copy_field) {
                FieldBroadcastService.unsubsribe(broadcastChannel, `@@change${this._copy_field}`, this.handleCopyChangeByBroadcast);
            }
            if (this.state.lookupConfig) {
                FieldBroadcastService.unsubsribe(broadcastChannel, this.state.lookupConfig.subscribeFields, this.handleChangeByBroadcast)
            }
            let lookupConfig = loadConfigLookup(field);
            let handleBroadCast = field.handle_broadcast && loadHandleBroadCast(field.handle_broadcast)
            if (lookupConfig) {
                if (lookupConfig.lookup_after_time) {
                    this.getLookup = debounce(this.loadLookup, lookupConfig.lookup_after_time);
                } else {
                    this.getLookup = this.loadLookup;
                }
                this.setState({ lookupConfig, handleBroadCast })
                FieldBroadcastService.subscribe(broadcastChannel, lookupConfig.name, this.handleChangeByBroadcast);
            } else {
                this.setState({ handleBroadCast })
            }
            if (field.field_setting.copy_field) {
                this._copy_field = field.field_setting.copy_field
                FieldBroadcastService.subscribe(broadcastChannel, `@@change${field.field_setting.copy_field}`, this.handleCopyChangeByBroadcast);
            }
        }
        if (nextProps.value !== this.state.value) {
            this.setState({ value: nextProps.value }, () => {
                if (!self.props.disabled && !self.isBlur) {
                    self.loadLookup(nextProps.value, nextProps.value.length, self.state.lookupConfig)
                }
            });

            this.handlePublishBroadCast(nextProps.value)
        }
        if (nextProps.current !== this.props.current) {
            if (this.state.openPopoverLookup) {
                self.closePopover();
            }
        }
        FieldBroadcastService.changeData(broadcastChannel, field.name, nextProps.value);
    }

    shouldComponentUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {
        let shouldUpdate = !isEqual(this.state, nextState)
            || !isEqual(this.props, nextProps);
        return shouldUpdate;
    }

    componentWillUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

    }

    componentDidUpdate(prevProps: Props, prevState: TM_STATE_TYPE) {

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
    /**handle effect */
    closePopover = (callback) => {
        if (this.mounted) {
            this.props.onOpen && this.props.onOpen(!1);
            this.setState({ selection: null, focustion: null, openPopoverLookup: !1 }, callback);
        }
        try {
            this.setState({ selection: null, focustion: null, openPopoverLookup: !1 }, callback);
        } catch (error) {
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
    /**
     * handles
     */
    handleLookup = (data: { lookupDatas: Object, metadata: Object }) => {
        this.setLoading(false);
        if (!this.isBlur) {

            const { lookupDatas, metadata } = data;
            let open = !!lookupDatas;
            if (lookupDatas && lookupDatas[1] && lookupDatas[1].length === 0) {
                lookupDatas.splice(1, 1)
            }
            this.props.onOpen && this.props.onOpen(open)
            this.setState({
                lookupDatas: lookupDatas || [],
                selectionStart: metadata.selectionStart,
                indexVal: metadata.indexVal,
                special: metadata.special,
                openPopoverLookup: open,
                anchorEl: ReactDOM.findDOMNode(this.refs.valueField)
            });
        }
    }
    handleCopyChangeByBroadcast = (metadata) => {
        const { field, onUpdateInput, broadcastChannel } = this.props;
        const { data } = metadata;
        onUpdateInput && onUpdateInput(data, { source: 'change_by_broadcast' });
        this.handlePublishBroadCast(data)
        if (this.mounted)
            try {
                this.setState({ value: data })
            } catch (error) {
            }
    }
    handleChangeByBroadcast = async (metadata) => {
        const { field, onUpdateInput, broadcastChannel } = this.props;
        const { data, author, indexVal } = metadata;
        if (typeof this.state.handleBroadCast === "function") {
            let _data = await this.state.handleBroadCast(this.state.value, data, author, indexVal, field, FieldBroadcastService.getParam(broadcastChannel, 0, (a, b) => a));
            FieldBroadcastService.changeData(broadcastChannel, field.name, _data);
            onUpdateInput && onUpdateInput(_data, { source: 'change_by_broadcast' });
            this.handlePublishBroadCast(_data)
            if (this.mounted)
                try {
                    this.setState({ value: _data })
                } catch (error) {
                }
        } else {
            FieldBroadcastService.changeData(broadcastChannel, field.name, data);
            onUpdateInput && onUpdateInput(data, { source: 'change_by_broadcast' });
            this.handlePublishBroadCast(data)
            if (this.mounted)
                try {
                    this.setState({ value: data })
                } catch (error) {
                }
        }
    }
    handleChangeInput = (event) => {
        this.isBlur = false;
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
            if (lookupConfig) {
                this.getLookup(val, selectionStart, lookupConfig);
            }
            this.handlePublishBroadCast(val)
        }


    }
    handleKeyDown = (event) => {
        this.isBlur = false;
        const self = this;
        const { onKeyDown, nextFocus, field, onUpdateInput, broadcastChannel, copyValue, copyValueShortcut, focusFieldShortcut, shortcutFieldCopy, shortcutFieldFocus } = this.props;
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
                            cancelEvent(event);
                            self.closePopover(() => {
                                nextFocus(event, { goto: 'next' }, self);
                            })
                            self.closePopover()
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
            if (event.shiftKey) {
                _keyCode = 'shift+' + _keyCode
            }
            if (event.ctrlKey) {
                _keyCode = 'ctrl+' + _keyCode;
            }
            if (event.altKey) {

                _keyCode = 'alt+' + _keyCode
            }
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
                            const [_value, indexCusorNext] = getValueCopy(value, _selectionStart, data, true);
                            setTimeout(() => {
                                setCaretToPos(self._valueField, indexCusorNext)
                            }, 100)
                            FieldBroadcastService.changeData(broadcastChannel, field.name, _value);
                            onUpdateInput && onUpdateInput(_value, { source: 'change_by_capture' });
                            this.handlePublishBroadCast(_value)
                            if (self.mounted)
                                try {
                                    self.setState({ value: _value })
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
                    let fieldShortCut = getFieldCopyByshortcut(field, _keyCode);
                    let fieldShortCutFocus = getFieldFocusByshortcut(field, _keyCode);
                    if (fieldShortCut) {
                        cancelEvent(event);
                        copyValueShortcut && copyValueShortcut(fieldShortCut, (data) => {
                            if (data) {
                                const [_value, indexCusorNext] = getValueCopy(value, _selectionStart, data, true);
                                setTimeout(() => {
                                    setCaretToPos(self._valueField, indexCusorNext)
                                }, 100)
                                FieldBroadcastService.changeData(broadcastChannel, field.name, _value);
                                onUpdateInput && onUpdateInput(_value, { source: 'change_by_capture' });
                                this.handlePublishBroadCast(_value)
                                if (self.mounted)
                                    try {
                                        self.setState({ value: _value })
                                    } catch (error) {
                                    }
                            }
                        })
                    } else if (shortcutFieldCopy[_keyCode]) {
                        cancelEvent(event);
                        copyValueShortcut && copyValueShortcut(shortcutFieldCopy[_keyCode], (data) => {
                            if (data) {
                                const [_value, indexCusorNext] = getValueCopy(value, _selectionStart, data, true);
                                setTimeout(() => {
                                    setCaretToPos(self._valueField, indexCusorNext)
                                }, 100)
                                FieldBroadcastService.changeData(broadcastChannel, field.name, _value);
                                onUpdateInput && onUpdateInput(_value, { source: 'change_by_capture' });
                                this.handlePublishBroadCast(_value)
                                if (self.mounted)
                                    try {
                                        self.setState({ value: _value })
                                    } catch (error) {
                                    }
                            }
                        })
                    } else if (fieldShortCutFocus) {
                        cancelEvent(event);
                        focusFieldShortcut && focusFieldShortcut(fieldShortCutFocus)
                    } else if (shortcutFieldFocus[_keyCode]) {
                        cancelEvent(event);
                        focusFieldShortcut && focusFieldShortcut(shortcutFieldFocus[_keyCode])
                    } else {
                        onKeyDown && onKeyDown(event);
                    }
                    break;
            }
        }
    }
    handleOnClick = (event) => {
        this.isBlur = false;
        const { onClick, autoScroll } = this.props;
        if (this.time_scroll) {
            clearTimeout(this.time_scroll);
            delete this.time_scroll
        }
        const { lookupConfig } = this.state;
        onClick && onClick(event, this);
        let val = event.target.value;
        let selectionStart = event.target.selectionStart;

        if (lookupConfig)
            this.getLookup(val, selectionStart, lookupConfig);
    }
    handleFocus = (event) => {
        this.isBlur = false;
        const { field } = this.props;
        const { lookupConfig } = this.state;
        if (this.time_blur) {
            clearTimeout(this.time_blur);
            this.time_blur = null;
        }
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
    handleClosePopper = (event) => {
        const self = this;
        this.time_blur = setTimeout(() => {
            self.closePopover();
        }, 10);
    }
    handleBlur = (event) => {
        this.isBlur = true;
        const self = this;
        const { onBlur, broadcastChannel, field } = this.props;
        if (self.mounted) {
            self.props.onOpen && self.props.onOpen(!1);
            self.setState({ selection: null, focustion: null });
            // setTimeout(()=>{ self.closePopover()},100)
            this.time_blur = setTimeout(() => {
                onBlur && onBlur(event);
            }, 100);
        }
        FieldBroadcastService.publish(broadcastChannel, `@@change${field.name}`, { author: field.name, data: this.state.value })
    }
    /**
     * ./handles
     */

    /**stripget */
    loadLookup = (value, selectionStart, lookupConfig, special) => {
        const { lookupLangs } = this.state;
        const { broadcastChannel, field } = this.props;
        if (special) {
            let character = value.substring(selectionStart - 1, selectionStart);
            special['uri'] = API_LOOKUP_SPECIAL_CHARACTER;
            special['character'] = character;
            special['land'] = lookupLangs || field.special_land;
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
                let _lookupConfig = lookupConfig
                if (lookupLangs) {
                    let lookupUrl = getLinkByField({ ...field.lookup_source, locale: lookupLangs });
                    _lookupConfig = { ..._lookupConfig, lookupUrl, locale: lookupLangs }
                }
                if (lookupConfig.argument_details) {
                    let metadata = {
                        lookupConfig: _lookupConfig,
                        value,
                        params: '',
                        selectionStart,
                    }
                    this.setLoading();
                    LookupService.loadLookup(this.inputInstanceId, metadata)
                } else
                    if (value && value.length >= lookupConfig.characters_trigger_lookup) {
                        let { params, indexVal } = getParamLookup(lookupConfig, value, selectionStart, FieldBroadcastService, broadcastChannel);
                        params = params.map(item => encodeURI(item))
                        let metadata = {
                            lookupConfig: _lookupConfig,
                            value,
                            indexVal,
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
    setValueSelection = (selection, lookupDatas, event) => {
        let data = getValueByIndex(selection.row, selection.col, lookupDatas);
        this.setValueByLookup(data, event);
    }
    setValueByLookup = (data, event) => {
        const self = this;
        if (this.time_blur) {
            clearTimeout(this.time_blur);
            this.time_blur = null;
            this._valueField && this._valueField.focus();
        }
        if (!data) return;
        const { onUpdateInput, field, broadcastChannel, onOpen } = this.props;
        const { selectionStart, lookupConfig, special, value, indexVal } = this.state;
        onOpen && onOpen(!1);
        let val;
        if (lookupConfig.key_value === "current_value") {
            val = value;
        } else
            if (field.control_type === "COMBOBOX") {
                val = data[lookupConfig.key_value];
            }
            else
                if (special) {
                    val = getValueSingleCharacter(value, special.selectionStart, data, special.character);
                } else {
                    if (lookupConfig.multiple_delimiter) {
                        if (lookupConfig.allow_multiple) {
                            val = getValueSingle(value, selectionStart, data[lookupConfig.key_value], lookupConfig.lookup_space_after_choosen);
                        } else {
                            let [_val, indexCusorNext] = getValueSingleMultiple(value, indexVal, data[lookupConfig.key_value], lookupConfig.multiple_delimiter, lookupConfig.lookup_space_after_choosen);
                            val = _val;
                            setTimeout(() => {
                                setCaretToPos(self._valueField, indexCusorNext)
                            }, 100)
                        }
                    } else
                        if (lookupConfig.allow_multiple) {
                            val = getValueSingle(value, selectionStart, data[lookupConfig.key_value], lookupConfig.lookup_space_after_choosen);
                        } else {
                            val = data[lookupConfig.key_value] + (data[lookupConfig.key_value] && lookupConfig.lookup_space_after_choosen ? " " : '');
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
        this.handlePublishBroadCast(val)
        if (!special && Array.isArray(lookupConfig.lookup_broadcast)) {
            lookupConfig.lookup_broadcast.forEach((_droadCast) => {
                let valBroad = data[_droadCast.column_broadcast] || '';
                FieldBroadcastService.publish(broadcastChannel, _droadCast.field_broadcasted, { author: field.name, data: valBroad, indexVal })
            });
        }
        // this.loadLookup(val, selectionStart, lookupConfig)
    }
    blur = () => {
        this._valueField && this._valueField.blur();
    }
    focus = (scroll, content) => {
        this._valueField && this._valueField.focus();
        this.isBlur = false;
        const { autoScroll } = this.props;
        if (scroll) {
            if (autoScroll) this.needScroll(content);
        }
    }
    needScroll = (content) => {
        const self = this;
        const { scrollTo, scroll_extenal } = this.props;
        const node = ReactDOM.findDOMNode(self._valueField);
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
                                anchorEl: ReactDOM.findDOMNode(self._valueField)
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
            this.time_scroll = setTimeout(() => {
                node.scrollIntoView(scrollTo);
                if (content) {
                    content.scrollTop -= scrollTo.topOffset
                }
            }, 25)
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
    _getInput = () => {
        const {
            tabIndex,
            fullWidth,
            multiLine,
            rows,
            name,
            rowsMax,
            warning,
            textFieldStyle,
            label,
            autoFocus = false,
            readOnly = false,
            field,
            nextFocus,
            InputLabelProps,
            ref,
            scrollTo,
            autoScroll,
            switchDisable,
            broadcastChannel,
            scroll_extenal,
            onUpdateInput,
            component: InputComponent,
            shortcutFieldCopy,
            disabled,
            ...rest
        } = this.props;
        // let InputCustom = TextField;

        if (warning) {
            const theme = createMuiTheme({
                palette: {
                    error: {
                        contrastText: "rgba(0, 0, 0, 0.87)",
                        dark: "#FFB300",
                        light: "#FFB300",
                        main: "#FFB300"
                    },

                },
            });
            return (
                <MuiThemeProvider theme={theme}>
                    <InputComponent
                        {...rest}
                        multiline
                        margin="normal"
                        inputRef={node => this._valueField = node}
                        ref='valueField'
                        autoComplete='off'
                        tabIndex={tabIndex}
                        readOnly={readOnly}
                        name={field.name}
                        autoFocus={autoFocus}
                        disabled={disabled}
                        fullWidth={fullWidth}
                        label={label}
                        // multiLine={multiLine}
                        rows={rows}
                        rowsMax={rowsMax}
                        name={name}
                        InputLabelProps={InputLabelProps}
                        style={textFieldStyle}
                        value={this.state.value}
                        onChange={this.handleChangeInput}
                        onBlur={this.handleBlur}
                        onFocus={this.handleFocus}
                        onKeyDown={this.handleKeyDown}
                        onClick={this.handleOnClick}
                    />
                </MuiThemeProvider>
            )
        } else {
            return <InputComponent
                {...rest}
                ref='valueField'
                multiline
                margin="normal"
                inputRef={node => this._valueField = node}
                autoComplete='off'
                tabIndex={tabIndex}
                readOnly={readOnly}
                name={field.name}
                autoFocus={autoFocus}
                disabled={disabled}
                fullWidth={fullWidth}
                label={label}
                rows={rows}
                rowsMax={rowsMax}
                name={name}
                InputLabelProps={InputLabelProps}
                style={textFieldStyle}
                value={this.state.value}
                onChange={this.handleChangeInput}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onKeyDown={this.handleKeyDown}
                onClick={this.handleOnClick}
            />
        }
    }
    handleChangeDisable = (disabled) => {
        const { onChangeDisable } = this.props;
        if (onChangeDisable) {
            onChangeDisable(disabled)
        }
    }
    render() {
        const {
            field,
            switchDisable,
            fullWidth,
            validating,
            disabled,
        } = this.props;
        const {
            loading,
            openPopoverLookup,
            anchorEl,
        } = this.state;
        let maxHeight = 500;
        if (anchorEl && openPopoverLookup) {
            let positionElement = anchorEl.getBoundingClientRect();
            maxHeight = window.innerHeight - (positionElement.top + positionElement.height)

        }
        return (
            <div style={{
                display: 'inline-block',
                position: 'relative',
                width: fullWidth ? '100%' : 256
            }}>
                <Popper
                    placement={'bottom-start'}
                    open={!disabled && (openPopoverLookup || false)}
                    anchorEl={anchorEl}
                    transition>
                    {({ TransitionProps }) => (
                        <React.Fragment>
                            <EventListener target="window" onClick={this.handleClosePopper} />
                            <Fade {...TransitionProps} timeout={0}
                                style={{ width: anchorEl ? anchorEl.clientWidth : '100%' }}
                            >
                                <div
                                    className={'elevation20'}
                                    style={Object.assign(
                                        { background: 'rgba(255,255,255,0.95)' },
                                        { width: anchorEl ? anchorEl.clientWidth : '100%', minWidth: '500px' },
                                        {
                                            minHeight: '50px',
                                            maxHeight: maxHeight,
                                            overflowX: 'auto',
                                            // background:'red',
                                            // boxShadow: '0px 7px 8px -4px rgba(0, 0, 0, 0.2),0px 12px 17px 2px rgba(0, 0, 0, 0.14),0px 5px 22px 4px rgba(0, 0, 0, 0.12)'
                                        }
                                    )}>
                                    {this._getMenuLookup()}
                                </div>
                            </Fade>
                        </React.Fragment>
                    )}
                </Popper>
                {this._getInput()}
                {
                    switchDisable ? (<div style={{ position: 'absolute', top: 3, right: 5 }}>
                        <Switch
                            onChange={_ => this.handleChangeDisable(!disabled)}
                            checked={!disabled}
                        />
                    </div>) : ''
                }
                {
                    validating ? (<div style={{ zIndex: 20, position: 'absolute', top: 3, right: 5 }}>
                        <CircularProgress
                            variant="indeterminate"
                            disableShrink
                            // className={classes.facebook2}
                            size={24}
                            thickness={4}
                        />
                    </div>) : ''
                }
            </div>
        );
    }
}

export default Inputlookup;
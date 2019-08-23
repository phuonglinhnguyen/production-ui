import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import Snackbar from 'material-ui/Snackbar';
import { I18n } from 'react-redux-i18n';
import { removeMessage } from './action_creator';
import { isEqual } from 'lodash';
class Notification extends Component {
    static contextTypes = {
        muiTheme: PropTypes.object.isRequired
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        let shouldUpdate = !isEqual(this.props, nextProps)
            || !isEqual(this.state, nextState)
            || !isEqual(this.context, nextContext);
        return shouldUpdate;
    }
    render() {
        const { messages, onRemoveMessage } = this.props;
        const { muiTheme } = this.context;
        let open = !1;
        let _ms = '';
        let title = null;
        let time = 3000;
        let style = {};
        let action = () => { };
        if (messages[0]) {
            let _message = messages[0];
            open = !0;
            if (muiTheme.notification && muiTheme.notification[_message.type]) {
                style = muiTheme.notification[_message.type];
            }
            _ms = _message.message || '';
            if (_message.options) {
                if (_message.options.option) {
                    title = _message.options.option.title;
                    action = _message.options.option.listen || (() => { });
                }
                if (_message.options.duration) {
                    time = _message.options.duration;
                }
                if (_message.options.i18) {
                    _ms = I18n.t(_ms);
                }
            }
        }
        return (
            <Snackbar
                open={open}
                message={_ms}
                action={title}
                autoHideDuration={time}
                onActionClick={action}
                contentStyle={style}
                onRequestClose={() => onRemoveMessage()}
            />
        );
    }
}

function mapStateToProps(state) {
    const { messages } = state.notification;
    return { messages };
}

function mapDispatchToProps(dispatch) {
    return {
        onRemoveMessage: bindActionCreators(removeMessage, dispatch)
    }
}
export const HOCNotification = connect(mapStateToProps, mapDispatchToProps)
export default HOCNotification(Notification);

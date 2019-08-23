import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import clone from 'clone';
import { isEqual } from 'lodash';
import { LookupService, FieldBroadcastService } from '../input_lookup/lib/services';

const initialState = {
    loading: false,
    value: '',
    anchorEl: undefined,
    isLookup: false,
    lookupUrl: '',
    data_broadcasts: {},
}
class Combobox extends Component {
    constructor(props, context) {
        super(props, context);
        this.props = props;
        this.context = context;
        this.state = clone(initialState);
        this.inputInstanceId = Date.now();
        this.data_broadcasts = {};
    }
    static propTypes = {

    }
    static defaultProps = {
        floatingLabelFixed: false,
        floatingLabelText: '',
        value: '',
        disabled: false,
        field: {},
        onUpdateInput: () => undefined
    }
    handleChange = (chosenRequest) => {
        const { onUpdateInput } = this.props;
        onUpdateInput && onUpdateInput(chosenRequest, { source: 'change' }, null)
    }
    focus =(needScroll)=>{
        if(this._node){
            console.log('====================================');
            console.log('version current not support combobox focus, await to next version');
            console.log('====================================');
        }
    }
    render() {
        const {
            floatingLabelFixed,
            floatingLabelText,
            fullWidth,
            field,
            nextFocus,
            errorText,
            errorStyle,
            broadcastChannel,
            autoFocus,
            readOnly,
            disabled,
            value,
        } = this.props;
        let argument_details = field && field.argument_details  || [];
        const dataSource1 = argument_details.map(item => ({
            text:item.value,
            value:(<MenuItem key={item.value} value={item.value} primaryText={item.value} />)
        }))
        return (
            <AutoComplete
                ref={node=>{this._node=node}}
                disabled={field.disable||disabled}
                filter={AutoComplete.fuzzyFilter}
                dataSource={dataSource1}
                openOnFocus={true}
                autoFocus={autoFocus}
                floatingLabelText={floatingLabelText}
                floatingLabelText={floatingLabelText}
                errorText={errorText}
                errorStyle={errorStyle}
                fullWidth={fullWidth}
                value={value}
                onNewRequest={this.handleChange}
            />
        );
    }
}
Combobox.propTypes = {

};

export default Combobox;
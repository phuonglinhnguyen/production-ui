import React, { Component } from 'react';
import type { ComponentType, Node } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { registerResource, unregisterResource } from '@dgtx/coreui'
import formReducer from './formReducer'
import { bindActionCreators } from 'redux';
export type FieldPattern = {
    name: string,
    arguments: any,
    content: string,
}
export type FieldValidation = {
    name: string,
    arguments: any,
    content: string,
}
export type FieldRuleTransform = {
    name: string,
    arguments: any,
    content: string,
}
export type FieldLookupBroadcast = {
    field_broadcasted: string,
    column_broadcast: string
}
export type ViewLookup = {
    title: string,
    key_value: string,
}
export type FieldLookup = {
    id?: string,
    name: string,
    allow_multiple: boolean,
    characters_trigger_lookup: number,
    group_project: string,
    key_value: string,
    locale: string[],
    lookup_after_time: number,
    lookup_field: string,
    param_set: string,
    result_view_config: ViewLookup[],
    related_columns: any,
    specific_project: any,

}
export type Field = {
    _id: string,
    name: string,
    field_display: string,
    default_value: string,
    control_type: 'TEXTFIELD' | 'TEXTAREA' | 'COMBOBOX' | 'CHECKBOX' | 'RADIOBUTTON',
    tooltip: string,
    is_list: boolean,
    counted_character: boolean,
    pattern: FieldPattern,
    lookup_source: FieldLookup,
    validation: FieldValidation,
    rule_transform: FieldRuleTransform,
    lookup_broadcast: FieldLookupBroadcast,
    value_broadcast: string,
    argument_details: any,
    visible: boolean,
    disable: boolean,
    double_typing: boolean,
}


export type Section = {
    id: string,
    is_multiple: boolean,
    name: string,
    type?: 'mixed' | 'default',
    fields: Field[],

}
export type Config = {
    mapState?: Function,
    resource: string,
}
export type Props = {||}

export const FormRedux = (option: Config) => {
    const { mapState } = option
    return (WrappedComponent: ComponentType<*>) => {
        class Form extends Component<Props> {
            static WrappedComponent: ComponentType<*>
            context: ReactContext
            componentWillMount = () => {
                const { registerResource } = this.props
                registerResource([formReducer]);
            }
            componentWillUnmount = () => {
                const { unregisterResource } = this.props
                unregisterResource([formReducer]);
            }
            render() {
                const { registerResource, unregisterResource, ...rest } = this.props;
                return <WrappedComponent {...rest} />
            }
        }
        let actions = { registerResource, unregisterResource };
        const mapStateToProps = (state: any, ownProps: any) => {
            let _mapState = (typeof option.mapState === 'function') ? option.mapState(state, ownProps) : ownProps
            return {
                ..._mapState,
            }
        }
        const mapDispatchToProps = (dispatch: any) => bindActionCreators(actions, dispatch)
        return connect(mapStateToProps, mapDispatchToProps)(Form);
    }
}


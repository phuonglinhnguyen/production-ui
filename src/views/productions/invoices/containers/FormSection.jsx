import React from 'react'
import { isEqual } from 'lodash'
import { withStyles } from '@material-ui/core';
import { Typography, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import InputLookup from '../../../../@components/InputLookup';
import { compose } from 'recompose'
import { getDataObject } from '@dgtx/coreui';
import { connect } from 'react-redux';
import { createConnectField } from '../../../../@components/FormInput/ConnectField'
import ConnectFields from '../../../../@components/FormInput/ConnectFields'

import DialogIgnoreWaring from './DialogIgonreWaring';
const styles = (theme) => {
    return {
        button: {

        }
    }
}
// let ConnectField = createConnectField(InputLookup)


class FormSection extends React.Component {
    shouldComponentUpdate(nexProps) {
        return !isEqual(this.props.formState, nexProps.formState)
            || this.props.section !== nexProps.section;

    }
    render() {
        const {
            section,
            classes,
            content,
            shortcutFieldFocus,
            shortcutFieldCopy,
            formState: {
                disabled,
                saving,
                showSectionName
            }
            ,
        } = this.props;
        return (
            <div style={{ margin: 5 }}>
                {showSectionName ? <Typography variant="h6" >{section.name}</Typography> : ''}
                {section.fields.filter(item => item.visible).map((_field, index) => {
                    let {
                        disable: field_disable,
                        switch_disable,
                    } = _field.field_setting;
                    return (
                        <ConnectFields style={{
                            marginBottom: '16px'
                        }}
                            // variant='inline'
                            shortcutFieldCopy={shortcutFieldCopy}
                            shortcutFieldFocus={shortcutFieldFocus}
                            disabled={disabled}
                            autoScroll={true}
                            switchDisable={switch_disable}
                            content={content}
                            label={_field.field_display || _field.name}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sectionName={section.name}
                            fullWidth
                            rowId={0}
                            name={_field.name}
                            field={_field} />
                    );
                })}
            </div>
        )
    }

}


export default
    compose(connect((state, ownProps) => {
        const { fields = {}, current } = getDataObject('core.resources.form.data', state) || {};
        let fieldState = getDataObject([current, ownProps.section.name], fields) || []
        return {
            fieldState
        }
    }),
        withStyles(styles, { withTheme: true })
    )(FormSection)
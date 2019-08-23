import * as React from 'react';
import { withStyles, LinearProgress } from '@material-ui/core';
import { AutoSizer } from '../../../../@components/common';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
// import QuickAccess from '../../../../@components/QuickAccess';
// import { sections } from './data_sections'
import FormSection from './FormSection';
import classnames from 'classnames'
import FormSectionTable from './FormSectionTable';
import FormSectionLableInline from './FormSectionLableInline';
import { FormRedux } from '../../../../@components/FormInput/FormInput';
import { getDataObject } from '@dgtx/coreui';
import { isEqual } from 'lodash'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DialogIgnoreWaring from './DialogIgonreWaring';
import DialogIgonreWaringSection from './DialogIgonreWaringSection';
import ControlShortcut from './ControlShortcut';
import FormToolbarConnector from './FormToolbarConnector'
import LinearDeterminate from '../compenents/LinearDeterminate';

type Props = {};

const styles = (theme) => {
    return {
        root: {
            height: '100%',
            // background: 'red'
        },
        toolbar: {
            width: 'calc(100% - 12px)',
            marginTop: '0px',
            marginLeft: '4px',
            marginBottom: '8px',
            padding: 0,
        },
        paper: {
            width: 'calc(100% - 28px)',
            height: 'calc(100% - 194px)',
            marginTop: '2px',
            marginLeft: '4px',
            color: theme.palette.text.secondary,
        },
        content: {

        }
    }
}

const getShortCutFieldCopy = (sections: Array<any>) => {
    let result = {};
    sections.forEach(section => {
        Array.isArray(section.fields) && section.fields.forEach(field => {
            let shortcut = field.field_setting && field.field_setting.shortcut_copy
            if (shortcut && !result[shortcut]) {
                result[shortcut] = field.name
            }
        })
    })
    return result;
}



const getShortCutFieldFocus = (sections: Array<any>) => {
    let result = {};
    sections.forEach(section => {
        Array.isArray(section.fields) && section.fields.forEach(field => {
            let shortcut = field.field_setting && field.field_setting.shortcut_focus
            if (shortcut && !result[shortcut]) {
                result[shortcut] = field.name
            }
        })
    })
    return result;
}

class FormInvoice extends React.Component<Props> {
    shouldComponentUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {
        return !isEqual(nextProps.sections, this.props.sections)
            || this.props.focusSubmit !== nextProps.focusSubmit
            || this.props.disabled !== nextProps.disabled
            || this.props.saving !== nextProps.saving
            || this.props.validating !== nextProps.validating
    }
    render() {
        const { match, classes, sections, fields, disabled, saving, validating } = this.props
        const formState = {
            saving,
            disabled: disabled || saving,
            showSectionName: sections.length > 1
        }
        let shortcutFieldCopy = getShortCutFieldCopy(sections)
        let shortcutFieldFocus = getShortCutFieldFocus(sections)
        return (
            <div className={classes.root}>
                <ControlShortcut validating={validating} />
                <DialogIgnoreWaring />
                <DialogIgonreWaringSection />
                <div style={{ height: 8 }} />
                <Paper elevation={24} className={classes.toolbar}>
                    <FormToolbarConnector disabled={disabled} saving={saving} validating={validating} />
                </Paper>
                <Paper elevation={8} className={classnames(classes.paper)}>
                    <div style={
                        {
                            position:"absolute",
                            top: 0,
                            left: 0,
                            width: '100%',
                        }
                    }>
                    {validating && <LinearProgress />}   
                    </div>
                    <div style={{
                        width: "100%",
                        height: "100%",
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        padding: '0 8px 0 8px',
                    }} ref='content'>
                        {sections.map((item, idKey) => {
                            if (item.is_multiple) {
                                return <FormSectionTable
                                    key={idKey}
                                    formState={formState}
                                    content={this}
                                    shortcutFieldCopy={shortcutFieldCopy}
                                    shortcutFieldFocus={shortcutFieldFocus}
                                    section={item} />
                            }
                            return <FormSectionLableInline name={item.name}
                                key={idKey}
                                content={this}
                                formState={formState}
                                shortcutFieldCopy={shortcutFieldCopy}
                                shortcutFieldFocus={shortcutFieldFocus}
                                section={item}
                            />
                        }
                        )}
                        <div style={{
                            width: '50%',
                            height: 'calc(100% - 34px)'
                        }}>
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })(
    FormRedux({
        mapState: (state) => {
            const { sections = [] } = getDataObject('core.resources.form.data', state) || {};
            const { patching, dataPatch } = getDataObject('core.resources.form_state.data.patching,dataPatch', state) || {}
            return {
                sections,
                saving: patching
            }
        }
    })(FormInvoice));
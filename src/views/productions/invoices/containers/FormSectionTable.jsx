import React from 'react';
import { isEqual } from 'lodash'
import { withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import {
    Typography,
    TextField,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell, TableBody,
} from '@material-ui/core'
import { getDataObject } from '@dgtx/coreui';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InputLookup from '../../../../@components/InputLookup';
import { handleAddRecordSection, handleRemoveRecordSection } from '../../../../@components/FormInput'
import { createConnectField } from '../../../../@components/FormInput/ConnectField'
import ConnectFields from '../../../../@components/FormInput/ConnectFields'

let ConnectField = createConnectField(InputLookup)
const styles = (theme) => {
    return {
        button: {

        },
        tableScroll: {

        },
        scrollHead: {
            overflow: 'hidden',
            position: 'relative',
            border: '0px',
            width: '100%',
        },
        scrollBody: {
            overflow: 'auto',
            height: 'auto',
            maxHeight: '450px'
        }
    }
}

class FormSection extends React.Component {
    handleBodyScroll = (event) => {
        this._header.scrollLeft = this._body.scrollLeft

    }
    componentDidUpdate=()=>{
        this.initScroll();
    }
    componentDidMount() {
        this.initScroll();
    }
    initScroll=()=>{
        if(this.props.visible && !this.init_srcoll){
            this.init_srcoll =true;
            this._body.addEventListener('scroll', this.handleBodyScroll)
        }
    }
    shouldComponentUpdate(nexProps) {
        return !isEqual(this.props.formState, nexProps.formState)
            || this.props.section !== nexProps.section
            || this.props.visible !== nexProps.visible
            || this.props.fieldState.length !== nexProps.fieldState.length
    }
    render() {
        const {
            section,
            classes,
            fieldState,
            content,
            shortcutFieldCopy,
            shortcutFieldFocus,
            formState: {
                disabled,
                saving,
                showSectionName
            },
            handleAddRecordSection,
            handleRemoveRecordSection,
            visible
        } = this.props;
        if(!visible){
            return '';
        }
        let dataRows = fieldState
        let widthCell = 350;
        let fieldsVisible = section.fields.filter(item => item.visible);
        let lengthHeader = fieldsVisible.length;

        return (
            <div >
                <Typography variant="h6" >{`${section.name}:${fieldState.length}`} {fieldState.length > 0 ? (fieldState.length === 1 ? <span style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.54)', fontWeight: 500 }}>record</span> : <span style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.54)', fontWeight: 500 }}>records</span>) : ''}
                    <Button size="small" color="primary"
                        tabIndex={-1}
                        className={classes.button}
                        onClick={event => handleAddRecordSection({ sectionName: section.name })}
                    >
                        <AddIcon fontSize="small" />
                    </Button>
                    <Button size="small" color="primary"
                        tabIndex={-1}
                        className={classes.button}
                        onClick={event => handleRemoveRecordSection({ sectionName: section.name })}
                    >
                        <RemoveIcon fontSize="small" />
                    </Button>
                </Typography>
                <div className={classes.tableScroll}>
                    <div
                        ref={node => this._header = node}
                        className={classes.scrollHead}>
                        <div style={{
                            maxWidth: '300px'
                        }}>
                            <Table style={{ width: lengthHeader * widthCell + 200 }} className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: 50, padding: 0 /** borderBottom: '0px'  */ }} key={-1}>
                                            Total:{dataRows.length}
                                        </TableCell>
                                        {fieldsVisible.map((_field, index) => {
                                            return <TableCell style={{ width: widthCell, padding: 0 }} key={index}>{_field.field_display}</TableCell>
                                        })}
                                        <TableCell style={{ width: 150, padding: 0 }} key={-2}>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </div>
                    </div>
                    <div
                        ref={node => this._body = node}
                        className={classes.scrollBody}>
                        <div style={{
                            maxWidth: '0px'
                        }}>
                            <Table style={{ width: lengthHeader * widthCell + 50 }} className={classes.table}>
                                <TableBody>
                                    {dataRows.map((rowId) => {
                                        return (
                                            <TableRow key={rowId}  style={{height:"0px"}}>
                                                <TableCell component="th" scope="row" style={{ width: 50, padding: 0, borderBottom: '0px', marginBottom: '22px' }} key={-1}>
                                                    {rowId + 1}
                                                </TableCell>
                                                {fieldsVisible.map((_field, index) => {
                                                    let {
                                                        disable: field_disable,
                                                        switch_disable,
                                                    } = _field.field_setting;
                                                    return (
                                                        <ConnectFields
                                                            variant="table"
                                                            shortcutFieldCopy={shortcutFieldCopy}
                                                            shortcutFieldFocus={shortcutFieldFocus}
                                                            disabled={disabled}
                                                            style={{ marginBottom: '22px' }}
                                                            disableUnderline={true}
                                                            content={content} sectionName={section.name} fullWidth rowId={rowId} name={_field.name} field={_field} />
                                                    )
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                    <TableRow key={'empty'}></TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//<TableCell component="th" scope="row" style={{ width: widthCell, padding: 0, /** borderBottom: '0px' */}} key={index}></TableCell> 
export default
    compose(connect((state, ownProps) => {
        const { fields = {}, current } = getDataObject('core.resources.form.data', state) || {};
        let fieldState = (getDataObject([current, ownProps.section.name], fields) || []).map((item, index) => index)
        let visible =  false
        try {
            visible = Object.values(getDataObject([current, ownProps.section.name,0], fields)).filter(item=>item.visible).length>0
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
        

        return {
            visible,
            fieldState
        }
    },
        (dispatch: any) => bindActionCreators({ handleAddRecordSection, handleRemoveRecordSection }, dispatch)
    ),
        withStyles(styles, { withTheme: true })
    )(FormSection)
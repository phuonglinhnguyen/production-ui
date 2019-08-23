import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { getDataObject } from '@dgtx/coreui';
import { bindActionCreators } from 'redux';
import { handleForcusFirstWaring, ignoreWarning } from '../../../../@components/FormInput';

import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Translate } from 'react-redux-i18n';

let i18nModule = (key) => `productions.invoices.dialog_warning.${key}`

const styles = (theme) => {
    return {
        table: {
            minWidth: 700,
        },
        chip_warning: {
            margin: theme.spacing.unit,
            background: 'rgba(255,179,0,7)',
            color: "#FFFFFF",
        }
    }
}

const states = (state, ownProps) => {
    const { awaitFocus, showWarning, showWarnings, warning={}, warnings=[], current=0, sections=[], isCurrent } = getDataObject('core.resources.form.data', state)||{}
    return {
        open: showWarning,
        showWarnings,
        warnings,
        warning,
        current,
        sections,
        awaitFocus,
        datas: warning,
        isCurrent: isCurrent
    }
}
const actions = (dispatch) => bindActionCreators({ onClose: handleForcusFirstWaring, ignoreWarning }, dispatch)

class DialogIgnoreWaring extends React.Component {
    handleClose = () => {
        const { onClose } = this.props;
        onClose && onClose();
    };
    handleSubmit = () => {
        const { ignoreWarning, awaitFocus, isCurrent } = this.props;
        ignoreWarning && ignoreWarning(awaitFocus, isCurrent);
    }
    render() {
        const {
            datas,
            classes,
            warning,
            current,
            warnings,
            showWarnings,
            sections,
            open } = this.props;
        const renderBody = (data, sections) => {
            let sectionMutil = {};
            sections.forEach(section => { sectionMutil[section.name] = section.is_multiple });
            let result = [];
            Object.keys(data).forEach(sectionName => {
                let _datas = data[sectionName]
                _datas.forEach((data_item, indexData) => {
                    Object.keys(data_item).forEach(fieldName => {
                        let { datas, value, ignore } = data_item[fieldName]
                        let _message = datas.map(item => item.message).join(', ');
                        result.push({
                            sectionName,
                            indexData,
                            fieldName,
                            warning: _message,
                            value,
                            ignore
                        })
                    })
                })
            })
            return result.map((item, rowId) => {
                return (
                    <TableRow key={rowId}>
                        <TableCell component="th" scope="row">
                            {item.sectionName}
                        </TableCell>
                        <TableCell numeric>{item.indexData + 1}</TableCell>
                        <TableCell numeric>{item.fieldName}</TableCell>
                        <TableCell numeric>{item.warning}</TableCell>
                        <TableCell numeric>{item.value}</TableCell>
                        <TableCell >{
                            item.ignore ?
                                <Chip label={<Translate value={i18nModule('status_ignore')} />} className={classes.chip_warning} />
                                : <span style={{ color: "rgb(255,179,0)" }}>
                                    <Translate value={i18nModule('status_waiting')} />
                                </span>
                        }</TableCell>
                    </TableRow>
                );
            });
        }
        const renderBodys = (datas, sections) => {
            let sectionMutil = {};
            sections.forEach(section => { sectionMutil[section.name] = section.is_multiple });
            let result = [];
            datas.forEach((data, recordId) => {
                Object.keys(data).forEach(sectionName => {
                    let _datas = data[sectionName]
                    _datas.forEach((data_item, indexData) => {
                        Object.keys(data_item).forEach(fieldName => {
                            let { datas, value, ignore } = data_item[fieldName]
                            let _message = datas.map(item => item.message).join(', ');
                            result.push({
                                recordId,
                                sectionName,
                                indexData,
                                fieldName,
                                warning: _message,
                                value,
                                ignore
                            })
                        })
                    })
                })
            })
            return result.map((item, rowId) => {
                return (
                    <TableRow key={rowId}>
                        <TableCell component="th" scope="row">
                            {item.recordId + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                            {item.sectionName}
                        </TableCell>
                        <TableCell numeric>{item.indexData + 1}</TableCell>
                        <TableCell numeric>{item.fieldName}</TableCell>
                        <TableCell numeric>{item.warning}</TableCell>
                        <TableCell numeric>{item.value}</TableCell>
                        <TableCell >{item.ignore ? <Chip label={<Translate value={i18nModule('status_ignore')} />} className={classes.chip_warning} />
                            : <span style={{ color: "rgb(255,179,0)" }}>
                                <Translate value={i18nModule('status_waiting')} />
                            </span>}
                        </TableCell>
                    </TableRow>
                );
            });
        }
        if (showWarnings) {
            return (
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    maxWidth={false}
                    aria-labelledby="ignore-warning-dialog-title"
                >
                    <DialogTitle id="ignore-warning-dialog-title"><Translate value={i18nModule('title_waring_record')} /></DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Translate value={i18nModule('header.record_id')} /></TableCell>
                                        <TableCell><Translate value={i18nModule('header.section')} /></TableCell>
                                        <TableCell numeric><Translate value={i18nModule('header.index_data')} /></TableCell>
                                        <TableCell ><Translate value={i18nModule('header.field_name')} /></TableCell>
                                        <TableCell ><Translate value={i18nModule('header.message')} /></TableCell>
                                        <TableCell ><Translate value={i18nModule('header.value')} /></TableCell>
                                        <TableCell ><Translate value={i18nModule('header.status')} /></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {renderBodys(warnings, sections)}
                                </TableBody>
                            </Table>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            <Translate value={i18nModule('btn.cancel')} />
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary" autoFocus>
                            <Translate value={i18nModule('btn.ignore')} />
                        </Button>
                    </DialogActions>
                </Dialog >
            )
        }
        return (
            <Dialog
                open={open}
                onClose={this.handleClose}
                maxWidth={false}
                aria-labelledby="ignore-warning-dialog-title"
            >
                <DialogTitle id="ignore-warning-dialog-title"><Translate value={i18nModule('title_waring_records')} /><span>{current + 1}</span></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell><Translate value={i18nModule('header.section')} /></TableCell>
                                    <TableCell numeric><Translate value={i18nModule('header.index_data')} /></TableCell>
                                    <TableCell ><Translate value={i18nModule('header.field_name')} /></TableCell>
                                    <TableCell ><Translate value={i18nModule('header.message')} /></TableCell>
                                    <TableCell ><Translate value={i18nModule('header.value')} /></TableCell>
                                    <TableCell ><Translate value={i18nModule('header.status')} /></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {renderBody(datas, sections)}
                            </TableBody>
                        </Table>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        <Translate value={i18nModule('btn.cancel')} />
                    </Button>
                    <Button onClick={this.handleSubmit} color="primary" autoFocus>
                        <Translate value={i18nModule('btn.ignore')} />
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default connect(states, actions)(withStyles(styles, { withTheme: true })(DialogIgnoreWaring));
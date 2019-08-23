import React from 'react';
import compose from 'recompose/compose'
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
import { handleForcusFirstWaring, ignoreWarningSection } from '../../../../@components/FormInput';

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
    const { showWarningSection, warningSections={}, warning={}, warnings=[], current=0, sections=[], isCurrent } = getDataObject('core.resources.form.data', state)||{}
    return {
        open: showWarningSection,
        warningSections,
        current,
        sections,
    }
}
const actions = (dispatch) => bindActionCreators({ onClose: handleForcusFirstWaring, ignoreWarningSection }, dispatch)

class DialogIgnoreWaring extends React.Component {
    handleClose = () => {
        const { onClose } = this.props;
        onClose && onClose();
    };
    handleSubmit = () => {
        const { ignoreWarningSection, awaitFocus, isCurrent } = this.props;
        ignoreWarningSection && ignoreWarningSection();
    }
    render() {
        const {
            datas,
            classes,
            warning,
            current,
            warningSections,
            sections,
            open } = this.props;
        if(!warningSections[current]) return '';    

        const renderBody = (datas, ignore) => {
            let result = [];
            let warning = datas[0].datas.map(item => item.message).join(', ')
            result.push({
                warning,
                ignore
            })
            return result.map((item, rowId) => {
                return (
                    <TableRow key={rowId}>
                        <TableCell component="th" scope="row">
                            {item.warning}
                        </TableCell>
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
        const renderBodys = (datas, ignore) => {
            let result = [];

            datas.forEach(item=>{
                let warning = item.datas.map(item => item.message).join(', ')
                result.push({
                    sectionName:item.section,
                    warning,
                    ignore
                })
            })
            return result.map((item, rowId) => {
                return (
                    <TableRow key={rowId}>
                      <TableCell component="th" scope="row">
                            {item.sectionName}
                        </TableCell>
                        <TableCell component="th" scope="row">
                            {item.warning}
                        </TableCell>
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
        let warnings =[];
        try {
            warnings = warningSections[current].warnings
        } catch (error) {
            
        }
        if (warnings.length === 1) {
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
                                        <TableCell ><Translate value={i18nModule('header.message')} /></TableCell>
                                        <TableCell ><Translate value={i18nModule('header.status')} /></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {renderBody(warningSections[current].warnings, warningSections[current].ignore)}
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
                                    <TableCell ><Translate value={i18nModule('header.message')} /></TableCell>
                                    <TableCell ><Translate value={i18nModule('header.status')} /></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {renderBodys(warningSections[current].warnings, warningSections[current].ignore)}
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

export default compose(connect(states, actions),withStyles(styles, { withTheme: true }))(
    DialogIgnoreWaring
);
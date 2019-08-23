import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { Translate, I18n } from 'react-redux-i18n';

const styles = theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
});
let i18nModule = (key) => `productions.invoices.dialog_reason.${key}`
const ReasonDialog = (props) => {
    const {
        option,
        patching,
        saveTask,
        classes,
        dataPatch,
        hideCommentSave,
        changeCommentSave, } = props;
    const { label } = option || {};
    let _label = label ? label.toLocaleUpperCase() : ''
    return (
        <div>
            <Dialog
                open={Boolean(option) && !dataPatch}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    <Translate value={i18nModule('title')} label={_label} />
                </DialogTitle>
                <DialogContent>
                    <TextField
                        style={{ minWidth: '500px' }}
                        autoFocus
                        disabled={patching}
                        multiline
                        rowsMax="10"
                        margin="dense"
                        label={<Translate value={i18nModule('input_reason.label')} />}
                        placeholder={I18n.t(i18nModule('input_reason.placeholder'))}
                        fullWidth
                        onChange={event => changeCommentSave(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={patching}
                        onClick={event => { hideCommentSave() }} color="primary">
                        <Translate value={i18nModule('btn.cancel')} />
                    </Button>
                    <div className={classes.wrapper}>
                        <Button
                            color="primary"
                            disabled={patching}
                            onClick={_ => saveTask({ option })}
                        >
                            {patching ? <Translate value={i18nModule('btn.saving')} />
                                : <Translate value={i18nModule('btn.save')} />}
                        </Button>
                        {patching && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default withStyles(styles)(ReasonDialog);
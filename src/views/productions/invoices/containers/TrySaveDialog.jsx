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

let i18nModule = (key) => `productions.invoices.dialog_try_save.${key}`

const ReasonDialog = (props) => {
    const {
        patching,
        classes,
        dataPatch,
        tryCompleleTask,
        cancelTryPatch } = props;
    return (
        <div>
            <Dialog
                open={Boolean(dataPatch)}
                // onClose={event => { !patching && cancelTryPatch() }}
                aria-labelledby="form-dialog-title"
                aria-describedby="form-dialog-description"
            >
                <DialogTitle id="form-dialog-title"><Translate value={i18nModule('title')} /></DialogTitle>
                <DialogContent>
                    <DialogContentText id="form-dialog-description">
                        <p><Translate value={i18nModule('content')} /></p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={patching}
                        onClick={event => { cancelTryPatch() }} color="primary">
                        <Translate value={i18nModule('btn.cancel')} />
                    </Button>
                    <div className={classes.wrapper}>
                        <Button
                            color="primary"
                            disabled={patching}
                            onClick={_ => tryCompleleTask(dataPatch)}
                            autoFocus
                        >
                            <Translate value={i18nModule(patching ? 'btn.saving' : 'btn.try_save')} />
                        </Button>
                        {patching && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default withStyles(styles)(ReasonDialog);
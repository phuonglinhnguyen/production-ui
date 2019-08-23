import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { green, red, orange } from '@material-ui/core/colors';
import ViewRichText from '../ViewRichText';

const getType = (key) => {
    let result = green[500];
    switch (key) {
        case 'warning':
            result = orange[500]
            break;
        case 'error':
            result = red[500]
            break;
        default:
            break;
    }
    return result;
}
const styles = theme => ({

});
function DialogAnnouncement(props) {
    const { open, announcement, onClose } = props;
    const { subject = '',
        content = '',
        task = '',
        type = '' } = announcement
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            scroll='paper'
            maxWidth='lg'
        >
            <DialogTitle id="alert-dialog-title"
                style={{ background: getType(type), minWidth: '450px' }}
            >{subject ? subject : 'UnSubject'}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <ViewRichText value={content} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" autoFocus>
                    Close
            </Button>
            </DialogActions>
        </Dialog>
    )
}

export default withStyles(styles)(DialogAnnouncement);
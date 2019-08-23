import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';
import { Translate } from 'react-redux-i18n';
import { Paper } from '@material-ui/core';
const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles1 = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    snackbar: {
        margin: theme.spacing.unit,
        padding:16,
    },
});

function NotificationSnackbarsContent(props) {
    const { classes, className, notification, onClose } = props;
    const Icon = variantIcon[notification.type];
    if(notification.contentType ==="custom"){
        return(
            <Paper className={classNames(classes[notification.type], classes.snackbar, className)}>
                {notification.message}
            </Paper>
        )

    }
    return (
        <SnackbarContent
            className={classNames(classes[notification.type],  className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {
                        notification.i18n ?
                            <Translate value={notification.message} /> :
                            notification.message
                    }
                </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
        />
    );
}

NotificationSnackbarsContent.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const NotificationSnackbarsEnhanced = withStyles(styles1)(NotificationSnackbarsContent);

export const NotificationSnackbars = ({ notifications = [], hideNotification }) => {

    let notification = notifications[0]
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={!!notification}
            onClose={event => {
                hideNotification(0)
            }}
            autoHideDuration={notification && notification.duration}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}

        >
            {!!notification ? <NotificationSnackbarsEnhanced
                notification={notification}
                onClose={event => {
                    hideNotification(0)
                }}
            /> : (<div/>)}

        </Snackbar>

    )
}

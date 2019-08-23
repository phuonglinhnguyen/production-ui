import * as  React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import compose from 'recompose/compose';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PhoneIcon from '@material-ui/icons/Phone'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Badge from '@material-ui/core/Badge';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuUser from './menuUser'
import HomeIcon from '@material-ui/icons/Home'
import { redirectApp } from '@dgtx/coreui'
import NavBarRight from '../NavBarRight';
import axios from "axios";
import { REPORT_ENDPOINT, APP_NAME } from '../../constants'
import { PopoverUser } from '@dgtx/core-component-ui';
import FormControlLabel from '@material-ui/core/FormControlLabel';
const styles = theme => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        zIndex: 1300,
    },
    margin: {
        margin: theme.spacing.unit * 2,
    },
    toolbar: {
        paddingRight: 16,
    },
    menuButton: {
        marginLeft: '0.5em',
        marginRight: '0.5em',
    },
    menuButtonIconClosed: {
        transition: theme.transitions.create(['transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        transform: 'rotate(0deg)',
    },
    menuButtonIconOpen: {
        transition: theme.transitions.create(['transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        transform: 'rotate(180deg)',
    },
    title: {
        flex: 1,
    },
    badge: {

    },
    logout: {
        color: theme.palette.secondary.contrastText,
    },
    popup: {
        marginTop: 8,
        borderTopLeftRadius: 0, borderTopRightRadius: 0,
        minWidth: 300,
        maxWidth: 350,
        overflow: 'auto',
        height: "auto",
        boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px -4px 10px"
    },
    progress: { margin: '0px auto' },
    poperUser: {
        top: '48px',
        position: 'absolute',
        display: 'flex',
        zIndex: theme.zIndex.tooltip,
        width: "100%",
    }
});


class AppBar extends React.Component {
    state = {
        anchorEl: null,
        showAnnoncement: false,
        open: false,
        is_ajax: false,
        total_keyed_characters: 0,
        speed_second_per_char: 0

    };
    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    showReport = async () => {
        let { user } = this.props;
        if (this.state.is_ajax) {
            return;
        }
        this.setState({
            is_ajax: true,
            show_report: true
        });

        const data = await axios
            .get(`${REPORT_ENDPOINT}/apps/${APP_NAME}/users?speed`)
            .then(res => {
                let total_keyed_characters = res.data.total_keyed_characters
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                let speed_second_per_char = parseFloat(res.data.speed_second_per_char);
                if (speed_second_per_char > 0) {
                    speed_second_per_char = speed_second_per_char.toFixed(2);
                }
                return { total_keyed_characters, speed_second_per_char };
            })
            .catch(err => ({
                total_keyed_characters: 0,
                speed_second_per_char: 0
            }));

        this.setState({
            is_ajax: false,
            total_keyed_characters: data.total_keyed_characters,
            speed_second_per_char: data.speed_second_per_char
        });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    handleToggleAnnouncement = (toggle = false) => {
        this.setState({ showAnnoncement: toggle });
    }
    handleRead = (item) => {
        const { crudUpdate, user } = this.props;
        crudUpdate('announcement', {
            type: 'readed',
            username: user.username,
            id: item.id,
            data: item
        })
    }
    render = () => {
        const { classes,
            className,
            title,
            onLogout,
            toggleSidebar,
            loading,
            user,
            themes,
            changeTheme,
            announcement,
            ...rest } = this.props;
        const { anchorEl, showAnnoncement, is_ajax, total_keyed_characters, speed_second_per_char } = this.state;
        const open = Boolean(anchorEl);
        const getNoNewAnnouncement = (data = {}) => {
            if (data.data) {
                return Object.values(data.data).filter(item => !item.seen).length
            }
            return 0;
        }

        const noNewAnnouncement = getNoNewAnnouncement(announcement);
        return (
            <React.Fragment>
                <NavBarRight announcement={announcement} open={showAnnoncement} onRead={this.handleRead} onClose={() => this.handleToggleAnnouncement()} />
                <MuiAppBar
                    className={classNames(classes.appBar, className)}
                    position="absolute"
                >
                    <Toolbar disableGutters className={classes.toolbar}>
                        <Typography
                            variant="title"
                            color="inherit"
                            className={classes.title}
                        >
                            {typeof title === 'string' ? title : React.cloneElement(title)}
                        </Typography>
                        {loading > 0 && (<div>
                            <CircularProgress className={classes.progress} color="secondary" />
                        </div>)}
                        <div>
                            {/* <IconButton
                                aria-owns={open ? 'menu-list-grow' : null}
                                aria-haspopup="true"
                                // onClick={this.handleMenu}
                                color="inherit"
                            >
                                <PhoneIcon />
                            </IconButton> */}

                            <IconButton
                                aria-owns={open ? 'menu-list-grow' : null}
                                aria-haspopup="true"
                                onClick={event => { this.handleToggleAnnouncement(true) }}
                                color="inherit"
                            >
                                {noNewAnnouncement ?
                                    (<Badge className={classes.badge} badgeContent={noNewAnnouncement} color="secondary">
                                        <NotificationsIcon />
                                    </Badge>) : <NotificationsIcon />}
                            </IconButton>
                            {/* <IconButton
                                aria-owns={open ? 'menu-list-grow' : null}
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton> */}
                            <FormControlLabel
                                control={
                                    <AccountCircle />
                                }
                                label={<span style={{
                                    height: '64px',
                                    // margin: '-8px 0 0 0',
                                    color: 'white',
                                    position: 'relative',
                                    paddingLeft: '8px',
                                    verticalAlign: 'middle',
                                    letterSpacing: '0px',
                                    textTransform: 'uppercase',
                                    fontWeight: '500px',
                                    fontSize: '14px',
                                    fontWeight: '700',

                                }}>{user.displayName}</span>}
                                style={{margin: '0px'}}
                                onClick={this.handleMenu}
                            />

                            {/* <Popper
                                placement='bottom-end'
                                open={open} anchorEl={anchorEl} transition disablePortal>
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        id="menu-list-grow"
                                        style={{ transformOrigin: placement === 'bottom' ? 'bottom end' : 'bottom end' }}
                                    >
                                        <Paper className={classes.popup}>
                                            <ClickAwayListener onClickAway={this.handleClose}>
                                                <MenuUser onLogout={onLogout} user={user} is_ajax ={this.is_ajax} showReport={this.showReport} show_report= {this.state.show_report} total_keyed_characters= {total_keyed_characters} speed_second_per_char= {speed_second_per_char} />
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper> */}
                            <PopoverUser
                                open={open}
                                anchorEl={anchorEl}
                                onRequestClose={this.handleClose}
                                // themes={themes}
                                userName={user.username}
                                // onChangeTheme={onChangeTheme}
                                // onReportDate={onChangeTheme}
                                // onChangePassword={this.handleClickDialog}
                                onLogOut={onLogout}
                                // anchorOrigin={{
                                //     vertical: 'bottom',
                                //     // horizontal: 'center',
                                // }}
                                // transformOrigin={{
                                //     vertical: 'top',
                                //     // horizontal: 'center',
                                // }}
                                className={classes.poperUser}
                            />
                        </div>
                    </Toolbar>
                </MuiAppBar>
            </React.Fragment>
        )
    }
}
const enhance = compose(
    connect(
        state => ({
            locale: state.i18n.locale, // force redraw on locale change
        }),
    ),
    withStyles(styles)
);
export default enhance(AppBar);
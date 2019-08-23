import * as React from 'react'
import PropTypes from 'prop-types';
import classnames from 'classnames'
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AnnouncementItem from './AnnouncementItem';
import DialogAnnouncement from './DialogAnnouncement';
const styles = (theme) => ({
    list: {
        width: 350,
    },
    fullList: {
        width: '100%',
        height: 'calc(100vh - 74px)',
        overflow: 'auto',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        height: 64,
        zIndex: 1300,
    },
    tabs: {
        marginTop: 'auto',
    }
});
function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}
function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class NavBarRight extends React.Component {
    state = {
        showDetail: false,
        item: {},
    }
    handleShowItem = (item) => event => {
        const {onRead} = this.props;
        if(!item.seen){
            onRead(item)
        }
        this.setState({ item, showDetail: true })
    }
    handleCloseItem = () => {
        this.setState({  showDetail: false })
    }
    render() {
        const {
            open,
            onClose = () => null,
            classes,
            announcement = {},
            theme,
        } = this.props;
        let listNoti = announcement.data ? Object.values(announcement.data) : []
        let announcementList = (
            <div className={classnames(classes.fullList, 'cool_scroll_smart')}>
                {stableSort(listNoti, getSorting('desc', 'id')).map((item, index) => (
                    <AnnouncementItem key={index} dir={theme.direction} announcement={item}
                        onClick={this.handleShowItem(item)} />
                ))}
            </div>
        )
        return (
            <React.Fragment>
                <DialogAnnouncement open={this.state.showDetail} announcement={this.state.item} onClose={this.handleCloseItem}/>
                <SwipeableDrawer
                    anchor="right"
                    open={open}
                    disableDiscovery={true}
                    onClose={_ => { onClose() }}
                    onOpen={()=>{}}
                >
                    <div
                        tabIndex={0}
                        role="button"
                        style={{ width: '350px' }}
                    // onClick={this.toggleDrawer('right', false)}
                    // onKeyDown={this.toggleDrawer('right', false)}
                    >
                        <AppBar position="static" className={classes.appBar}>
                            <Tabs
                                value={0}
                                // onChange={this.handleChange}
                                // indicatorColor="primary"
                                // textColor="primary"
                                fullWidth
                                className={classes.tabs}

                            >
                                <Tab label="Notification" />
                                {/* <Tab label="Message" /> */}
                            </Tabs>
                        </AppBar>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={0}
                        // onChangeIndex={this.handleChangeIndex}
                        >
                            {announcementList}
                            {/* <div>Item Two</div> */}
                        </SwipeableViews>
                    </div>
                </SwipeableDrawer>
            </React.Fragment>

        )
    }
}



export default withStyles(styles, { withTheme: true })(NavBarRight)
import React, { Component } from 'react';
import { isEqual } from 'lodash'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import {
    MuiThemeProvider,
    createMuiTheme,
    withStyles,
} from '@material-ui/core/styles';
// import Hidden from '@material-ui/core/Hidden';
import compose from 'recompose/compose';
import { push } from 'connected-react-router'
import { matchPath, withRouter } from 'react-router'
import AppBar from './AppBar';
// import Menu from './Menu';
import defaultTheme from '../defaultTheme';
import BreadCrumd from './BreadCrumd';
import { redirectApp } from '@dgtx/coreui'
import Duplicate from './Duplicate'
import { APP_NAME } from '../../constants';
import Announcement from './Announcement'
import NotificationConnector from '../Notification/NotificationConnector';
import { upperCaseFirstString } from '@dgtx/core-component-ui';

const getParams = (paths, pathname) => {
    let match = null;
    for (let path of paths) {
        match = matchPath(pathname, path);
        if (match) {
            return {
                ...path,
                ...match
            }
        }
    }
    return;
}


const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1,
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: theme.palette.background.default,
    },
    mainConent: {
        // overflow: 'auto',
        width: '100vw',
        height: '100vh',
        position: 'relative',
        zIndex: 0,
    },
});
const Layout = (props) => {
    const { themes, classes, user, loading, changeTheme,
        onLogout,
        toggleSidebar, children, breadCrumd = [{
            id: 'all',
            path: 'home'
        }], dispatch, connect, socketIO, APP_VERSION, typeView,
        announcement,
        crudUpdate, } = props;
    return (
        <div className={classnames(classes.root)} >
            <AppBar
                title={<BreadCrumd
                    items={breadCrumd}
                    onSelect={item => {
                        if (item.id !== 'all') {
                            dispatch(push(item.path))
                        } else {
                            redirectApp('home')
                        }
                    }}
                />}
                loading={loading}
                user={user}
                themes={themes}
                changeTheme={changeTheme}
                toggleSidebar={toggleSidebar}
                onLogout={onLogout}
                announcement={announcement}
                crudUpdate={crudUpdate}
            />
            <div className={classnames(classes.mainConent, 'cool_scroll_smart')}>
                {connect.isRejectRoom && !socketIO.reconnect ?
                    <Duplicate />
                    :
                    children
                }
            </div>
            {
                (!typeView || typeView === 'dashboard') ?
                    <p style={{
                        position: 'fixed',
                        bottom: '-10px',
                        left: '0px',
                        fontSize: '10px',
                        zIndex: 10,
                    }
                    }>
                        <span>Version: </span>
                        <span style={{ color: 'rgba(0,0,0,0.6)' }} >{APP_VERSION}</span>
                    </p>
                    : ''
            }
        </div>
    )
}


const EnhancedLayout = compose(
    connect(),
    withStyles(styles)
)(Layout);
class LayoutWithTheme extends Component {
    constructor(props) {
        super(props);
        this.theme = createMuiTheme(props.theme);
        this.state = {
            projectId: '',
            projectName: '',
            taskName: '',
            breadCrumd: [{
                id: 'all',
                path: 'home'
            },
            {
                id: 'app',
                name: upperCaseFirstString(APP_NAME),
                path: '/'
            }]
        }
    }
    componentDidMount = () => {
        const { location, paths, getProjectById, user, socketIO, crudGetOne, crudGetList } = this.props;
        let pathname = location.pathname
        let match = null;
        let gui = null;
        crudGetList('announcement', { username: user.username },{onSuccess:()=>({}),onFailure:()=>({})});
        for (let path of paths) {
            match = matchPath(pathname, path);
            if (match) {
                gui = { ...path };
                break;
            }
        }
        if (match && match.params && match.params.projectId) {
            this.setState({ projectId: match.params.projectId })
            getProjectById(match.params.projectId)
            if (gui && gui.type !== 'dashboard') {
                crudGetOne('task', { projectId: match.params.projectId })
            }
        } else {
            if (this.state.projectName) {
                socketIO.joinRoom({
                    app_name: APP_NAME,
                    username: user.username,
                    project_name: '',
                    task_name: ''
                })
                this.setState({
                    projectName: '',
                    taskName: '',
                    type: 'dashboard',
                })
            }
        }
    }
    shouldComponentUpdate = (nextProps) => {
        return !isEqual(nextProps, this.props)
    }
    componentWillReceiveProps(nextProps) {
        if (isEqual(nextProps, this.props)) {
            return;
        }
        const { getProjectById, socketIO, crudGetOne, user } = this.props;
        /**@description Check change theme */
        if (nextProps.theme !== this.props.theme) {
            this.theme = createMuiTheme(nextProps.theme);
        }
        let _breachCrumd = [{ id: 'all', path: 'home' },
        { id: 'app', name: upperCaseFirstString(APP_NAME), path: '/' }
        ]
        /** @description if path is changed then check params and change room of user */
        if (nextProps.location.pathname !== this.props.location.pathname) {
            let match = getParams(nextProps.paths, nextProps.location.pathname)
            if (match && match.params && match.params.projectId) {
                if (match.params.projectId !== this.state.projectId) {
                    getProjectById(match.params.projectId)
                    if (match && match.type !== 'dashboard') {
                        crudGetOne('task', { projectId: match.params.projectId })
                    }
                    this.setState({ projectId: match.params.projectId })
                } else {
                    if (Object.values(nextProps.task.data).length === 0 || (match && match.type !== 'dashboard')) {
                        crudGetOne('task', { projectId: match.params.projectId }, { refresh: true })
                    }
                }
            } else {
                socketIO.joinRoom({
                    app_name: APP_NAME,
                    username: user.username,
                    project_name: '',
                    task_name: ''
                })
                this.setState({
                    projectName: '',
                    taskName: '',
                    type: 'dashboard',
                    breadCrumd: _breachCrumd
                })
            }
        } else {
            let taskItem = Object.values(nextProps.task.data).filter(item => nextProps.location.pathname.includes(item.form_uri))[0];
            let match = getParams(nextProps.paths, nextProps.location.pathname)
            let projectId = match && match.params && match.params.projectId;
            let taskName = taskItem ? taskItem.name : '';
            let projectName = nextProps.project.name;
            if (!projectId) {
                if (
                    taskName !== this.state.taskName &&
                    projectName !== this.state.projectName
                ) {

                    socketIO.joinRoom({
                        app_name: APP_NAME,
                        username: user.username,
                        project_name: '',
                        task_name: ''
                    })
                    this.setState({
                        projectName: nextProps.project.name,
                        taskName: '',
                        type: 'dashboard',
                        breadCrumd: _breachCrumd
                    })
                }
                return;
            }
            if (projectName !== this.state.projectName) {
                if (projectName) {
                    if (taskName) {
                        socketIO.joinRoom({
                            app_name: APP_NAME,
                            username: user.username,
                            project_name: nextProps.project.name,
                            task_name: taskName
                        })
                        _breachCrumd.push(
                            {
                                id: 'projectid',
                                name: nextProps.project.name,
                                path: `/projects/${nextProps.project.id}`
                            })
                        _breachCrumd.push(
                            {
                                id: 'function',
                                name: taskItem.name,
                            })
                        this.setState({
                            projectName: nextProps.project.name,
                            taskName: taskItem.name,
                            type: match.type,
                            breadCrumd: _breachCrumd
                        })
                    } else {
                        socketIO.joinRoom({
                            app_name: APP_NAME,
                            username: user.username,
                            project_name: projectName,
                            task_name: 'dashboard'
                        })
                        _breachCrumd.push(
                            {
                                id: 'projectid',
                                name: nextProps.project.name,
                                path: `/projects/${nextProps.project.id}`
                            })
                        this.setState({
                            projectName: nextProps.project.name,
                            taskName: '',
                            type: 'dashboard',
                            breadCrumd: _breachCrumd
                        })
                    }
                } else {
                    socketIO.joinRoom({
                        app_name: APP_NAME,
                        username: user.username,
                        project_name: '',
                        task_name: ''
                    })
                    this.setState({
                        projectName: '',
                        taskName: '',
                        type: 'dashboard',
                        breadCrumd: _breachCrumd
                    })
                }
            } else if (projectName && taskName !== this.state.taskName) {
                if (taskName) {
                    socketIO.joinRoom({
                        app_name: APP_NAME,
                        username: user.username,
                        project_name: nextProps.project.name,
                        task_name: taskName
                    })
                    _breachCrumd.push(
                        {
                            id: 'projectid',
                            name: nextProps.project.name,
                            path: `/projects/${nextProps.project.id}`
                        })
                    _breachCrumd.push(
                        {
                            id: 'function',
                            name: taskItem.name,
                        })
                    this.setState({
                        projectName: nextProps.project.name,
                        taskName: taskItem.name,
                        type: match.type,
                        breadCrumd: _breachCrumd
                    })
                } else {
                    socketIO.joinRoom({
                        app_name: APP_NAME,
                        username: user.username,
                        project_name: projectName,
                        task_name: 'dashboard'
                    })
                    _breachCrumd.push(
                        {
                            id: 'projectid',
                            name: nextProps.project.name,
                            path: `/projects/${nextProps.project.id}`
                        })
                    this.setState({
                        projectName: nextProps.project.name,
                        taskName: '',
                        type: 'dashboard',
                        breadCrumd: _breachCrumd
                    })
                }
            }
        }
    }
    render() {
        const { theme, ...rest } = this.props;
        const { breadCrumd, type } = this.state;
        return (
            <MuiThemeProvider theme={this.theme}>
                <Announcement open={rest.showNotification} notify={rest.notify} onClose={event => {
                    rest.closeAnnnouncement()
                    rest.crudUpdate('announcement', {
                        type: 'readed',
                        username: rest.user.username,
                        id: rest.notify.id,
                        data: rest.notify
                    })
                }}
                />
                <EnhancedLayout {...rest} typeView={type} breadCrumd={breadCrumd} />
                <NotificationConnector/>
            </MuiThemeProvider>
        );
    }
}

LayoutWithTheme.propTypes = {
    theme: PropTypes.object,
};

LayoutWithTheme.defaultProps = {
    theme: defaultTheme,
};

export default withRouter(LayoutWithTheme);

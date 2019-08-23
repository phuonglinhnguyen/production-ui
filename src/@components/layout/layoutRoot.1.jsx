import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import {
    MuiThemeProvider,
    createMuiTheme,
    withStyles,
} from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import compose from 'recompose/compose';

import AppBar from './AppBar';
import Menu from './Menu';
import defaultTheme from '../defaultTheme';
import { routesPrivate } from '../../routes/routeProvider'
import { matchPath } from 'react-router'
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
        overflow: 'auto',
        width: '100vw',
        height: '100vh',
        position: 'relative',
        zIndex: 10,
    },
});
const Layout = (props) => {
    const { themes, classes, user, loading, changeTheme,
        onLogout,
        toggleSidebar, children } = props;
    return (
        <div className={classnames(classes.root)} >
            <AppBar
                title={
                    <div
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            margin: '0px',
                            paddingTop: '0px',
                            letterSpacing: '0px',
                            fontSize: '24px',
                            fontWeight: '400',
                            color: 'rgb(255, 255, 255)',
                            height: '64px',
                            lineHeight: '64px',
                            flex: '1 1 0%'
                        }}>
                        Data
                    </div>
                }
                loading={loading}
                user={user}
                themes={themes}
                changeTheme={changeTheme}
                toggleSidebar={toggleSidebar}
                onLogout={onLogout}
            />
            <div className={classnames(classes.mainConent, 'cool_scroll_smart')}>
                {children}
            </div>
        </div >
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
        this.state={
            breadCrumd:[{
                id: 'all',
                path: 'home'
            },
            {
                id: 'app',
                name: 'Production',
                path: '/'
            }]
        }
    }
    componentDidMount = () => {
        const { location, getProjectById } = this.props;
        let pathname = location.pathname
        // let rprojectFunc = matchPath(pathname, {
        //     path: '/projects/:projectId/:funcName'
        // })
        // let rproject = matchPath(pathname, {
        //     path: '/projects/:projectId'
        // })
        // if (rproject) {
        //     getProjectById(rproject.params.projectId)
        // }
    }
    componentWillReceiveProps(nextProps) {
        const { project, getProjectById ,functions} = nextProps;
        if (nextProps.theme !== this.props.theme) {
            this.theme = createMuiTheme(nextProps.theme);
        }
        if (nextProps.location.pathname !== this.props.location.pathname ||this.props.project.name!==project.name ) {
            let _breachCrumd = [{
                id: 'all',
                path: 'home'
            },
            {
                id: 'app',
                name: 'Production Management',
                path: '/'
            }]
            let rprojectFunc = matchPath(nextProps.location.pathname, {
                path: '/projects/:projectId/:funcName'
            })
            let rproject = matchPath(nextProps.location.pathname, {
                path: '/projects/:projectId'
            })
            if (rproject && rproject.params.projectId) {
                if (project.id !== rproject.params.projectId) {
                    getProjectById(rproject.params.projectId)
                }
                let project_name = project.name //|| rproject.params.projectId;
                _breachCrumd.push(
                    {
                        id: 'projectid',
                        name: project_name,
                        path: `/projects/${rproject.params.projectId}`
                    })
            }
            if (rprojectFunc && rprojectFunc.params.funcName) {
              let _func = Object.values(functions).filter(item=>item.path.includes(rprojectFunc.params.funcName))[0]||{}
                _breachCrumd.push(
                    {
                        id: 'projectid',
                        name: _func.title||rprojectFunc.params.funcName,
                        path: `/projects/${rproject.params.projectId}/${rprojectFunc.params.funcName}`
                    })
            }
            this.setState({
                breadCrumd: _breachCrumd
            })
        }


    }
    render() {
        const { theme, ...rest } = this.props;
        return (
            <MuiThemeProvider theme={this.theme}>
                <EnhancedLayout {...rest} />
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

export default LayoutWithTheme;

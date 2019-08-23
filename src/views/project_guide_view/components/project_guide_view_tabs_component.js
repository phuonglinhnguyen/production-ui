import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { isEqual } from 'lodash';
import ProjectGuideViewTabsItemComponent from './project_guide_view_tabs_item_component';
import ProgressComponent from '../../progress/progress_component';

function TabContainer({ children, dir, style = {}, className }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 10, ...style }} className={className}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
    },
});

class ProjectGuideViewComponent extends React.Component {
    state = {
        value: 0,
        datas: [],
    };

    componentWillMount = () => {
        const { projectId, actions, project_guide_view } = this.props;
        if (projectId !== undefined) {
            actions && actions.getProjectGuides(projectId);
        }
        let datas = project_guide_view.data;
        this.setState({
            datas,
        })
    }

    componentWillUnmount = () => {
        this.setState({
            value: 0,
            datas: [],
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const { actions } = this.props;
        let projectId = nextProps.projectId;
        if (projectId && projectId !== this.props.projectId) {
            actions && actions.getProjectGuides(projectId);
            this.setState({
                value: 0,
                datas: [],
            });
        }
        let nextGuide = nextProps.project_guide_view.data;
        let currentGuide = this.state.datas;
        if (!isEqual(nextGuide, currentGuide)) {
            this.setState({
                datas: nextGuide,
            });
        }
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    render() {
        const { classes, theme, project_guide_view, actions, match, projectId } = this.props;
        const { datas } = this.state;
        let viewList = [{ folder_name: 'GUIDE LINES' }, { folder_name: 'UPDATE' }, { folder_name: 'WARNING' }, { folder_name: 'REPORT' }]
        let checkList = [{ folder_name: 'JOB' }, { folder_name: 'RULE' }, { folder_name: 'WARNING' }, { folder_name: 'SALARY' }]
        return (
            <div className={classes.root}>
                <AppBar position="static" color="default" className={classes.fullWidthContainer}>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                    >
                        {viewList.map((item, index) => (
                            <Tab label={item.folder_name} value={index} />
                        ))}
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.value}
                    onChangeIndex={this.handleChangeIndex}
                // className={classes.fullWidthContainer}
                >
                    {project_guide_view.data.length > 0 ?
                        checkList.map((item, index) => (
                            <React.Fragment>
                                {datas.filter(i => i.folder_name === item.folder_name).length > 0 ?
                                    <TabContainer dir={theme.direction} >
                                        <ProjectGuideViewTabsItemComponent
                                            data={datas.filter(i => i.folder_name === item.folder_name)[0]}
                                            project_guide_view={project_guide_view}
                                            actions={actions}
                                            projectId={projectId}
                                        />
                                    </TabContainer>
                                    :
                                    <TabContainer dir={theme.direction} >
                                        <ProjectGuideViewTabsItemComponent
                                            data={{ folder_name: item.folder_name, files: [] }}
                                            project_guide_view={project_guide_view}
                                            actions={actions}
                                            projectId={projectId}
                                        />
                                    </TabContainer>
                                }
                            </React.Fragment>
                        )) :
                        checkList.map(item => (
                            <TabContainer dir={theme.direction} >
                                {/* <ProgressComponent size={30} /> */}
                                <Typography variant="h6" gutterBottom style={{ textAlign: 'center' }}> No File Uploaded!</Typography>
                            </TabContainer>
                        ))
                    }
                </SwipeableViews>
            </div>
        );
    }
}

ProjectGuideViewComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ProjectGuideViewComponent);  

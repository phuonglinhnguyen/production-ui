import * as  React from 'react'
import { I18n } from 'react-redux-i18n'
import { getDataObject } from '@dgtx/coreui'
//stylesheet
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import {
    Paper,
    TextField,
    IconButton,
    Divider
} from '@material-ui/core'
import {
    Folder,
    FolderOpen
} from '@material-ui/icons'

import { TextSearch } from '../textFieldCustom'
import ProjectFunctions from './ProjectFunctionAssigned'
import { DialogConfirm } from './dialogConfirm'
import DialogManager from './DialogManager'
import ProjectEditer from './ProjectEditer'
import BreadCrumd from './BreadCrumd'
import ProjectList from './project_list/ProjectList'
import ListGroup from './ListGroup'
import ProjectGuideViewContainer from '../../views/project_guide_view/containers/project_guide_view_container';
import StorageIcon from '@material-ui/icons/Storage'
import Tooltip from '@material-ui/core/Tooltip';

const styles = (theme) => {
    return {
        wrapper: {
            height: 'calc(100vh)',
            width: 'calc(100vw)',
            overflow: 'hidden',
            // background: 'rgb(63, 81, 181)',
        },
        content: {
            // background:'red',
            marginTop: 64,
            height: 'calc(100% - 64px)',
            width: 'calc(100%)',
            display: 'flex',
            minWidth: "680px",
            minHeight: "800px",
            flexDirection: 'row',
            flexGrow: 1,
            padding: 0,
        },
        groupList: {
            height: 'calc(100%) ',
            minWidth: '240px',
            width: '15%',
            // background: 'green',//'rgba(255,255,255,0.4)'
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            boxSizing: 'border-box',
            // boxShadow: 'rgba(0, 0, 0, 0.12) 0px 0px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
            borderRadius: '0px',
        },
        subview: {
            height: 'calc(100%)',
            width: '100%',
            overflow: 'hidden',
            minWidth: "680px",
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            padding: 0,
        },
        subviewHeader: {

        },
        subview_content: {
            height: 'calc(100% - 64px)',
            marginTop: 0,
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            minWidth: "480px"
        },
        project_list: {
            height: '100%',
            minWidth: '450px',
            marginLeft: 8,
            width: '35%',
            overflowY: 'auto',
            background: 'rgba(255,255,255,0.4)',
            borderRight: '1px solid rgba(0,0,0,0.1)'
        }
    }
}


const Dashboard = (props) => {
    const {
        group_id = '',
        groups = [],
        users = {},
        project_id = '',
        projects = [],
        resources,
        project_guide,
        changeGroup,
        changeProject = () => null,
        changeGroupName,
        changeProjectName,
        changeGroupNameForProject,
        showCreateGroup,
        showCreateProject,
        showEditGroup,
        showEditProject,
        onSubmit,
        changeData,
        hideDialog,
        showDialogConfirm,
        onCancelConfirm,
        onSubmitConfirm,
        onClickFunc,
        checkProjectEdit,
        dashboard = {},
        toggerSiderbar,
        classes,
        functions,
    } = props;
    let project = projects.filter(item => project_id === item.id)[0] || {};
    let breakCrumd = getDataObject('data.group_data.address', dashboard) || [];
    let _projectName = getDataObject('data.projectName', dashboard);
    let dialogConfirm = getDataObject('data.dialogConfirm', dashboard) || {};
    let showGroup = getDataObject('data.showGroup', dashboard);
    const handleChange = type => (id, data) => {
        let isEditing = checkProjectEdit(project, dashboard)
        if (isEditing) {
            if (type === 'project') {
                showDialogConfirm({
                    type: 'edit_project',
                    show: true,
                    projectTo: id
                })
            } else {
                showDialogConfirm({
                    type: 'edit_project',
                    show: true,
                    groupTo: id,
                    groupData: data,
                })
            }
        } else {
            if (type === 'project') {
                changeProject(id)
            } else {
                changeGroup(id, data)

            }
        }

    }
    let withProject = project_id ? !showGroup ? 'calc(37% - 8px)' : 'calc(28 % - 8px)' : 'calc(100% - 8px)',
        withDetail = !showGroup ? '25%' : '28%',
        withGuide = !showGroup ? '38%' : '45%';
    return (
        <div className={classnames(classes.wrapper)}  >
            <div className={classnames(classes.content)}  >
                <DialogConfirm
                    open={dialogConfirm.show || false}
                    type={dialogConfirm.type}
                    onCancel={onCancelConfirm}
                    onSubmit={e => onSubmitConfirm(dialogConfirm)}
                />
                {showGroup &&
                    <div className={classnames(classes.groupList)}>
                        <ListGroup
                            items={groups}
                            itemId={group_id}
                            changeGroupName={changeGroupName}
                            onChange={handleChange('group')}
                            onCreateProject={showCreateProject}
                            onCreateGroup={showCreateGroup}
                        />
                    </div>
                }
                <div className={classnames(classes.subview)}>
                    <div className={classnames(classes.subviewHeader)}>
                        {/* <div style={{
                            position: 'relative',
                            width: '100%',
                            display: 'flex',
                            paddingRight: '16px',
                        }}>
                            <TextSearch
                                value={getDataObject('data.projectName', dashboard)}
                                onChange={changeProjectName}
                            />
                            <div style={{
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
                            </div>
                            <div style={{
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingRight: 8
                            }} >
                                <IconButton tooltip={showGroup ? 'Hidden Groups' : 'Show Group'} onClick={event => { toggerSiderbar(!showGroup) }}  >
                                    {showGroup ? <FolderOpen /> : <Folder />}
                                </IconButton>
                            </div>
                        </div> */}
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div style={{ flexGrow: '0' }}>
                            <Tooltip
                                    title={showGroup ? 'Hidden Groups' : 'Show Group'}
                                    placement={'bottom-start'}
                                    enterDelay={300}
                                >
                                    <IconButton variant="fab" mini onClick={event => { toggerSiderbar(!showGroup) }}  >
                                        <StorageIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div style={{ flexGrow: '8' }}>
                                <BreadCrumd
                                    // style ={{background:'red'}}
                                    items={breakCrumd}
                                    onSelect={item => { changeGroup(item.id, { name: item.name }) }}
                                    showCreateProject={showCreateProject}
                                    onAction={action => { if (action === 'create_project') showCreateProject() }}
                                />
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <div className={classnames(classes.subview_content)} >
                        <div className={classnames(classes.project_list, 'cool_scroll_smart')}
                            style={{ width: withProject }}
                        >
                            <ProjectList
                                project_id={project_id}
                                showGroup={showGroup}
                                projectName={_projectName}
                                groupName={getDataObject('data.groupName', dashboard)}
                                resources={resources}
                                projects={projects}
                                project={projects.filter(item => project_id === item.id)[0] || {}}
                                changeProject={handleChange('project')}
                                dashboard={dashboard}
                                changeProjectName={changeProjectName}
                                showCreateProject={showCreateProject} />
                        </div>
                        {
                            project_id &&
                            (
                                <React.Fragment>
                                    <div style={{
                                        height: 'calc(100%)',
                                        minWidth: 'auto',
                                        width: withDetail,
                                        background: 'rgba(255,255,255,0.4)',
                                        position: 'relative'
                                    }}>
                                        {project_id &&
                                            // <Paper elevation={2}>
                                                <ProjectFunctions
                                                    onClose={event => changeProject()}
                                                    project={projects.filter(item => project_id === item.id)[0] || {}}
                                                    functions={functions}
                                                    onClickItem={onClickFunc}
                                                />
                                            // </Paper>
                                        }
                                    </div>
                                    <div style={{
                                        height: 'calc(100%)',
                                        minWidth: 'auto',
                                        width: withGuide,
                                        background: 'rgba(255,255,255,0.4)',
                                        position: 'relative'
                                    }}>
                                        {project_id &&
                                            <ProjectGuideViewContainer projectId={project_id} />
                                        }
                                    </div>
                                </React.Fragment>
                            )
                        }
                    </div>
                </div>
            </div>
            <DialogManager
                dialogType={getDataObject('data.dialogType', dashboard)}
                showDialog={getDataObject('data.showDialog', dashboard)}
                groups={groups}
                users={users}
                hideDialog={hideDialog}
                changeData={changeData}
                dashboard={dashboard}
                onSubmit={onSubmit}
            />
        </div >
    )
};

export default compose(
    withStyles(styles)
)(Dashboard);
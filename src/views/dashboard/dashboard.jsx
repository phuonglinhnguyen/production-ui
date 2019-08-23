import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router'

import {
  redirectApp,
  crudGetOne,
  crudGetList,
  getResources,
  PageDecorator,
  getDataObject
} from '@dgtx/coreui'

import { Dashboard } from '../../@components';
import {
  USER_ROLE_MANAGEMENT,
  REMAIN_DOCUMENT,
  USERS, PROJECT_FUNCTIONS, REMAIN_HUMAN_TASK,
  USER_TASKS,
  TASK_INFO,
  PROJECTS_TASKS_ASSIGINED
} from '../../providers';
import { push as pushPath } from 'connected-react-router'

import dashboardReducer from './reducer'
import {
  initDataDashboard,
  changeGroup,
  changeProject,
  changeGroupName,
  changeProjectName,
  changeGroupNameForProject,
  showCreateGroup,
  showCreateProject,
  showEditGroup,
  showEditProject,
  hideDialog,
  changeData,
  onSubmit,
  onClickFunc,
  onCancelConfirm,
  onSubmitConfirm,
  checkProjectEdit,
  showDialogConfirm,
  toggerSiderbar,
} from './Dashboard.actionsCreator'
import { getFunction } from '../../constants/functions';

import { JIVO_ID } from '../../constants';

const resources = [
  { name: 'group' },
  { name: PROJECTS_TASKS_ASSIGINED },
  { name: TASK_INFO },
  dashboardReducer
]

 class DashboardContainer extends Component {
  getWidgetId() {
    return JIVO_ID;
  }

  chat() {
      var widgetId = this.getWidgetId();

      if (widgetId) {
        var jivoElementArr = document.getElementsByClassName('globalClass_ET');
        if (jivoElementArr && jivoElementArr.length > 0) {
          var jivoElement = jivoElementArr[0]
          if (jivoElement.style.display.includes('none')) {
            jivoElement.style = "display:''"
          }

        }
        var jivoIframe = document.getElementById('jivo-iframe-container');
        if (jivoIframe) {
          if (jivoIframe.style.display.includes('none')) {
            document.getElementById('jivo-iframe-container').style = "display:' '!important"
          }
        }

        var d = document; var w = window; function l() {

          var s = document.createElement('script'); s.type = 'text/javascript';
          s.async = true;
          s.src = `//code.jivosite.com/script/widget/${widgetId}`;
          var ss = document.getElementsByTagName('script')[0]; ss.parentNode.insertBefore(s, ss);
        }
        if (d.readyState === 'complete') { l(); } else {
          if (w.attachEvent) { w.attachEvent('onload', l); }
          else { w.addEventListener('load', l, false); }
        }
      }
  }
  componentWillMount() {
    const { crudGetOne, changeGroup, crudGetList, user } = this.props;
    crudGetList('group', {});
    changeGroup('all', { group_id: 'all' });
  }

  componentDidMount() {
    this.chat();
  }

  componentWillReceiveProps = (nextProps) => {
    const { initDataDashboard, core, changeProject } = this.props;
    let inited = getDataObject("core.resources.dashboard.data.inited", core)
    let dashboard = getDataObject("core.resources.dashboard.data", core)
    if (core.loading > 0 && nextProps.core.loading === 0 &&
      dashboard &&
      !inited) {
      let projectid = nextProps.match.params.projectId || ''
      initDataDashboard(core.resources, projectid);
      changeProject(projectid);
    }
  }
  hanbleChangeProject = (item) => {
    const { pushPath, changeProject } = this.props;
    if (item) {
      pushPath(`/projects/${item}`);
    } else {
      pushPath(`/`);
    }
    changeProject(item);
  }
  render() {
    const {
      muiTheme,
      history
    } = this.context;
    const { core,
      actions,
      changeGroup,
      changeProject,
      changeGroupName,
      changeProjectName,
      changeGroupNameForProject,
      showCreateGroup,
      showCreateProject,
      showEditGroup,
      showEditProject,
      hideDialog,
      changeData,
      onCancelConfirm,
      onSubmitConfirm,
      onClickFunc,
      showDialogConfirm,
      toggerSiderbar,
      onSubmit
    } = this.props;
    const { dashboard, group, projects_tasks_assigned, task_info } = core.resources;
    const { group_id, group_data = {}, project_id = '', } = dashboard && dashboard.data || {}

    const groups = group && group.list ? group.list.ids.map(id => {
      return group.data[id]
    }) : []
    let projects = [];
    let functions = [];
    if (projects_tasks_assigned && projects_tasks_assigned.data) {
      projects = projects_tasks_assigned.list.ids.map(id => projects_tasks_assigned.data[id]) || [];
      if (project_id) {
        let mapTasks = {};
        // Object.values(task_info.data).forEach(item=>{
        //   mapTasks[item.form_uri] = item.instances
        // })
        functions = task_info.list.ids.map(id => task_info.data[id])

        // projects_tasks_assigned.data[project_id].tasks_assigned.map(item=>({...item,title:item.name,instances:mapTasks[item.form_uri]||'' }))
      }
    }
    return (
      <React.Fragment>
        <Dashboard
          task_id={''}
          group_id={group_id}
          groups={groups}
          project_id={project_id}
          projects={projects}
          resources={core.resources}
          project_guide={{}}
          functions={functions}
          dashboard={dashboard}
          changeGroup={changeGroup}
          changeProject={this.hanbleChangeProject}
          changeGroupName={changeGroupName}
          changeProjectName={changeProjectName}
          changeGroupNameForProject={changeGroupNameForProject}
          showCreateGroup={showCreateGroup}
          showCreateProject={showCreateProject}
          showEditGroup={showEditGroup}
          showEditProject={showEditProject}
          hideDialog={hideDialog}
          changeData={changeData}
          showDialogConfirm={showDialogConfirm}
          onCancelConfirm={onCancelConfirm}
          onSubmitConfirm={onSubmitConfirm}
          checkProjectEdit={checkProjectEdit}
          onSubmit={onSubmit}
          onClickFunc={onClickFunc}
          toggerSiderbar={toggerSiderbar}
        />
      </React.Fragment>
    )
  }
}

export default PageDecorator({
  resources: resources,
  actions: {
    crudGetOne,
    crudGetList,
    initDataDashboard,
    changeGroup,
    changeProject,
    changeProjectName,
    changeGroupNameForProject,
    showCreateGroup,
    showCreateProject,
    showEditGroup,
    showEditProject,
    hideDialog,
    changeData,
    onSubmit,
    onCancelConfirm,
    onSubmitConfirm,
    onClickFunc,
    showDialogConfirm,
    toggerSiderbar,
    pushPath,

  },
  mapState: (state) => ({
    core: state.core
  })
})(DashboardContainer)
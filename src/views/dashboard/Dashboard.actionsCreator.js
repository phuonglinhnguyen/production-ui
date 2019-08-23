import clone from 'clone'
import { isEqual } from 'lodash'
import { push } from 'connected-react-router'
import {
  INIT_DATA_DASHBOARD,
  DASHBROAD_CHANGE_VALUE_ITEM
} from './Dashboard.actions';
import {
  crudGetOne,
  crudCreate,
  crudUpdate,
  crudGetList,
  crudGetMany,
  getDataFromResource,
  getDataObject,
  setDataObject,
  crudGetCount
} from '@dgtx/coreui'
import { PROJECT_FUNCTIONS, REMAIN_HUMAN_TASK, REMAIN_DOCUMENT, USER_TASKS, PROJECTS_TASKS_ASSIGINED, TASK_INFO } from '../../providers';

export const initDataDashboard = (resources,projectId) => {
  let group = resources['group']
  let current_user = {};
  let group_items = [];
  if (group.list.ids.length > 0) {
    group.list.ids.forEach(groupId => {
      group_items.push(group.data[groupId]);
    })
  }
  let result = {
    inited: true,
    user: current_user,
    project_id: projectId,
    group_id: 'all',
    group_data: findGroup('all', { id: 'all', name: "Group", childs: group_items }),
    group_items,
    showGroup: true,
  }

  return {
    type: INIT_DATA_DASHBOARD,
    payload: result,
    meta: {
      resource: 'dashboard'
    }
  }
}

function getProjectProps(group) {
  let projects = [];
  if (group.childs) {
    for (let index = 0; index < group.childs.length; index++) {
      const item = group.childs[index];
      if (item.type === 'Project') {
        projects.push(item)
      } else {
        projects = [...projects, ...getProjectProps(item)]
      }
    }
  }
  return projects;

}

function findGroup(id, group) {
  if (id === group.id) {
    let projects = getProjectProps(group)
    return {
      projects,
      group,
      address: [group]
    }
  } else {
    if (group.childs) {
      let _group;
      for (let index = 0; index < group.childs.length; index++) {
        const item = group.childs[index];
        _group = findGroup(id, item);
        if (_group) break;
      }
      if (_group) {
        return {
          projects: _group.projects,
          group: _group.group,
          address: (_group.address ? [group].concat(_group.address) : [group])
        }
      } else {
        return null;
      }
    }
  }
}

export const changeGroup = (id, data) => (dispatch, getState) => {
  let username = getState().user.user.username;
  let { user, group, project, dashboard } = getState().core.resources
  let group_data = { group: {}, address: [] };
  if (id === 'all') {
    group_data = findGroup('all', { id: 'all', name: "Group", childs: dashboard.data.group_items });
  } else {
    group_data = findGroup(id, { id: 'all', name: "Group", childs: dashboard.data.group_items });
  }
  dispatch(crudGetList(PROJECTS_TASKS_ASSIGINED, { group_id: id, username },
    {
      onSuccess: {},
      onFailure: {},
      refresh:true,
    }));
  dispatch({
    type: DASHBROAD_CHANGE_VALUE_ITEM,
    payload: {
      edit: undefined,
      group_id: id,
      group_name: data.name,
      group_data,
      project_id: ''
    },
    meta:
    {
      resource: 'dashboard'
    }
  })
}
export const changeProject = (id) => (dispatch, getState) => {
  let { group, project, dashboard } = getState().core.resources;
  if (id) {
    dispatch(crudGetList(TASK_INFO, {project_id:id }),{keyId:'form_uri'} )
    dispatch({
      type: DASHBROAD_CHANGE_VALUE_ITEM,
      payload: { project_id: id},
      meta:
      {
        resource: 'dashboard',
      }
    })
  } else {
    dispatch({
      type: DASHBROAD_CHANGE_VALUE_ITEM,
      payload: { project_id: id },
      meta:
      {
        resource: 'dashboard',
      }
    })
  }
}

export const changeGroupName = (text) => ({
  type: DASHBROAD_CHANGE_VALUE_ITEM,
  payload: { groupName: text, group_id: '' },
  meta:
  {
    resource: 'dashboard',
  }
})
export const changeProjectName = (text) => ({
  type: DASHBROAD_CHANGE_VALUE_ITEM,
  payload: { projectName: text, },
  meta:
  {
    resource: 'dashboard',
  }
})

export const DASHBROAD_DIALOG_TYPE_CREATE_GROUP = 'DASHBROAD_DIALOG_TYPE_CREATE_GROUP'
export const DASHBROAD_DIALOG_TYPE_EDIT_GROUP = 'DASHBROAD_DIALOG_TYPE_EDIT_GROUP'
export const DASHBROAD_DIALOG_TYPE_CREATE_PROJECT = 'DASHBROAD_DIALOG_TYPE_CREATE_PROJECT'
export const DASHBROAD_DIALOG_TYPE_EDIT_PROJECT = 'DASHBROAD_DIALOG_TYPE_EDIT_PROJECT'


export const showCreateGroup = () => ({
  type: DASHBROAD_CHANGE_VALUE_ITEM,
  payload: {
    showDialog: true,
    groupNameEditing: '',
    dialogType: DASHBROAD_DIALOG_TYPE_CREATE_GROUP
  },
  meta:
  {
    resource: 'dashboard',
  }
})

export const showCreateProject = () => (dispatch, getState) => {
  let { dashboard } = getState().core.resources;
  let group_id = getDataObject('data.group_id', dashboard),
    group_name = getDataObject('data.group_name', dashboard);
  dispatch({
    type: DASHBROAD_CHANGE_VALUE_ITEM,
    payload: {
      showDialog: true,
      add_project: {
        group_id,
        group_name
      },
      dialogType: DASHBROAD_DIALOG_TYPE_CREATE_PROJECT
    },
    meta:
    {
      resource: 'dashboard',
    }
  })
}
export const changeGroupNameForProject = (text) => ({
  type: DASHBROAD_CHANGE_VALUE_ITEM,
  payload: { groupNamePrject: text },
  meta:
  {
    resource: 'dashboard',
  }
})

export const showEditGroup = (groupName) => ({
  type: DASHBROAD_CHANGE_VALUE_ITEM,
  payload: {
    showDialog: true,
    groupNameEditing: groupName,
    dialogType: DASHBROAD_DIALOG_TYPE_EDIT_GROUP
  },
  meta:
  {
    resource: 'dashboard',
  }
})

export const showEditProject = (projectName) => ({
  type: DASHBROAD_CHANGE_VALUE_ITEM,
  payload: {
    showDialog: true,
    projectNameEditing: projectName,
    dialogType: DASHBROAD_DIALOG_TYPE_EDIT_PROJECT
  },
  meta:
  {
    resource: 'dashboard',
  }
})
export const hideDialog = () => ({
  type: DASHBROAD_CHANGE_VALUE_ITEM,
  payload: { showDialog: false, dialogType: '' },
  meta:
  {
    resource: 'dashboard',
  }
})
export const changeData = (name: string | Object, value?: any) => (
  dispatch, getState
) => {
  let { user, group, project, dashboard } = getState().core.resources;
  let _dashboard = clone(dashboard)
  setDataObject(name, value, _dashboard)
  dispatch({
    type: DASHBROAD_CHANGE_VALUE_ITEM,
    payload: _dashboard.data,
    meta:
    {
      resource: 'dashboard',
    }
  })
}
export const onSubmit = (type) => (dispatch, getState) => {
  let { dashboard, group, project } = getState().core.resources;
  switch (type) {
    case DASHBROAD_DIALOG_TYPE_CREATE_GROUP:
      {
        let ancestors = [];
        let parent = getDataObject('data.group_id', dashboard);

        if (parent) {
          let address = getDataObject('data.group_data.address', dashboard) || [];
          ancestors = address.filter(item => item.id !== 'all').map(item => item.id)
        } else {
          parent = null;
        }
        dispatch(crudCreate('group', {
          "ancestors": ancestors,
          "name": getDataObject('data.groupNameEditing', dashboard),
          "parent": parent
        },
          {
            onSuccess: ({ result }) => {
              dispatch(crudGetList('group', {}, {
                onSuccess: () => ({})
              }));
              dispatch(hideDialog())
            }
          }
        ))
      }
      break;
    case DASHBROAD_DIALOG_TYPE_EDIT_GROUP:
      {
        let ancestors = [];

        let groupId = getDataObject('data.group_id', dashboard);
        dispatch(crudUpdate('group', {
          "id": groupId,
          "name": getDataObject('data.groupNameEditing', dashboard),
        }))
        dispatch(hideDialog())
      }
      break;
    case DASHBROAD_DIALOG_TYPE_EDIT_PROJECT:
      {
        let data = getDataObject('data', dashboard);
        dispatch(crudUpdate('project', {
          "id": data.project_id,
          "data": data.edit,
        },
          {

            onSuccess: ({ result }) => {
              setTimeout(
                () => {
                  dispatch(changeProject(data.project_id))
                }, 100
              )
              return {
                notification: {
                  body: 'dgs.notification.update_successfully'
                }
              }
            }
          }))
        dispatch(hideDialog())
      }
      break;
    case DASHBROAD_DIALOG_TYPE_CREATE_PROJECT:
      {
        let data = getDataObject('data', dashboard);
        let body = { ...data.add_project, active: true }
        dispatch(crudCreate('project', {
          "data": body,
        }))
        dispatch(hideDialog())
      }
      break;
    default:
      break;
  }
}

export const showDialogConfirm = (dialog) => ({
  type: DASHBROAD_CHANGE_VALUE_ITEM,
  payload: {
    dialogConfirm: dialog
  },
  meta:
  {
    resource: 'dashboard',
  }
})

export const checkProjectEdit = (project, dashboard) => {
  return (dashboard.data.edit && !isEqual(getDataObject('data.edit.name,customer,group_id,group_name,priority,folder,active,project_managers,designers,qc_admins', dashboard),
    getDataObject('name,customer,group_id,group_name,priority,folder,active,project_managers,designers,qc_admins', project)))
}

export const onSubmitConfirm = (dialog) => (dispatch) => {

  const { projectTo, groupTo, groupData } = dialog;
  if (projectTo) {
    dispatch(changeProject(projectTo))
  } else {
    dispatch(changeGroup(groupTo, groupData))
  }
  dispatch(onCancelConfirm())
}
export const onCancelConfirm = (param) => ({
  type: DASHBROAD_CHANGE_VALUE_ITEM,
  payload: {
    dialogConfirm: {
      show: false,
      type: '',
      projectTo: ''
    }
  },
  meta:
  {
    resource: 'dashboard',
  }
})

export const toggerSiderbar = (show) => ({
  type: DASHBROAD_CHANGE_VALUE_ITEM,
  payload: {
    showGroup: show
  },
  meta:
  {
    resource: 'dashboard',
  }
})

export const onClickFunc = (func, project) => (dispatch) => {
  dispatch(push(`/${func.form_uri}`))
}

  // ({
  //   type: DASHBROAD_CHANGE_VALUE_ITEM,
  //   payload: (typeof name === 'string' ? { [name]: value } : name),
  //   meta:
  //   {
  //     resource: 'dashboard',
  //   }
  // })


  // ({
  //   type: DASHBROAD_CHANGE_VALUE_ITEM,
  //   payload: (typeof name === 'string' ? { [name]: value } : name),
  //   meta:
  //   {
  //     resource: 'dashboard',
  //   }
  // })


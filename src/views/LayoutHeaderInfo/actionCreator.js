import axios from 'axios';
import { isArray,isEqual } from 'lodash'
import {
  API_ENDPOINT,
  // ROUTE_CONFIGURATION,
  // ROUTE_TRAINING,
  // ROUTE_PRODUCTION,
  // ROUTE_PRODUCTION_ADMIN,
  // ROUTE_PROJECTS,
  // ROUTE_GROUPS
} from '../../constants';

import {
  HEADER_INFO_SET_TITLE,
  HEADER_INFO_RESET_STATE,
  HEADER_INFO_SET_DOC_INFO
} from './actions';
// import { getProjectById } from '../../resources/creators/project_item';

export const getHeaderTitle = (username, pathname) => async (
  dispatch,
  getState
) => {
  var title = 'PRODUCTION-START',
    subtitle = '';
  // const pathArr = pathname.split('/');
  if(pathname.includes('production')||pathname==='/'){
    title='PRODUCTION-START'
  } else {
    const url = `${API_ENDPOINT}/user/${username}/projects`;
    try{
    const projectAssigneds = await (await axios.get(url)).data;
    if (projectAssigneds && projectAssigneds.length > 0) {
      const uri = pathname;
      var taskInfo;
      projectAssigneds.forEach(item => {
        var tasks_assigned = item.tasks_assigned;
        if (tasks_assigned && tasks_assigned.length > 0) {
          let task_assigned = tasks_assigned.find(task_item =>
            uri.includes(task_item.form_uri)
          );
          if (task_assigned) {
            taskInfo = {
              ...task_assigned,
              id: item.id,
              project_name: item.name
            };
            return false;
          }
        }
      });
      title = taskInfo? taskInfo.project_name:'';
      subtitle = taskInfo? taskInfo.name:'';
    }
  }catch(err){
    console.log(err)
  }
  }
  dispatch({
    type: HEADER_INFO_SET_TITLE,
    title: title,
    subtitle: subtitle
  });
};

export const resetState = () => {
  return { type: HEADER_INFO_RESET_STATE };
};

export const setDocInfo = (
  docInfo = { batch_name: '', doc_name: '', doc_uri: '' }
) => (dispatch, getState) => {
  const { doc_info } = getState().layout_header_information;
  if (!isEqual(doc_info, docInfo)) {
    if (!docInfo.doc_name && docInfo.doc_uri) {
      var doc_uri=isArray(docInfo.doc_uri)?docInfo.doc_uri[0]:docInfo.doc_uri
      let docUriArr = doc_uri.split('/');
      let docName = docUriArr[docUriArr.length - 1].split('.')[0];
      docInfo.doc_name = docName;
    }
    dispatch({
      type: HEADER_INFO_SET_DOC_INFO,
      doc_info: docInfo
    });
  }
};

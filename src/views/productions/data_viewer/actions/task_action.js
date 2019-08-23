import axios from 'axios';

import {
  parseFieldsToFieldname,
  transformTasksToDataViewer,
  transformTaskToDataUpdate
} from './task_utility';
import {
  completeCall,
  errorCall
} from '../../../../components/common/ajax/call_ajax/actions/call_ajax_action';
import {differenceBy} from 'lodash'

import {
  DATA_VIEWER_REQUEST_TASK,
  DATA_VIEWER_RECIEVE_TASKS,
  DATA_VIEWER_RECIEVE_TASKS_ERROR
} from '../constants/data_viewer_constant';
import { BPMN_PROCESS_KEY } from '../../../../constants/previous';
import { APP_NAME, BPMN_ENDPOINT, API_ENDPOINT } from '../../../../constants';

const callAPIGetTask = (projectId, taskDef, batchId, username, maxResult) => {
  return axios.patch(
    `${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/process-definition/key/${BPMN_PROCESS_KEY}/tasks/key/${taskDef}/claim?maxResult=50&filteringBy=batch_id,eq,${batchId}`,
    {
      user_name: username
    }
  );
};

const callAPISaveTasks = (request,projectId) => {
  return axios.patch(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/tasks/complete`, request);
};

const callAPIUpdateReworkDetail = (projectId, request) => {
  return axios.post(`${API_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/rework-doc-details`, request);
};

const getTasks = (params, username, batch) => async (dispatch, getState) => {
  dispatch({
    type: DATA_VIEWER_REQUEST_TASK
  });
  try {
    let response = await (await callAPIGetTask(
      params.projectId,
      params.taskKeyDef,
      batch.batch_id,
      username,
      batch.count
    )).data;
    if (!Array.isArray(response)) {
      response = [response];
    }
    const tasks = transformTasksToDataViewer(
      response,
      params.action === 'invoice'
      );
    return dispatch({
      type: DATA_VIEWER_RECIEVE_TASKS,
      datas: tasks
    });
  } catch (error) {
    dispatch(errorCall(error.toString()));
    return dispatch({
      type: DATA_VIEWER_RECIEVE_TASKS_ERROR
    });
  }
};

const saveTasks = (
  tasks,
  params,
  username,
  { approve: approveRework, fields, comment, owner }
) => async (dispatch, getState) => {
  if (tasks.length === 0) {
    return;
  }
  dispatch({
    type: DATA_VIEWER_REQUEST_TASK
  });
  const documents = getState().production.data_viewer.documents.datas;
  let mapTaskName ={};
  documents.forEach(item=>{
    mapTaskName[item.task_id]=mapTaskName[item.task_id]?[...mapTaskName[item.task_id],{taskname:item.taskname,taskdata:item.taskdata }]:[{taskname:item.taskname,taskdata:item.taskdata }];
  })
  tasks.forEach(item=>{
    item.tasks = mapTaskName[item.task_id]
  })
  try {
    let { request, data_update } = transformTaskToDataUpdate(
      tasks,
      approveRework,
      parseFieldsToFieldname(fields),
      username,
      comment,
      params,
      owner
    );
    await callAPISaveTasks(request, params.projectId);
    dispatch(completeCall('Saved'));
    const batch_selected = getState().production.data_viewer.batches
      .batch_selected;
    if (approveRework) {
      await callAPIUpdateReworkDetail(params.projectId, data_update);
      let data_tasks = getState().production.data_viewer.documents.datas
      let new_data = differenceBy(data_tasks , tasks , 'id')
      if(new_data.length > 0){
        return dispatch(getTasks(params, username, batch_selected));
      }
      return dispatch({
        type : DATA_VIEWER_RECIEVE_TASKS,
        datas: new_data
      })
    }else{
      return dispatch(getTasks(params, username, batch_selected));
    }
  } catch (error) {
    dispatch({
      type : DATA_VIEWER_RECIEVE_TASKS_ERROR,
    })
    return dispatch(errorCall(error.toString()));
  }
};

export { getTasks, saveTasks };

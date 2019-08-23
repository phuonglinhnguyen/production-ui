import * as types from '../constants/project_guide_view_contant';
import clone from 'clone'
import axios from 'axios';
import { sortBy, orderBy as orderByFn, isEqual, isArray } from 'lodash'
import { API_ENDPOINT, BPMN_ENDPOINT, APP_NAME } from '../../../constants';
import { getDataObject } from '@dgtx/coreui';
import { showNotification } from '@dgtx/coreui'
import convertData from './project_guide_view_convert_data';
//#region 
export function pending() {
    return {
        type: types.PENDING,
        payload: {
            successProjectGuideView: false,
            pendingProjectGuideView: true,
            errorProjectGuideView: false,
        }
    };
}

export function error() {
    return {
        type: types.ERROR,
        payload: {
            successProjectGuideView: false,
            pendingProjectGuideView: false,
            errorProjectGuideView: true
        }
    };
}

export function success() {
    return {
        type: types.SUCCESS,
        payload: {
            successProjectGuideView: true,
            pendingProjectGuideView: false,
            errorProjectGuideView: false,
        }
    };
}



export function resetState() {
    return {
        type: types.RESET,
        payload: {
            successProjectGuideView: false,
            pendingProjectGuideView: false,
            errorProjectGuideView: false,
        }
    };
}

export function resetAllState() {
    return {
        type: types.RESET_ALL
    };
}
//#endregion

const getData = async (projectId) => {
    try {
        let res = await axios(`${API_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/project-guides`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        return res;
    } catch (error) {
        return error;
    }
}

export const getProjectGuides = (projectId) => async (dispatch, getState) => {
    dispatch(resetState());
    dispatch(pending());
    dispatch({
        type: types.PROJECT_GUIDE_VIEW_GET_DATA,
        payload: {
            data: []
        }
    });
    let datas = await getData(projectId);
    if (datas.message || datas.status !== 200) {
        dispatch(error());
        if (datas.message) {
            // dispatch(showNotification(datas.message, 'error', { i18n: true, duration: 2500 }))
            console.log("ERROR: ",datas.message)
        }
        else {
            // dispatch(showNotification('Get data project guide error!', 'error', { i18n: true, duration: 2500 }))
        }
    }
    else {
        if (datas.data) {
            dispatch({
                type: types.PROJECT_GUIDE_VIEW_GET_DATA,
                payload: {
                    data: datas.data
                }
            });
            dispatch(success());
        }
    }
};

function _html5Saver(blob, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    document.body.removeChild(a);
}

function _saveBlob(response, fileName) {
    if (navigator.msSaveBlob) {
        //OK for IE10+
        navigator.msSaveBlob(response, fileName);
    }
    else {
        _html5Saver(response, fileName);
    }
}

function downloadFile(url, fileName) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            var percentComplete = (event.loaded / event.total) * 100;
            //yourShowProgressFunction(percentComplete);
        }
    };

    xhr.onload = function (event) {
        if (this.status == 200) {
            _saveBlob(this.response, fileName);
        }
        else {
            //yourErrorFunction()
        }
    };

    xhr.onerror = function (event) {
        //yourErrorFunction()
    };

    xhr.send();
}

export const download = (projectId, item) => (dispatch, getState) => {
    try {
        downloadFile(item.s3Url, item.fileName)
    } catch (error) {
        dispatch(showNotification([`Download file ${item.fileName} error!', 'error`], { i18n: true, duration: 2500 }))
    };
}
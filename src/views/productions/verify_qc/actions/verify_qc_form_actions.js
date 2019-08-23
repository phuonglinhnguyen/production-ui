import axios from 'axios';
import {
    API_ENDPOINT,

    TASK_COMPARISON_OPERATOR_EQ,
    TASK_KEY_VARIABLES_VALUE_DOC,
    TASK_KEY_VARIABLES_VALUE_QC_EXECUTION_CONFIG,
    TASK_KEY_ID,
    TASK_KEY_NAME,
    TASK_KEY_TASK_DEFINITION_KEY,

} from '../../../../constants';

import * as constants from '../constants';
import _ from 'lodash'
import {
    handleExtractData,
    openRespondSnackbar
} from '../../../../common/snackbars/actions/common_action'
import {
    validationReset
} from '../../../../common/field_validation/actions/field_validation_action'

import { task_utils } from '../../../../utils/common'


const requestTasks = () => ({ type: constants.VERIFY_QC_REQUEST_TASK_DATA });


const claimMultiTask = (processKey: String,
    taskDefId: String,
    maxResult: Number,
    groupBy: String,
    filterKey: String,
    filterOperator: String,
    filterValue: String,
    sortingBy: String,
    userName: String) => {
    return axios.patch(
        `${API_ENDPOINT}/workflow/tasks/${processKey}/${taskDefId}/claim?maxResult=${maxResult}&groupBy=${groupBy}&filteringBy=${filterKey},${filterOperator},${filterValue}&sortingBy=${sortingBy}`,
        { user_name: userName }
    )
        .then(handleExtractData)
        .then(res => {
            return _.isArray(res) ? res : [res];
        })
        .catch(error => {
            console.log(error)
            throw new Error(error)
        });

}

const getDataOfDocs = async (projectId, docIds, dataNodeName) => {

    return axios.get(`${API_ENDPOINT}/projects/${projectId}/documents?ids=${docIds}&attributes=records.${dataNodeName}&position=last`)
        .then(handleExtractData)
        .then(res => {
            return _.isArray(res) ? res : [res];
        })
        .catch(error => {
            console.log(error)
            throw new Error(error)
        });
}
const getDocInFosFromTasks = (tasks) => {
    if (tasks && tasks.length > 0) {
        var doc_infos = [];
        tasks.forEach(function (task_item) {

            const doc = task_utils.getTaskInputDataAtrribute(task_item, TASK_KEY_VARIABLES_VALUE_DOC);
            doc_infos.push(
                doc
            );
        }, this);
        return doc_infos;

    }
}

const filterDocsByRecordIndex = (datas, doc_infos) => {

    for (var data of datas) {
        let foundDocInfo = doc_infos.find(item => item.id === data.id);

        if (data.records && foundDocInfo &&
            foundDocInfo[constants.QC_KEY_WORKFLOW_DATA_RECORD_INDEXS] &&
            foundDocInfo[constants.QC_KEY_WORKFLOW_DATA_RECORD_INDEXS].length > 0) {
            data.records = data.records.filter((record, index) => {
                var recordIndex = foundDocInfo[constants.QC_KEY_WORKFLOW_DATA_RECORD_INDEXS].find(item => item === index);
                if (recordIndex) {
                    record[constants.QC_KEY_INPUT_RECORD_INDEX] = recordIndex;
                    return true;
                }
                return false;
            })

        }
    }

}

const parseReceivedDatas = (datas, username, doc_infos) => {
    var input_datas = [];
  
    if (datas) {
        datas.forEach(function (data) {
            const { records, id } = data;
            if (records) {

                records.forEach(function (item, index) {
                    const keyed_datas = item.keyed_data;
                    var input_data = {};
                    if (keyed_datas && keyed_datas.length > 0) {
                        for (var keyed_data of keyed_datas) {
                            input_data = {
                                ...input_data,
                                ...keyed_data,
                                doc_id: id || doc_infos[0].id,
                                [constants.QC_KEY_INPUT_RECORD_INDEX]: item[constants.QC_KEY_INPUT_RECORD_INDEX]
                            };
                        }
                    }


                    input_datas.push(input_data);

                }, this);
            }
        }, this);

        return {
            input_datas: input_datas,

        }

    }

}

export const getTask = (projectId,
    taskKeyDef,
    maxResult,
    layoutName,
    username) => async (dispatch, getState) => {
        try {
            const { is_fetching_tasks } = getState().production.qc.qc_multiple.qc_form;
            if (!is_fetching_tasks) {
                const processKey = `qc_${projectId}`;

                dispatch(requestTasks())
                let receivedTasks = await claimMultiTask(
                    processKey,
                    taskKeyDef,
                    maxResult,
                    constants.VERIFY_QC_KEY_LAYOUT_NAME,
                    constants.VERIFY_QC_KEY_LAYOUT_NAME,
                    TASK_COMPARISON_OPERATOR_EQ,
                    layoutName,
                    constants.VERIFY_QC_KEY_LAYOUT_NAME,
                    username);
                if (receivedTasks && receivedTasks.length > 0) {
                    const doc_infos = getDocInFosFromTasks(receivedTasks);
                    if (doc_infos && doc_infos.length > 0) {
                      
                        var doc_ids = []
                        for (var info of doc_infos) {
                            doc_ids.push(info.id);
                        }
                        const receivedDocs = await getDataOfDocs(projectId, doc_ids, 'keyed_data');

                        const qc_data = parseReceivedDatas(receivedDocs, username, doc_infos);

                        if (qc_data) {

                            dispatch({
                                type: constants.VERIFY_QC_RECEIVE_TASK_DATA,
                                input_records: qc_data.input_datas,
                                // output_records: qc_data.output_datas,
                                display_records: _.cloneDeep(qc_data.input_datas),
                                qc_tasks: receivedTasks,
                                docs: receivedDocs,
                                task: receivedTasks[0]
                            })
                            dispatch(setImageInfo());

                        }
                    }
                } else {
                    dispatch({
                        type: constants.QC_RECEIVE_MULTIPLE_TASK,
                        input_records: [],

                        display_records: [],
                        qc_tasks: [],

                    })
                    dispatch(openRespondSnackbar("There is no task left", false))

                }
            }
        } catch (error) {
            console.log(error)
            dispatch({
                type: constants.QC_RECEIVE_MULTIPLE_TASK,
                input_records: [],

                display_records: [],
                qc_tasks: [],

            })
            dispatch(openRespondSnackbar(error, true))

        }
    }

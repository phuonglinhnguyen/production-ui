import { findIndex, pickBy } from 'lodash';
import { guid } from "../../../../@components/vaidationWorker";

const getDocInfoFromTaskData = variables => {
  let docInfo = variables.filter(_v => _v.name === 'input_data')[0] || {};
  let keyData = variables.filter(_v => _v.name === 'keyed_data')[0] || {};
  let value = pickBy(keyData.value, _d => _d && _d.completed);
  return {
    docInfo: docInfo.value,
    keyData: value
  };
};

// const transformDocInvoiceToDataViewer = (doc, doc_info = {}) => {
//   let record_result = [];
//   try {
//     for (const taskname in doc) {
//       let username = doc[taskname].user;
//       let reworked = doc[taskname].rework_comment ? 'true' : 'false';
//       // let layout_name = taskname.split(' ')[1];
//       if (!doc[taskname].key_datas) {
//         continue;
//       }
//       const data = doc[taskname].key_datas[0].records;
//       for (const record_index in data) {
//         const record_data = data[record_index].keyed_data; // array
//         let field_data = {};
//         let section_name = ""
//         for (const key_section in record_data) {
//           const section_data = record_data[key_section].data;
//           if (!section_name) {
//             section_name += record_data[key_section].section || ' ';
//           } else {
//             section_name += '`' +record_data[key_section].section || ' ';
//           }
//           for (const key_item in section_data) {
//             const section_item = section_data[key_item];
//             for (const field_name in section_item) {
//               const field_value = section_item[field_name];
//               let field_data_value = field_data[field_name] || '';
//               if (!field_data_value) {
//                 field_data_value += field_value.text || ' ';
//               } else {
//                 field_data_value += '`' + field_value.text || ' ';
//               }
//               field_data[field_name] = field_data_value;
//             }
//           }
//         }
//         field_data.username = username;
//         record_result = [
//           ...record_result,
//           {
//             ...doc_info,
//             table_id: doc_info.id,
//             taskname: taskname.split(' ')[2],
//             type: taskname.split(' ')[1],
//             taskdata: doc[taskname],
//             layout_name: taskname.split(' ')[0],
//             section: section_name,
//             record_index: parseInt(record_index, 10) + 1,
//             reworked: reworked,
//             ...field_data
//           }
//         ];
//       }
//     }
//     return record_result;
//   } catch (error) {
//     return record_result;
//   }
// };

const transformDocInvoiceToDataViewer = (doc, doc_info = {}) => {
  let record_result = [];
  try {
    for (const taskname in doc) {
      let username = doc[taskname].user;
      let reworked = doc[taskname].rework_comment ? 'true' : 'false';
      // let layout_name = taskname.split(' ')[1];
      if (!doc[taskname].key_datas) {
        continue;
      }
      const data = doc[taskname].key_datas;
      for (const record_index in data) {
        const record_data = data[record_index]; // array
        let field_data = {};
        let section_name = ""
        for (const key_section in record_data) {
          const section_data = record_data[key_section].data;
          if (!section_name) {
            section_name += record_data[key_section].section || ' ';
          } else {
            section_name += '`' + record_data[key_section].section || ' ';
          }
          for (const key_item in section_data) {
            const section_item = section_data[key_item];
            for (const field_name in section_item) {
              const field_value = section_item[field_name];
              let field_data_value = field_data[field_name] || '';
              if (!field_data_value) {
                field_data_value += field_value.text || ' ';
              } else {
                field_data_value += '`' + field_value.text || ' ';
              }
              field_data[field_name] = field_data_value;
            }
          }
        }

        field_data.username = username;
        record_result = [
          ...record_result,
          {
            ...doc_info,
            table_id: doc_info.id,
            taskname: taskname.split(' ').pop(),
            type: taskname.split(' ')[1],
            taskdata: doc[taskname],
            layout_name: taskname.split(' ')[0],
            section: section_name,
            record_index: parseInt(record_index, 10) + 1,
            reworked: reworked,
            ...field_data
          }
        ];
      }
    }
    return record_result;
  } catch (error) {
    return record_result;
  }
};

const transformDocKeyingToDataViewer = (doc, doc_info = {}) => {
  let record_result = [];
  try {
    for (const taskname in doc) {
      let username = doc[taskname].user;
      let reworked = doc[taskname].rework_comment ? 'true' : 'false';
      if (!doc[taskname].key_datas) {
        continue;
      }
      const data = doc[taskname].key_datas[0].records;
      for (const record_index in data) {
        const record_data = data[record_index].keyed_data;
        let field_data = {};
        const data_item = record_data.data;
        for (const field_name in data_item[0]) {
          const field_value = data_item[0][field_name];
          field_data[field_name] = field_value.text;
        }
        field_data.username = username;
        record_result = [
          ...record_result,
          {
            ...doc_info,
            table_id: `${doc_info.id}-${taskname.split(' ')[1]}`,
            taskname: taskname.split(' ').pop(),
            taskdata: doc[taskname],
            layout_name: taskname.split(' ')[0],
            section: taskname.split(' ')[1],
            record_index: parseInt(record_index, 10) + 1,
            reworked: reworked,
            ...field_data
          }
        ];
      }
    }
    return record_result;
  } catch (error) {
    return record_result;
  }
};

const transformTasksToDataViewer = (tasks, invoice) => {
  let datas = [];
  for (const key in tasks) {
    const task = tasks[key];
    let { keyData, docInfo } = getDocInfoFromTaskData(task.variables);
    let doc_uri = [];
    for (const key in docInfo.doc_uri) {
      const a = docInfo.doc_uri[key];
      doc_uri.push(a.substring(a.lastIndexOf('/') + 1, a.length));
    }
    const info = {
      table_id: `${docInfo.id}`,
      pid: '',
      id: docInfo.id,
      task_id: task.id,
      s2_url: docInfo.s2_url,
      layout_name: docInfo.layout_name,
      doc_uri: doc_uri,
      doc_name: doc_uri.join('|'),
      batch_name: docInfo.batch_name,
      created: task.created
    };
    if (Object.keys(keyData).length === 0) {
      datas.push(info);
      continue;
    }
    let data = [];
    data = transformDocInvoiceToDataViewer(keyData, info);
    // if (invoice) {
    // } else {
    //   data = transformDocKeyingToDataViewer(keyData, info);
    // }
    datas = [...datas, ...data];
  }
  return datas;
};

const transformTaskToDataUpdate = (
  tasks,
  approveRework,
  fields,
  username,
  comment,
  params,
  owner
) => {
  let request = [];
  let data_update = [];
  for (const key in tasks) {
    const task = tasks[key];
    let taskdata = task.taskdata;
    const request_index = findIndex(
      request,
      _r => _r.id === task.task_id && _r.taskname === task.taskname
    );
    const task_update = {
      owner: owner,
      keyer: task.username,
      layout: task.layout_name,
      section: task.section,
      task_id: task.task_id,
      task_def: task.taskname ? task.taskname.replace('_output_data', '') : ''
    };
    if (request_index > -1) {
      let item = request[request_index];
      if (Object.keys(item.output_data).indexOf(task.taskname) > -1) {
        continue;
      }
      item.output_data[task.taskname] = {
        value: {
          ...taskdata,
          comment: '',
          type: "view_keyed_data",
          hold_count: 0,
          rework: approveRework,
          rework_fields: fields,
          rework_comment: comment,
          user: owner ? task.username : null,
          completed: !approveRework
        }
      };
      let data_item = data_update[request_index];
      let task_details = data_item.task_details || [];
      task_details.push(task_update);
      data_update[request_index] = {
        ...data_item,
        task_details: task_details
      };
      request[request_index] = item;
      continue;
    }
    data_update = [
      ...data_update,
      {
        doc_id: task.id,
        doc_name: task.doc_uri,
        user_approve: username,
        fields: fields,
        comment: comment,
        task_details: [task_update]
      }
    ];
    let group_id = `${guid()}-${Date.now()}`;

    let new_request = {
      id: task.task_id,
      taskname: task.taskname,
      output_data: {
        [`${params.taskKeyDef}_output_data`]: {
          value: {
            type: "view_keyed_data",
            group_id,
            rework: approveRework,
            rework_fields: fields,
            comment: comment
          }
        }
      }
    };
    if (task.tasks) {
      task.tasks.forEach(item => {
        new_request.output_data[item.taskname] = {
          value: {
            ...item.taskdata,
            type: "view_keyed_data",
            comment: '',
            hold_count: 0,
            rework: approveRework,
            rework_fields: fields,
            rework_comment: comment,
            user: owner ? task.username : null,
            completed: !approveRework
          }
        };
      })

    }
    request = [...request, new_request];
  }
  return { request, data_update };
};

const parseFieldsToFieldname = fields => {
  let results = [];
  for (const key in fields) {
    const field = fields[key];
    results = [...results, field.name];
  }
  return results;
};

export {
  transformTasksToDataViewer,
  transformTaskToDataUpdate,
  parseFieldsToFieldname
};

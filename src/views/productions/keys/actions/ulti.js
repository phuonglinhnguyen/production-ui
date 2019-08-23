import { TASK_ID, TASK_DEF_KEY } from '../constants';
export const parseListField = (fields, map, title) => {
  let rs = [];
  fields.forEach(field => {
    if (field.field_id && map[field.field_id]) {
      let _field = map[field.field_id];
      rs.push({
        ..._field,
        title: titleField(_field, title) || '',
        position: field.position
      });
    }
  });
  return rs;
};
export const titleField = (field, title) => {
  let hasOwn = {}.hasOwnProperty;
  let titleType = typeof title;
  if (titleType === 'string') {
    if (hasOwn.call(field, title) && field[title] && field[title].length > 0) {
      return field[title];
    }
  } else if (Array.isArray(title) && title.length > 0) {
    for (let i = 0; i < title.length; i++) {
      let _title = title[i];
      let rstitle = titleField(field, _title);
      if (rstitle) {
        return rstitle;
      }
    }
  }
  return;
};
export const getDatasKeying = (records, sectionName, fields, userName, task, source, location, reason) => {
  let result = records.map(_data => {
    let _rs = { keyer: userName, section: sectionName, source, ip: location, reason: reason ? reason.value : null, data: [] };
    _rs[TASK_ID] = task.id;
    _rs[TASK_DEF_KEY] = task.taskDefinitionKey;
    let _data_value = {};
    fields.forEach(_field => {
      _data_value[_field.name] = {
        text: _data[_field.name] || '',
        words: []
      };
    });
    _rs.data.push(_data_value)
    return { keyed_data: _rs };
  });
  return { records: result };
}
export const getDatasKeyingTraining = (records, sectionName, fields, userName, task,source,location , reason) => {
  let result = records.map(_data => {
    let _rs = { keyer: userName, section: sectionName, source ,ip:location, reason:reason?reason.value:null};
    _rs[TASK_ID] = task.id;
    _rs[TASK_DEF_KEY] = task.taskDefinitionKey;
    fields.forEach(_field => {
      _rs[_field.name] = _data[_field.name] || '';
    });
    return { keyed_data: _rs };
  });
  return { records: result };
}
export const getRecordBySectionLastest = (records, sectionName, userName) => {
  let _rs = records && records.map(record => {
    if (record.keyed_data) {
      if (Array.isArray(record.keyed_data)) {
        let res = record.keyed_data.filter(_data => {
          return _data.section === sectionName && _data.keyer === userName;
        });
        return res.pop() || {};
      } else {
        let _rec = {};
        let refacter_data = {};
        if (Array.isArray(record.keyed_data.data)) {
          _rec = Object.assign({}, record.keyed_data.data[0]);
          let data_tmp_look;
          Object.keys(_rec).forEach(key_name => {
            data_tmp_look = _rec[key_name];
            if (typeof data_tmp_look === 'object' && typeof (data_tmp_look['text']) !== 'undefined') {
              refacter_data[key_name] = data_tmp_look.text || '';
            } else {
              refacter_data[key_name] = data_tmp_look;
            }
          })
        }
        return refacter_data;
      }
    } else {
      return {};
    }
  });
  return _rs || [];
}

export const getCompleteReason = (reason) => {
  try {
    return Object.keys(reason).map(key => {
      let result = {}
      reason[key].split(',').forEach(data => {
        let datas = data.split(':');
        result[datas[0].trim()] = datas[1].trim()
      })
      return {
        value: key,
        label: result.title,
        comment: result.comment === "true"
      }
    })
  } catch (e) {
    return [];
  }
}
// export const getCompleteReason = (reason) => {
//   try {
//     let _reasons = reason.split(';');
//     return _reasons.map(_reason => {
//       let tmp = _reason.split(':');
//       return { label: tmp[0], value: tmp[1] }
//     })
//   } catch (e) {
//     return [];
//   }
// }
export const getDataStore = ({ tranform, datas }) => {
  let result = {}
  datas.forEach((item, index) => {
    result[`records.${index}.keyed_data`] = [item.keyed_data, tranform[index].keyed_data];
  })
  return result;
}
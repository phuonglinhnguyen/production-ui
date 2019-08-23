import axios from 'axios';
import moment from 'moment';
import { findIndex } from 'lodash';
import { I18n } from 'react-redux-i18n';

import {
  DATA_VIEWER_RECIEVE_LAYOUTS,
  DATA_VIEWER_REQUEST_LAYOUTS
} from '../constants/data_viewer_constant';

import {
  KEY_FIELD_DISPLAY,
  KEY_FIELD_NAME
} from '../../../../constants/field_constants';
import { APP_NAME } from '../../../../constants';


const callAPIGetLayouts = project_id => {
  return axios.get(
    `apps/${APP_NAME}/projects/${project_id}/section-definitions?layout_name=all&attributes=position`
  );
};

const checkCalling = getState => {
  return getState.production.data_viewer.layouts.is_calling;
};

const getHeaderInfo = header => {
  let result = [];
  for (const key in header) {
    const element = header[key];
    if (!element) {
      continue;
    }
    result = [
      ...result,
      {
        resizable: true,
        accessor: element,
        Header: I18n.t(`productions.data_viewer.${element}`),
        minWidth: 200,
        style: { textAlign: 'left' },
        filterMethod: (filter, row) => {
          let arraykeysearch = filter.value.split(',').map(item => item.trim());
          let keys = arraykeysearch.filter(item => { return item !== '' });
          for (let key of keys) {
            if (row[filter.id] && row[filter.id].toString().toLowerCase().includes(key.toLowerCase()))
            {
              return true;
            }
          }
          
          return false;
        },
      }
    ];
  }
  return result;
};
const getAccessor=(keys)=>(data)=>{
  let result ='';
  for (let index = 0; index < keys.length; index++) {
    let key = keys[index];
    result = data[key]||result;
  }
  return result;
}

const getFields = (sections,invoice_type) => {
  let fields = [];
  let headers = getHeaderInfo([
    'id',
    'doc_name',
    invoice_type ? 'type' : '',
    'batch_name',
    'layout_name',
    'record_index',
    'section',
    'username',
    'reworked'
  ]);
  headers.push({
    accessor: data =>
      data.created
        ? moment.parseZone(data.created)
        .local()
        .format('YYYY/MM/DD HH:mm')
        : '',
    id: 'created',
    Header: I18n.t(`productions.data_viewer.date`),
    minWidth: 200
  });
  for (const section_index in sections) {
    const section = sections[section_index];
    for (const key in section.fields) {
      const field = section.fields[key];
      const field_index = findIndex(fields, _f => _f.name === field.name);
      if (field_index === -1) {
        fields = [
          ...fields,
          {
            name: field[KEY_FIELD_NAME],
            id: field._id
          }
        ];
        /**@description merge header by header's title uquite one on field_title */
        let fieldExisted = headers.filter(item=> item.Header===field[KEY_FIELD_DISPLAY])[0]
        if(fieldExisted){
          if(typeof fieldExisted.accessor === 'function'&&!fieldExisted.accessors.includes(field[KEY_FIELD_NAME])){
            fieldExisted.accessors.push(field[KEY_FIELD_NAME])
            fieldExisted.accessor = getAccessor(fieldExisted.accessors)
          }else if(fieldExisted.accessor!==field[KEY_FIELD_NAME]){
            fieldExisted.accessors=[fieldExisted.accessor,field[KEY_FIELD_NAME]]
            fieldExisted.accessor = getAccessor(fieldExisted.accessors)
          }
        }else{
          headers = [
            ...headers,
            {
              accessor: field[KEY_FIELD_NAME],
              Header: field[KEY_FIELD_DISPLAY],
              minWidth: 200, 
              style : {textAlign : 'left'}
            }
          ];
        }
        
      }
    }
  }
  headers.forEach((item,index)=>{item.id =index})
  return { fields, headers };
};

const getLayouts = project_id => async (dispatch, getState) => {
  if (checkCalling(getState())) {
    return;
  }
  dispatch({
    type: DATA_VIEWER_REQUEST_LAYOUTS
  });
  try {
    const response = await callAPIGetLayouts(project_id);
    const layouts = response.data;
    const { fields, headers } = getFields(layouts);
    dispatch({
      type: DATA_VIEWER_RECIEVE_LAYOUTS,
      datas: layouts,
      header: headers,
      fields: fields
    });
  } catch (error) {
    dispatch({
      type: DATA_VIEWER_RECIEVE_LAYOUTS,
      datas: [],
      header: [],
      fields: []
    });
  }
};

export { getLayouts };

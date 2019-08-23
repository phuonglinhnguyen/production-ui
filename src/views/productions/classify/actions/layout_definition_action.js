import axios from "axios";
import {
  CLASSIFY_RESET_STATE_LAYOUT_DEFINITION,
  CLASSIFY_SET_TEXT_SEARCH_LAYOUT_DEFINITIONS,
  CLASSIFY_REQUEST_LAYOUT_DEFINITIONS,
  CLASSIFY_RESPONSE_LAYOUT_DEFINITIONS,
  CLASSIFY_ERROR_LAYOUT_DEFINITIONS
} from "../constants/classify_constants";
import { APP_NAME } from "../../../../constants";

export const resetStateLayoutDefinitions = value => ({
  type: CLASSIFY_RESET_STATE_LAYOUT_DEFINITION
});

export const setTextSearch = value => ({
  type: CLASSIFY_SET_TEXT_SEARCH_LAYOUT_DEFINITIONS,
  text_search: value
});

export const filterLayoutDefinitions = (
  _text_search,
  datas = []
) => dispatch => {
  let new_list = [];

  let text_search = _text_search.toLowerCase();

  datas.forEach(data => {
    let new_data = { ...data };
    new_data.hidden = !data.name.toLowerCase().includes(text_search);

    new_list.push(new_data);
  });

  return dispatch({
    type: CLASSIFY_RESPONSE_LAYOUT_DEFINITIONS,
    datas: new_list
  });
};

export const getLayoutDefinitions = projectId => dispatch => {
  dispatch({ type: CLASSIFY_REQUEST_LAYOUT_DEFINITIONS });

  return axios
    .get(`apps/${APP_NAME}/projects/${projectId}/layout-definitions?includes=name,hot_key`)
    .then(function(response) {
      dispatch({
        type: CLASSIFY_RESPONSE_LAYOUT_DEFINITIONS,
        datas: response.data
      });
    })
    .catch(function(error) {
      return dispatch({ type: CLASSIFY_ERROR_LAYOUT_DEFINITIONS });
    });
};

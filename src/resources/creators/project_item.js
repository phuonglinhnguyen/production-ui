import axios from "axios";
import { crudGetOne } from "@dgtx/coreui";
// import { API_ENDPOINT, TIME_OUT_SHOW_MESSAGE } from '../../constants'
import { PROJECT_ITEM_RECEIVE_DATA, PROJECT_ITEM_REQUEST_DATA } from '../actions/project_item'
import { APP_NAME } from "../../constants";
export const handleExtractData = response => {

  if (response) return response.data;
};

export const requestProject = () => ({
  type: PROJECT_ITEM_REQUEST_DATA
});
export const receiveProject = (data, is_error) => {
  return {
    type: PROJECT_ITEM_RECEIVE_DATA,
    project: data,
    is_error: is_error
  };
};


export const getProjectById = id => (dispatch, getState) => {
  if (getState().project.project_item.is_fetching) {
    return;
  }
  dispatch(requestProject());
  dispatch(crudGetOne("project", { id }, {
    onSuccess: ({ result }) => {
      dispatch(receiveProject(result.json, false));
    },
    onFailure:({ result })=>{
      dispatch(receiveProject({}, true));
    }
  }))
};
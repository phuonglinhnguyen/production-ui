import clone from 'clone';
import { SectionsTypes } from '../actions/sections_action';
import { REWORK_BATCH_RESET } from '../constants/action_types';

const initialState = {
  data: {}
}

export default function (state = clone(initialState), action) {
  switch (action.type) {
    case SectionsTypes.RECEIVE:
      let data = clone(state.data)
      data[action.projectId] = action.items
      return {
        data
      };
    case SectionsTypes.RESET:
    case REWORK_BATCH_RESET:
      return clone(initialState);
    default:
      return state;
  }
}

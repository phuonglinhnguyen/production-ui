import {
  CLOSE_DIALOG,
  OPEN_DIALOG,
  DID_VALIDATION,
  FETCHING_DATA,
  RECIEVE_DATA
} from '../types'
import clone from 'clone'
const initialState = {
  show: false,
  isFetching: false,
  did_validation: false,
  items:[] ,

}
export default (state = clone(initialState), action) => {
  switch (action.type) {
    case CLOSE_DIALOG:
      return clone(initialState);
    case OPEN_DIALOG:
      return {
        ...state,
        isFetching:true,
        show: true,
      }
    case FETCHING_DATA: {
      return {
        ...state,
        isFetching: true,
        did_validation: false,
      }
    }
    case RECIEVE_DATA: {
      return {
        ...state,
        isFetching: false,
        items: action.payload,
      }
    }
    case DID_VALIDATION: {
      return {
        ...state,
        did_validation: true,
        isFetching: false,
      }
    }
    default:
      return state
  }
}

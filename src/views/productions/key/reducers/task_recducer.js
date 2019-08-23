import { TaskTypes, RESET_ALL } from '../types';
import clone from 'clone';
const initialState = {
    referData: !1,
    didInvalidate: 0,
    isFetching: !1,
    isPatching: !1,
    patchFailed: !1,
    patchSuccess: !1,
    record: {},
    dataTranform:{}, 
    isSaveDocSuccess:false, 
    task_complete_data:{}, 
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TaskTypes.FETCHING:
            return {
                ...state,
                isFetching: !0,
                claim: undefined,
                claimInvalidate: undefined,
            };
        case TaskTypes.SAVE_DOC_SUCESS:
            return {
                ...state,
                isSaveDocSuccess: true, 
                dataKeying: action.dataKeying,
                dataTranform:action.dataTranform, 
            };
        case TaskTypes.DID_INVALIDATION:
            return {
                ...state,
                didInvalidate: state.didInvalidate + 1,
                isFetching: false,
            };
        case TaskTypes.CLAIM_DID_INVALIDATION:
            {
                return {
                    ...state,
                    claim: !0,
                    access: !1,
                    didInvalidate: state.didInvalidate + 1,
                    claimInvalidate: action.payload,
                    isFetching: !1,
                }
            }
        case TaskTypes.CLAIM_RECEIVE:
            {
                return {
                    ...clone(initialState), 
                    referData: !1,
                    access: !0,
                    claim: !0,
                    item: action.data,
                    record: action.data.record || {},
                    didInvalidate: 0,
                    isFetching: !1,
                }
            }
        case TaskTypes.RECEIVE:
            return {
                ...state,
                isPatching: !1, 
                patchFailed: !1, 
                patchSuccess: !1, 
                record_select_waiting: -1, 
                dataTranform:{}, 
                isSaveDocSuccess:false, 
                task_complete_data:{}, 
                referData: !1,
                access: action.payload.access,
                claim: !1,
                item: action.payload.data,
                canClaim: action.payload.canClaim,
                record: action.payload.data.record || {},
                didInvalidate: 0,
                isFetching: !1,
            };

        case TaskTypes.REFER_DATA: {
            let _record = clone(state.record);
            _record = Object.assign({}, _record, action.referData);
            return {
                ...state,
                referData: !0,
                record: _record
            }
        }
        case TaskTypes.CHANGE_FIELD:
            let _record = clone(state.record);
            _record[action.fieldName] = action.value;
            return {
                ...state,
                record: _record
            };
        case TaskTypes.PATCHING:
            return {
                ...state,
                isPatching: true,
            };
        case TaskTypes.SAVE_DOC_FAILED:
            return {
                ...state,
                isPatching: false,
                patchFailed: false,
            }
        case TaskTypes.PATCH_FAILED:
            return {
                ...state,
                patchFailed: true,
                task_complete_data:action.info, 
                isPatching: false,
            };
        case TaskTypes.PATCH_SUCESS:
            return {
                ...state,
                item: action.item,
                isPatching: false,
                patchSuccess: true,
            };
        case RESET_ALL:
        case TaskTypes.RESET:
            return initialState;
        default:
            return state;
    }
}

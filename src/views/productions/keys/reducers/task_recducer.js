import {
    TaskTypes,
    RESET_ALL
} from '../types';
import clone from 'clone';
const initialState = {
    referData: !1,
    didInvalidate: 0,
    isFetching: !1,
    isPatching: !1,
    patchFailed: !1,
    patchSuccess: !1,
    record_selecting: 0,
    record_select_waiting: -1,
    isSaveDocSuccess:false,
    record: {},
    records: [{}],
    recordsChecked:[],
    recordsCheckedData:[],
    dataTranform:{},
    task_complete_data:{},
    mask:{}
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
        case TaskTypes.SELECT_RECORD:
        let recordsCheckedNew = clone(state.recordsChecked);
            if(recordsCheckedNew.indexOf(action.index)<0){
                recordsCheckedNew.push(action.index)
            }
            return {
                ...state,
                record_select_waiting:-1,
                record_selecting: action.index,
                recordsChecked:recordsCheckedNew
            };
        case TaskTypes.INIT_RECORD:
            let recordsNew = clone(state.records);
            for (let i = 0; i < action.num; i++) {
                recordsNew.push({})
            }
            return {
                ...state,
                records: recordsNew,
                recordsCheckedData:clone(recordsNew),
            };
        case TaskTypes.SAVE_DOC_SUCESS:
            return {
                ...state,
                isSaveDocSuccess: true,
                dataTranform:action.dataTranform,
                dataKeying: action.dataKeying,
            };
        case TaskTypes.DID_INVALIDATION:
            return {
                ...state,
                didInvalidate: state.didInvalidate + 1,
                isFetching: false,
            };
        case TaskTypes.NEXT_RECORD_WAITING:
            return {
                ...state,
                record_select_waiting:action.indexNext
            }    
            
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
                    record_selecting:0,
                    recordsChecked:[0],
                    referData: !1,
                    access: !0,
                    claim: !0,
                    item: action.data,
                    records: action.data.records,
                    recordsCheckedData:clone(action.data.records),
                    didInvalidate: 0,
                    isFetching: !1,
                }
            }
        case TaskTypes.UPDATE_RECORD:{
            {
                let recordsCheckedData = clone(state.recordsCheckedData);
                recordsCheckedData[action.indexRecord] ={...recordsCheckedData[action.indexRecord],...state.records[action.indexRecord]};
                return {
                    ...state,
                    recordsCheckedData:recordsCheckedData,
                }
            } 
        }   
        case TaskTypes.INSERT_RECORD:{
            let recordsCheckedData = clone(state.recordsCheckedData);
            let records = clone(state.records);
            recordsCheckedData.splice(action.index+1,0,{})
            records.splice(action.index+1,0,{})
            let recordsChecked = state.recordsChecked.filter(item=>item!==action.index +1)
            return {
                ...state,
                records,
                recordsCheckedData,
                recordsChecked,
            }
        }
        case TaskTypes.REMOVE_RECORD:{
            let recordsCheckedData = clone(state.recordsCheckedData);
            let records = clone(state.records);
            recordsCheckedData.splice(action.index,1)
            records.splice(action.index,1)
            let record_selecting = action.index;
            if(action.index === state.recordsCheckedData.length-1){
                record_selecting = action.index - 1
            }
            let recordsChecked = state.recordsChecked.filter(item=>item!==action.index)
            return {
                ...state,
                records,
                recordsCheckedData,
                record_selecting,
                recordsChecked,
            }
        }
        case TaskTypes.INSERTING_RECORD:{
            break;
        }
        case TaskTypes.CHANGE_MASK:{
            let mask = clone(state.mask);
            mask[action.name]= action.value;
            return {
                ...state,
                mask
            }
        }
        case TaskTypes.RECEIVE:
            return {
                ...state,
                isPatching: !1,
                patchFailed: !1,
                patchSuccess: !1,
                record: {},
                record_select_waiting: -1,
                dataTranform:{},
                isSaveDocSuccess:false,
                task_complete_data:{},
                record_selecting:0,
                recordsChecked:[0],
                referData: !1,
                access: action.payload.access,
                claim: !1,
                item: action.payload.data,
                canClaim: action.payload.canClaim,
                records: action.payload.data.records || [{}],
                recordsCheckedData:clone(action.payload.data.records),
                didInvalidate: 0,
                isFetching: !1,
            };

        case TaskTypes.REFER_DATA:
            {
                let _record = clone(state.record);
                _record = Object.assign({}, _record, action.referData);
                return {
                    ...state,
                    referData: !0,
                    record: _record
                }
            }
        case TaskTypes.CHANGE_FIELD:
            let _records = clone(state.records);
            _records[state.record_selecting][action.fieldName] = action.value;
            return {
                ...state,
                records: _records
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
            
        case TaskTypes.SWITCHING_RECORD:
        {
            let index =state.record_selecting;
            let recordsNew = clone(state.records);
            let indexSwitch ;
            let dataCurrent = clone(state.records[index]);
            let dataSwitch ;
            if(action.isUp){
                indexSwitch =index-1
                indexSwitch =indexSwitch>=0?indexSwitch:recordsNew.length-1;
                dataSwitch = clone(state.records[indexSwitch]);
            } else {
                indexSwitch =index+1
                indexSwitch =indexSwitch<=recordsNew.length-1?indexSwitch:0
                dataSwitch = clone(state.records[indexSwitch]);
            }
            recordsNew[index]=dataSwitch;
            recordsNew[indexSwitch]=dataCurrent;
            return {
                ...state,
                records:recordsNew,
                recordsCheckedData:clone(recordsNew),
                record_selecting:indexSwitch
            }
        }    
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
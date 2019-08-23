import {
    LOADED_DATA_FORM,
    CHANGE_IS_NEXT,
    CLEAR_DATA_FORM,
    SHOW_COMMENT_SAVE,
    HIDE_COMMENT_SAVE,
    CHANGE_COMMENT_SAVE,
    TASK_PATCHING,
    TASK_TRY_PATCH,
    CANCEL_TASK_TRY_PATCH,
    TASK_PATCH_FAILURED,
    SET_LOADING_FORM,
} from '../actions/formActions'
// import { data_ocr } from './data_ocr'
import { transFormData } from '../../../../utils'

const initialState = {
    ready: false,
    setting: {
        isNext: true,
    },
    patching: false,
    loading: false,
    // images: [{
    //     image_uri: 'http://localhost:3000/img/POC-2018-11-12-08-09-48-2-0005.jpg',
    //     data_ocr: { pages: transFormData(data_ocr.ocr_results) }
    // }]
}

export default {
    name: 'form_state',
    reducer: (state = initialState, { type, payload, meta }) => {
        switch (type) {
            case SET_LOADING_FORM: {
                return {
                    ...state,
                    loading: payload
                }
            }
            case LOADED_DATA_FORM:
                return {
                    ...state,
                    task: payload,
                    ready: true
                }
            case CHANGE_IS_NEXT: {

                return {
                    ...state,
                    setting:{
                        ...state.setting,
                        isNext: payload.isNext
                    }
                }
            }
            case CLEAR_DATA_FORM: {
                return {
                    setting: state.setting,
                    ready: false,
                    patching: false,
                    loading: false,
                }
            }

            case SHOW_COMMENT_SAVE: {
                return {
                    ...state,
                    optionSave: payload.option
                }
            }
            case HIDE_COMMENT_SAVE: {
                const { optionSave, ...nextState } = state;
                return nextState
            }
            case CHANGE_COMMENT_SAVE: {
                const { optionSave, ...nextState } = state;

                return {
                    ...nextState,
                    optionSave: { ...optionSave, comment_text: payload.value }
                }
            }
            case TASK_PATCHING: {
                return {
                    ...state,
                    patching: true
                }
            }
            case TASK_PATCH_FAILURED: {
                return {
                    ...state,
                    patching: false,
                }
            }
            case TASK_TRY_PATCH: {
                return {
                    ...state,
                    patching: false,
                    dataPatch: payload
                }
            }
            case CANCEL_TASK_TRY_PATCH: {
                return {
                    ...state,
                    patching: false,
                    optionSave: null,
                    dataPatch: null,
                }
            }
            default:
                return state
        }
    }
}
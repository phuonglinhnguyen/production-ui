import * as types from '../utils/qc_constants';


const initialState = {
    is_fetching_tasks: false,
    input_records: [],
    output_records: {},
    display_records: [],
    docs: [],
    qc_tasks: [],
    is_saving: false,
    count_save_error:0


};

const qc_form = (state = initialState, action) => {
    switch (action.type) {

        case types.QC_REQUEST_MULTIPLE_TASK:
            return {
                ...state,
                is_fetching_tasks: true

            };
        case types.QC_RECEIVE_MULTIPLE_TASK:
            return {
                ...state,
                is_fetching_tasks: false,
                input_records: action.input_records,
                // output_records: {},
                display_records: action.display_records,
                qc_tasks: action.qc_tasks,
                docs: action.docs

            };

        case types.QC_FORM_MODIFY_DATA:
           
            return {
                ...state,
                output_records: action.output_records,
                display_records: action.display_records,
              
            }
        case types.QC_RECORD_UPDATE_ERRORS:
            return {
                ...state,
                output_records: action.output_records,

            };
        case types.QC_SAVING_MULTIPLE_TASK:
            return {
                ...state,
                is_saving: true

            };
        case types.QC_SAVED_SUCCESS_MULTIPLE_TASK:
            return {
                ...state,
                is_saving: false,
                input_records: [],
                output_records: {},
                display_records: [],
                docs: [],
                qc_tasks: []

            };
        case types.QC_SAVED_ERROR_MULTIPLE_TASK:
            return {
                ...state,
                is_saving: false,
                count_save_error:state.count_save_error+1

            };
        case types.QC_MULTIPLE_FORM_RESET_STATE:
            return {
                ...initialState

            };
        default:
            return state;
    }
};
export default qc_form;

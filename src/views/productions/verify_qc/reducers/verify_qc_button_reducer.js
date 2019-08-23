import * as types from '../constants';


const initialState = {
    next_task: false

};

const verify_qc_button = (state = initialState, action) => {
    switch (action.type) {
        case types.VERIFY_QC_MULTIPLE_UPDATE_NEXT_TASK:
            return {
                ...state,
                next_task: !state.next_task

            };
        case types.VERIFY_QC_MULTIPLE_BUTTON_RESET_STATE:
            return {
                ...initialState

            };

        default:
            return state;
    }
};
export default verify_qc_button;

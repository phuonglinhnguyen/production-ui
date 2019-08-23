import * as types from '../constants';


const initialState = {
    imageUrl: null,
    rectangle: null,
    line: null,
    section: null

};

const verify_qc_image = (state = initialState, action) => {
    switch (action.type) {
        case types.VERIFY_QC_MULTIPLE_IMAGE_SET_DATA:
            return {
                ...state,
                imageUrl: action.imageUrl,
                rectangle: action.rectangle,
                line: action.line,
                section: action.section

            };
        case types.VERIFY_QC_MULTIPLE_IMAGE_RESET_STATE:
            return {
                ...initialState

            };

        default:
            return state;
    }
};
export default verify_qc_image;

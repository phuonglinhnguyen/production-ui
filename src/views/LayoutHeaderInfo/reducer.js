import * as constants from './actions';


const initialState = {
    title: '',
    subtitle: '',
    doc_info: { batch_name: '', doc_name: '', doc_uri: '' }


};
const layout_header_information = (state = initialState, action) => {
    switch (action.type) {
        case constants.HEADER_INFO_SET_TITLE:
            return {
                ...state,

                title: action.title,
                subtitle: action.subtitle,
                doc_info: initialState.doc_info

            };
        case constants.HEADER_INFO_SET_DOC_INFO:
            return {
                ...state,
                doc_info: action.doc_info
            };
        case constants.HEADER_INFO_RESET_STATE:
            return {
                ...initialState,
            };
        default:
            return state;
    }
};
export default layout_header_information;

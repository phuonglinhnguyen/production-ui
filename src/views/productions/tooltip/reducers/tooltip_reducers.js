import * as constants from '../constant/tooltip_constants'

const initialState = {
    text: '',
    anchorEl: null,
    open: false
};
const field_tooltip = (state = initialState, action) => {
    switch (action.type) {
        case constants.TOOLTIP_OPEN:
            return {
                ...state,
                text: action.text,
                anchorEl: action.anchorEl,
                open: true
            };
        case constants.TOOLTIP_CLOSE:
            return {
                ...state,
                open: false,
                text: '',
             

            };

        default:
            return state;
    }
};

export default field_tooltip;

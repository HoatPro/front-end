import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading : true,
    list: []
};

export const toolCgnatHistory = (state = defaultState, action) => {
    

    switch (action.type) {
        case actionTypes.GET_HISTORY_TOOL_CGNAT_SUCCESS:
            const value = action.value;
            return {
                ...state,
                list: value,
                pageLoading: false
            };
        default:
            return state;
    }
};


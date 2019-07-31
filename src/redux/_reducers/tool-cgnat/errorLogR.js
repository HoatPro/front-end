import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading : true,
    list: []
};

export const toolCgnatErrorLog = (state = defaultState, action) => {
    

    switch (action.type) {
        case actionTypes.GET_ERROR_LOG_TOOL_CGNAT_SUCCESS:
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


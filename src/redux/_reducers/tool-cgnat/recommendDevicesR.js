import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading : true,
    list: []
};

export const toolCgnatRecommendDevices = (state = defaultState, action) => {
    

    switch (action.type) {
        case actionTypes.GET_RECOMMEND_DEVICES_TOOL_CGNAT_SUCCESS:
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


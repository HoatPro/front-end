import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading : true,
    list: null,
};

export const groupMPParts = (state = defaultState, action) => {
    const value = action.value;

    switch (action.type) {
        case actionTypes.GET_ALL_GROUP_MP_PARTS_SUCCESS:
            return {
                ...state,
                parts: value.data,
                pageLoading: false
            };
        default:
            return state;
    }
};


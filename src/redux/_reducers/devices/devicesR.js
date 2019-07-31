import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading : true,
    list: [],
};

export const netDevices = (state = defaultState, action) => {
    const value = action.value;

    switch (action.type) {
        case actionTypes.GET_ONLINE_NET_DEVICES_SUCCESS:
            return {
                ...state,
                list: value,
                pageLoading: false
            };
        default:
            return state;
    }
};


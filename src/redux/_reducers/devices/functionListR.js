import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading : true,
    list: [],
    status: false
};

export const netDeviceFunctions = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.GET_NET_DEVICE_FUNCTIONS_SUCCESS:
            return {
                ...state,
                list: action.value,
                pageLoading: false,
                status: false
            };
        case actionTypes.CREATE_NET_DEVICE_FUNCTION_SUCCESS:
        case actionTypes.EDIT_NET_DEVICE_FUNCTION_SUCCESS:
        case actionTypes.DELETE_NET_DEVICE_FUNCTION_SUCCESS:
            return {
                ...state,
                status: action.status
            }
        default:
            return state;
    }
};


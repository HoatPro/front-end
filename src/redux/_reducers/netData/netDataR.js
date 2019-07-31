import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    netDeviceFunctions: [],
    netAreas: [],
};

export const netData = (state = defaultState, action) => {
    const value = action.value;

    switch (action.type) {
        case actionTypes.GET_NET_DEVICE_FUNCTIONS_SUCCESS:
            return {
                ...state,
                netDeviceFunctions: value
            };
        case actionTypes.GET_NET_AREAS_SUCCESS:
            return {
                ...state,
                netAreas: value
            };
        case actionTypes.GET_NET_DEVICE_FUNCTIONS_AND_AREAS_SUCCESS:
            return {
                ...state,
                netDeviceFunctions: value.functions,
                netAreas: value.areas
            };
        default:
            return state;
    }
};
import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading: true,
    listData: [],
    logs: [],
    logDate: new Date()
};

export const addNewDevicePageData = (state = defaultState, action) => {
    let pagination, value, data, name, current, validate, error, list, groups, temp;

    switch (action.type) {
        case actionTypes.GET_ADD_DEVICE_TO_OPSVIEW_LOGS_SUCCESS:
            value = action.value;

            return {
                ...state,
                logs : value.logs,
                pageLoading: false,
                logDate: value.logDate
            };
        default:
            return state;
    }
};

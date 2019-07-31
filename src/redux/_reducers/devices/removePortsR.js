import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading: true,
    logs: [],
    logDate: new Date()
};

export const removePortsPageData = (state = defaultState, action) => {
    let value;

    switch (action.type) {
        case actionTypes.GET_REMOVE_PORTS_FROM_OPSVIEW_LOGS_SUCCESS:
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

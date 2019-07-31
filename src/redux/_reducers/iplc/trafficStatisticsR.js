import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading: true,
    listData: [],
    date: new Date(),
    timeList: [],
    selectedTime: null,
    trafficStatistics: []
};

export const iplcTrafficStatistics = (state = defaultState, action) => {
    let value;

    switch (action.type) {
        case actionTypes.GET_IPLC_TRAFFIC_ON_TIME:
            value = action.value;

            return {
                ...state,
                pageLoading: false,
                listData: value.trafficData,
                selectedTime: value.selectedTime,
            };
        case actionTypes.GET_IPLC_TRAFFIC_TIME_ONDATE_SUCCESS: {
            value = action.value;

            return {
                ...state,
                pageLoading: false,
                date: value.date,
                listData: value.trafficData,
                selectedTime: value.selectedTime,
                maxTrafficTime: value.maxTrafficTime,
                timeList: value.timeList
            };
        }

        case actionTypes.GET_IPLC_TRAFFIC_TIME_ONDATE_FAILED: {
            value = action.value;

            return {
                ...state,
                pageLoading: false,
                date: value.date,
                listData: [],
                selectedTime: null,
                maxTrafficTime: null,
                timeList: []
            };
        }
        default:
            return state;
    }
};

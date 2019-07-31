import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    premiumData: [],
    generalData: [],
    pageLoading: false
};

export const iplcTrafficChart = (state = defaultState, action) => {
    
    switch (action.type) {
        case actionTypes.GET_IPLC_TRAFFIC_CHART_ON_RANGE_SUCCESS:
            return {
                ...state,
                premiumData: action.value.premium,
                generalData: action.value.general,
                pageLoading: false
            }
        case actionTypes.GET_IPLC_TRAFFIC_CHART_ON_RANGE_FAILED:
            return {
                ...state,
                pageLoading: false
            }
        case actionTypes.GET_IPLC_TRAFFIC_CHART_ON_RANGE:
            return {
                ...state,
                premiumData: [],
                generalData: [],
                pageLoading: true
            }
        default:
            return state;
    }
};


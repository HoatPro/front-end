import actionTypes from '../../_constants/actionTypes';

const defaultState = {
    allTimeInday: [],
    detailInfoIrbData: [],
    dataLogSummaryIrbForGraph: [],
    dataLogDetailIrbForGraph: [],
    logDate: new Date(),
    logDateGraphFrom: new Date(),
    logDateGraphTo: new Date(),
};

export const autoBalancingTransitPeering = (state = defaultState, action) => {
    const value = action.value;
    switch (action.type) {
        case actionTypes.GET_ALL_TIME_IN_DAY:
            return {
                ...state,
                allTimeInDay: value.data,
                logDate: value.date
            };
        case actionTypes.GET_DETAIL_INFO_IRB_DATA:
            return {
                ...state,
                detailInfoIrbData: value.data,
            };
        case actionTypes.GET_LOG_SUMMARY_IRB_FOR_GRAPH_DATA:
            return {
                ...state,
                dataLogSummaryIrbForGraph: value.data,
            };
        case actionTypes.GET_LOG_DETAIL_IRB_FOR_GRAPH_DATA:
            return {
                ...state,
                dataLogDetailIrbForGraph: value.data,
            };
        default:
            return state;
    }
};

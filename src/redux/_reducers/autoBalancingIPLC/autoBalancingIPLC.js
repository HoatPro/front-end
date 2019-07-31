import actionTypes from '../../_constants/actionTypes';

const defaultState = {
    ipv6ToMpopData: [],
    equalReportData: [],
    iplcReportData: [],
    equalMpopByGwDataIpv6: [],
    iplcMpopByGwDataIpv6: [],
    equalMpopByGwDataIpv4: [],
    iplcMpopByGwDataIpv4: [],
    logDate: new Date()
};

export const autoBalancingIPLC = (state = defaultState, action) => {
    const value = action.value;
    console.log(action);
    switch (action.type) {
        case actionTypes.GET_IPV6_TO_MPOP_DATA:
            return {
                ...state,
                ipv6ToMpopData: value.data
            };
        case actionTypes.GET_EQUAL_REPORT_DATA:
            return {
                ...state,
                equalReportData: value.data
            };
        case actionTypes.GET_IPLC_REPORT_DATA:
            return {
                ...state,
                iplcReportData: value.data
            };
        case actionTypes.GET_IPLC_MPOP_BY_GW_IPV6:
            return {
                ...state,
                iplcMpopByGwDataIpv6: value.data
            };
        case actionTypes.GET_EQUAL_MPOP_BY_GW_IPV6:
            return {
                ...state,
                equalMpopByGwDataIpv6: value.data
            };
        case actionTypes.GET_IPLC_MPOP_BY_GW_IPV4:
            return {
                ...state,
                iplcMpopByGwDataIpv4: value.data
            };
        case actionTypes.GET_EQUAL_MPOP_BY_GW_IPV4:
            return {
                ...state,
                equalMpopByGwDataIpv4: value.data
            };
        default:
            return state;
    }
};

import actionTypes from '../../_constants/actionTypes';
import appConstants from '../../../../src/constants/app';
import _ from "lodash";

const defaultState = {
    pageLoading: true,
    allGroupMpDetail: [],
    planContent: [],
    increasingPercent: appConstants.defaultIncreasingPercent
};

export const groupMPSummary = (state = defaultState, action) => {
    const value = action.value;

    switch (action.type) {
        case actionTypes.GET_GROUP_MP_SUMMARY_SUCCESS:
            return {
                ...state,
                pageLoading: false,
                allGroupMpDetail: value.allGroupMpDetail,
                planContent: value.planContent,
                date: value.date,
                increasingPercent: value.increasingPercent
            };
        case actionTypes.SAVE_PLAN_SUCCESS:

            console.log('state change: ', value);

            return {
                ...state,
                planContent: value,
            };
        default:
            return state;
    }
};

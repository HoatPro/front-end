import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";
import appConstants from "../../../constants/app";

const defaultState = {
    pageLoading: true,
    listData: [],
    increasingPercent: appConstants.defaultCgnatIncreasingPercent,
    date: new Date()
};

export const cgnatSummary = (state = defaultState, action) => {
    let value, data;

    switch (action.type) {
        case actionTypes.GET_CGNAT_SUMMARY_SUCCESS:
            value = action.value;
            //pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                listData: data,
                pageLoading: false,
                date: value.date,
                increasingPercent : value.increasingPercent
            };

        case actionTypes.SAVE_CGNAT_PLAN_SUCCESS: {
            value = action.value;

            return {
                ...state,
                listData: value,
            };

        }

        default:
            return state;
    }
};

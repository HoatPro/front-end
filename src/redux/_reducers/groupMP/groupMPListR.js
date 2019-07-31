import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading: true,
    listData: [],
};

export const groupMPList = (state = defaultState, action) => {
    let pagination, value, data, name, current, validate, error, list, groups, temp;

    switch (action.type) {
        case actionTypes.GET_GROUP_MP_LIST_SUCCESS:
            value = action.value;
            pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                pagination: pagination,
                listData: data,
                current: {},
                loading: 0,
                pageLoading: false,
            };
        default:
            return state;
    }
};

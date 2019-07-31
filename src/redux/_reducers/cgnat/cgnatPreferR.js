import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading: true,
    listData: [],
};

export const cgnatPrefer = (state = defaultState, action) => {
    let value, data;

    switch (action.type) {
        case actionTypes.GET_CGNAT_FREFER_SUCCESS:
            value = action.value;
            //pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                listData: data,
                pageLoading: false,
            };
        default:
            return state;
    }
};

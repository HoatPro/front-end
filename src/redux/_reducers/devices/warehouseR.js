import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading : true,
    list: [],
    status: false
};

export const warehouse = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.GET_WAREHOUSES_SUCCESS:
            return {
                ...state,
                list: action.value,
                pageLoading: false,
                status: false
            };
        case actionTypes.CREATE_WAREHOUSE_SUCCESS:
        case actionTypes.EDIT_WAREHOUSE_SUCCESS:
        case actionTypes.DELETE_WAREHOUSE_SUCCESS:
            return {
                ...state,
                status: action.status
            }
        default:
            return state;
    }
};


import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

const defaultState = {
    pageLoading : true,
    listArea: [],
    listRoom: [],
    status: false,
    selectedArea: null,
    listWarehouse: []
};

export const netAreasAndRooms = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.GET_NET_AREAS_SUCCESS:
            return {
                ...state,
                listArea: action.value,
                pageLoading: false,
                status: false
            };
        case actionTypes.GET_NET_ROOMS_SUCCESS:
            return {
                ...state,
                listRoom: action.value,
                pageLoading: false,
                status: false,
                selectedArea: action.area
            }
        case actionTypes.CREATE_NET_AREA_SUCCESS:
        case actionTypes.CREATE_NET_ROOM_SUCCESS:
        case actionTypes.EDIT_NET_AREA_SUCCESS:
        case actionTypes.EDIT_NET_ROOM_SUCCESS:
        case actionTypes.DELETE_NET_AREA_SUCCESS:
        case actionTypes.DELETE_NET_ROOM_SUCCESS:
            return {
                ...state,
                status: action.status
            }
        case actionTypes.GET_WAREHOUSES_SUCCESS:
            return {
                ...state,
                listWarehouse: action.value
            }
        default:
            return state;
    }
};


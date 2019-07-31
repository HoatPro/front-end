import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

export const groupMPTopos = (state = {}, action) => {
    let value = action.value;
    switch (action.type) {
        case actionTypes.GET_ALL_GROUP_MP_NAMES_SUCCESS:
            return {
                ...state,
                groupMpNames: {
                    list: value.data.listName,
                    search: null,
                    searchLoading: false,
                    selected: null,
                    loading: false
                },
                groupMPDetail: {
                    list: [],
                    display : false
                }
            };

        case actionTypes.GET_DETAIL_GROUP_MP_REQUEST:{
            return {
                ...state,
                groupMpNames: {
                    ...state.groupMpNames,
                    searchLoading: true,
                },
                groupMPDetail: {
                    ...state.groupMPDetail,
                    display: false
                }
            }
        }

        case actionTypes.GET_DETAIL_GROUP_MP_SUCCESS:{
            return {
                ...state,
                groupMpNames: {
                    ...state.groupMpNames,
                    selected: value.name,
                    searchLoading: false,
                },
                groupMPDetail: {
                    ...state.groupMPDetail,
                    display: true,
                    list: value.list
                }
            }
        }
        default:
            return state;
    }
};


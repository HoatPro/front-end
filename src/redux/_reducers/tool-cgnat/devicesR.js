import actionTypes from "../../_constants/actionTypes";
import _ from "lodash";

const defaultState = {
  pageLoading: true,
  list: [],
  status: false
};

export const toolCgnatDevices = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.GET_TOOL_CGNAT_DEVICE_SUCCESS:
      return {
        ...state,
        list: action.value,
        pageLoading: false,
        status: false
      };
    case actionTypes.CREATE_TOOL_CGNAT_DEVICE_SUCCESS:
    case actionTypes.EDIT_TOOL_CGNAT_DEVICE_SUCCESS:
    case actionTypes.DELETE_TOOL_CGNAT_DEVICE_SUCCESS:
    case actionTypes.CHANGE_STATUS_TOOL_CGNAT_SUCCESS:
    case actionTypes.SET_SCHEDULE_TOOL_CGNAT_SUCCESS:
      return {
        ...state,
        status: action.status
      };
    default:
      return state;
  }
};

import actionTypes from "../../_constants/actionTypes";
import _ from "lodash";

const defaultState = {
  pageLoading: true,
  list: [],
  status: false
};

export const toolCgnatVariablesConfig = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.GET_TOOL_CGNAT_VARIABLES_CONFIG_SUCCESS:
      return {
        ...state,
        list: action.value,
        pageLoading: false,
        status: false
      };
    case actionTypes.EDIT_TOOL_CGNAT_VARIABLES_CONFIG_SUCCESS:
      return {
        ...state,
        status: action.status
      };
    default:
      return state;
  }
};

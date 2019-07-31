import actionTypes from "../../_constants/actionTypes";
import axios from "../axios_base";
import { toast } from "react-toastify";
import * as api from "../../../utils/toolCgnatApi";

export { getVariablesConfig, editVariablesConfig };

function getVariablesConfig() {

  return async dispatch => {
    try {
      const res = await api.getVariablesConfig();
      const resBody = res.data;
      if (res.status == 200 && res.data.status == 200) {
        toast.success("Get Tool Cgnat variables config successfully!");
        dispatch(success(resBody.data));
      } else {
        toast.error("Get Tool Cgnat variables config failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Get Tool Cgnat variables config failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.GET_TOOL_CGNAT_VARIABLES_CONFIG_SUCCESS,
      value: data
    };
  }
}

function editVariablesConfig(variable) {

  return async dispatch => {
    try {
      const res = await api.editVariablesConfig(variable);
      const resBody = res.data;
      if (res.status == 200 && resBody.status == 200 && resBody.data.affectedRows) {
        toast.success("Edit Tool Cgnat variables config successfully!");
        dispatch(success(resBody.data.changedRows));
      } else {
        toast.error("Edit Tool Cgnat variables config failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Edit Tool Cgnat variables config failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.EDIT_TOOL_CGNAT_VARIABLES_CONFIG_SUCCESS,
      status: data
    };
  }
}

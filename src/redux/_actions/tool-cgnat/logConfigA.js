import actionTypes from "../../_constants/actionTypes";
import axios from "../axios_base";
import * as api from "../../../utils/toolCgnatApi";
import { alertA } from "../alertA";
import { toast } from "react-toastify";

export { getLogConfig, createLogConfig, editLogConfig, deleteLogConfig };

function getLogConfig() {

  return async dispatch => {
    try {
      const res = await api.getLogConfig();
      const resBody = res.data;
      if (res.status == 200 && resBody.status == 200) {
        toast.success("Get Tool Cgnat log config successfully!");
        dispatch(success(resBody.data));
      } else {
        toast.error("Get Tool Cgnat log config failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Get Tool Cgnat log config failure!");
    }
  };

  function success(data) {
    return { type: actionTypes.GET_TOOL_CGNAT_LOG_CONFIG_SUCCESS, value: data };
  }
}

function createLogConfig(message, type, times) {

  return async dispatch => {
    try {
      const res = await api.createLogConfig(message, type, times);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Create Tool Cgnat log config successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Create Tool Cgnat log config failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Create Tool Cgnat log config failure!");
    }
  };
  function success(data) {
    return {
      type: actionTypes.CREATE_TOOL_CGNAT_LOG_CONFIG_SUCCESS,
      status: data
    };
  }
}

function editLogConfig(message, type, times, id) {

  return async dispatch => {
    try {
      const res = await api.editLogConfig(message, type, times, id);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Edit Tool Cgnat log config successfully!");
        dispatch(success(resBody.data.changedRows));
      } else {
        toast.error("Edit Tool Cgnat log config failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Edit Tool Cgnat log config failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.EDIT_TOOL_CGNAT_LOG_CONFIG_SUCCESS,
      status: data
    };
  }
}

function deleteLogConfig(id) {

  return async dispatch => {
    try {
      const res = await api.deleteLogConfig(id);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Delete Tool Cgnat log config successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Delete Tool Cgnat log config failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Delete Tool Cgnat log config failure!");
    }
  };
  function success(data) {
    return {
      type: actionTypes.DELETE_TOOL_CGNAT_LOG_CONFIG_SUCCESS,
      status: data
    };
  }
}

import actionTypes from "../../_constants/actionTypes";
import axios from "../axios_base";
import * as api from "../../../utils/api";
import { alertA } from "../alertA";
import { toast } from "react-toastify";

export {
  getNetDeviceFunctions,
  createNetDeviceFunction,
  editNetDeviceFunction,
  deleteNetDeviceFunction
};

function getNetDeviceFunctions(params) {
  return async dispatch => {
    try {
      const devices = await api.getNetFunctions();
      toast.success("Get NET device functions successfully!");
      dispatch(success(devices));
    } catch (e) {
      console.log(e);
      toast.error("Get NET device functions failure!");
    }
  };

  function success(data) {
    return { type: actionTypes.GET_NET_DEVICE_FUNCTIONS_SUCCESS, value: data };
  }
}

function createNetDeviceFunction(...params) {
  const name = params[0];
  const note = params[1];
  return async dispatch => {
    try {
      const res = await api.createNetDeviceFunction(name, note);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Create NET device function successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Create NET device function failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Create NET device function failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.CREATE_NET_DEVICE_FUNCTION_SUCCESS,
      status: data
    };
  }
}

function editNetDeviceFunction(...params) {
  const id = params[0];
  const name = params[1];
  const note = params[2];
  return async dispatch => {
    try {
      const res = await api.editNetDeviceFunction(id, name, note);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Edit NET device function successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Edit NET device function failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Edit NET device function failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.EDIT_NET_DEVICE_FUNCTION_SUCCESS,
      status: data
    };
  }
}

function deleteNetDeviceFunction(params) {
  return async dispatch => {
    try {
      const res = await api.deleteNetDeviceFunction(params);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Delete NET device function successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Delete NET device function failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Delete NET device function failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.DELETE_NET_DEVICE_FUNCTION_SUCCESS,
      status: data
    };
  }
}

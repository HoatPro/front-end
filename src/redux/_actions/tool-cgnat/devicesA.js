import actionTypes from "../../_constants/actionTypes";
import axios from "../axios_base";
import * as api from "../../../utils/toolCgnatApi";
import { alertA } from "../alertA";
import { toast } from "react-toastify";

export {
  getDevices,
  createDevice,
  editDevice,
  deleteDevice,
  changeStatus,
  changeStatusSchedule
};

function getDevices() {
  return async dispatch => {
    try {
      const res = await api.getDevices();
      const resBody = res.data;
      if (res.status == 200 && resBody.status == 200) {
        toast.success("Get Tool Cgnat devices successfully!");
        dispatch(success(resBody.data));
      } else {
        toast.error("Get Tool Cgnat devices failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Get Tool Cgnat devices failure!");
    }
  };

  function success(data) {
    return { type: actionTypes.GET_TOOL_CGNAT_DEVICE_SUCCESS, value: data };
  }
}

function createDevice(name, ip, status) {
  return async dispatch => {
    try {
      const res = await api.createDevice(name, ip, status);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.data.affectedRows &&
        resBody.status === 200
      ) {
        toast.success("Create Tool Cgnat device successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Create Tool Cgnat device failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Create Tool Cgnat device failure!");
    }
  };

  function success(data) {
    return { type: actionTypes.CREATE_TOOL_CGNAT_DEVICE_SUCCESS, status: data };
  }
}

function editDevice(id, name, ip) {
  return async dispatch => {
    try {
      const res = await api.editDevice(id, name, ip);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.data.affectedRows &&
        resBody.status === 200
      ) {
        toast.success("Edit Tool Cgnat device successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Edit Tool Cgnat device failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Edit Tool Cgnat device failure!");
    }
  };

  function success(data) {
    return { type: actionTypes.EDIT_TOOL_CGNAT_DEVICE_SUCCESS, status: data };
  }
}

function deleteDevice(id) {
  return async dispatch => {
    try {
      const res = await api.deleteDevice(id);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.data.affectedRows &&
        resBody.status === 200
      ) {
        toast.success("Delete Tool Cgnat device successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Delete Tool Cgnat device failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Delete Tool Cgnat device failure!");
    }

    function success(data) {
      return {
        type: actionTypes.DELETE_TOOL_CGNAT_DEVICE_SUCCESS,
        status: data
      };
    }
  };
}

function changeStatus(currentStatus, id) {
  return async dispatch => {
    try {
      const res = await api.changeStatus(currentStatus, id);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.changedRows
      ) {
        toast.success("Change status successfully!");
        dispatch(success(resBody.data.changedRows));
      } else {
        toast.error("Change status failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Change status failure!");
    }
  };

  function success(data) {
    return { type: actionTypes.CHANGE_STATUS_TOOL_CGNAT_SUCCESS, status: data };
  }
}

function changeStatusSchedule(from, to, active, id) {
  return async dispatch => {
    try {
      const res = await api.changeStatusSchedule(from, to, active, id);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.changedRows
      ) {
        toast.success("Set schedule successfully!");
        dispatch(success(resBody.data.changedRows));
      } else {
        toast.error("Set schedule failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Set schedule failure!");
    }
  };

  function success(data) {
    return { type: actionTypes.SET_SCHEDULE_TOOL_CGNAT_SUCCESS, status: data };
  }
}

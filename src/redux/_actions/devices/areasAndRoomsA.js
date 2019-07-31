import actionTypes from "../../_constants/actionTypes";
import axios from "../axios_base";
import * as api from "../../../utils/api";
import { alertA } from "../alertA";
import { toast } from "react-toastify";

export {
  getNetAreas,
  getNetRoomsByAreaId,
  createNetArea,
  editNetArea,
  deleteNetArea,
  createNetRoom,
  editNetRoom,
  deleteNetRoom
};

function getNetAreas() {
  return async dispatch => {
    try {
      const areas = await api.getNetAreas();
      toast.success("Get NET Areas successfully!");
      dispatch(success(areas));
    } catch (e) {
      console.log(e);
      toast.error("Get NET Areas failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.GET_NET_AREAS_SUCCESS,
      value: data
    };
  }
}

function getNetRoomsByAreaId(area) {
  return async dispatch => {
    try {
      const rooms = await api.getNetRoomsByAreaId(area.id);
      toast.success("Get NET Rooms successfully!");
      dispatch(success(rooms, area));
    } catch (e) {
      console.log(e);
      toast.error("Get NET Rooms failure!");
    }
  };

  function success(data, area) {
    return {
      type: actionTypes.GET_NET_ROOMS_SUCCESS,
      value: data,
      area: area
    };
  }
}

function createNetArea(name) {
  return async dispatch => {
    try {
      const res = await api.createNetArea(name);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Create NET Area successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Create NET Area failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Create NET Area failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.CREATE_NET_AREA_SUCCESS,
      status: data
    };
  }
}

function editNetArea(id, name) {
  return async dispatch => {
    try {
      const res = await api.editNetArea(name, id);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Edit NET Area successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Edit NET Area failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Edit NET Area failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.EDIT_NET_AREA_SUCCESS,
      status: data
    };
  }
}

function deleteNetArea(id) {
  return async dispatch => {
    try {
      const res = await api.deleteNetArea(id);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Delete NET Area successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Delete NET Area failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Delete NET Area failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.DELETE_NET_AREA_SUCCESS,
      status: data
    };
  }
}

function createNetRoom(name, address, areaId, warehouseId) {
  return async dispatch => {
    try {
      const res = await api.createNetRoom(name, address, areaId, warehouseId);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Create NET Room successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Create NET Room failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Create NET Room failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.CREATE_NET_ROOM_SUCCESS,
      status: data
    };
  }
}

function editNetRoom(id, name, address, warehouseId) {
  return async dispatch => {
    try {
      const res = await api.editNetRoom(name, address, id, warehouseId);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Edit NET Room successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Edit NET Room failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Edit NET Room failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.EDIT_NET_ROOM_SUCCESS,
      status: data
    };
  }
}

function deleteNetRoom(id) {
  return async dispatch => {
    try {
      const res = await api.deleteNetRoom(id);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Delete NET Room successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Delete NET Room failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Delete NET Room failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.DELETE_NET_ROOM_SUCCESS,
      status: data
    };
  }
}

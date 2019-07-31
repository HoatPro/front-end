import actionTypes from "../../_constants/actionTypes";
import axios from "../axios_base";
import * as api from "../../../utils/api";
import { alertA } from "../alertA";
import { toast } from "react-toastify";

export { getWarehouses, createWarehouse, editWarehouse, deleteWarehouse };

function getWarehouses() {
  return async dispatch => {
    try {
      const warehouses = await api.getWarehouses();
      toast.success("Get Warehouses successfully!");
      dispatch(success(warehouses));
    } catch (e) {
      console.log(e);
      toast.error("Get Warehouses failure!");
    }
  };

  function success(data) {
    return { type: actionTypes.GET_WAREHOUSES_SUCCESS, value: data };
  }
}

function createWarehouse(code, name) {
  return async dispatch => {
    try {
      const res = await api.createWarehouse(code, name);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.data.affectedRows &&
        resBody.status === 200
      ) {
        toast.success("Create Warehouse successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Create Warehouse failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Create Warehouse failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.CREATE_WAREHOUSE_SUCCESS,
      status: data
    };
  }
}

function editWarehouse(id, code, name) {
  return async dispatch => {
    try {
      const res = await api.editWarehouse(id, code, name);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.status === 200 &&
        resBody.data.affectedRows
      ) {
        toast.success("Edit Warehouse successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Edit Warehouse failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Edit Warehouse failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.EDIT_WAREHOUSE_SUCCESS,
      status: data
    };
  }
}

function deleteWarehouse(id) {
  return async dispatch => {
    try {
      const res = await api.deleteWarehouse(id);
      const resBody = res.data;
      if (
        res.status === 200 &&
        resBody.data.affectedRows &&
        resBody.status === 200
      ) {
        toast.success("Delete Warehouse successfully!");
        dispatch(success(resBody.data.affectedRows));
      } else {
        toast.error("Delete Warehouse failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Delete Warehouse failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.DELETE_WAREHOUSE_SUCCESS,
      status: data
    };
  }
}

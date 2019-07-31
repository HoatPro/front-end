import actionTypes from "../../_constants/actionTypes";
import axios from "../axios_base";
import { toast } from "react-toastify";
import * as api from "../../../utils/api";

export function getIplcTrafficChartOnRange(payload) {
  return async dispatch => {
    try {
      dispatch(getChart());
      const res = await api.getIplcTrafficChartOnRange(payload);
      toast.success("Get Traffic Chart successfully!");
      dispatch(success(res));
    } catch (e) {
      console.log(e);
      toast.error("Get Traffic Chart failure!");
      dispatch(error());
    }
  };

  function success(data) {
    return {
      type: actionTypes.GET_IPLC_TRAFFIC_CHART_ON_RANGE_SUCCESS,
      value: data
    };
  };

  function error() {
    return { type: actionTypes.GET_IPLC_TRAFFIC_CHART_ON_RANGE_FAILED };
  }

  function getChart() {
    return { type: actionTypes.GET_IPLC_TRAFFIC_CHART_ON_RANGE };
  }
}


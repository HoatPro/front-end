import actionTypes from "../../_constants/actionTypes";
import axios from "../axios_base";
import { toast } from "react-toastify";
import { apiKey } from "../../../utils/config";
import * as api from "../../../utils/toolCgnatApi";
export { getRecommendDevices };

function getRecommendDevices() {

  return async dispatch => {
    try {
      const res = await api.getRecommendDevices();
      const resBody = res.data;
      if (res.status == 200 && res.data.status == 200) {
        toast.success("Get Tool Cgnat recommend devices successfully!");
        dispatch(success(resBody.data));
      } else {
        toast.error("Get Tool Cgnat recommend devices failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Get Tool Cgnat recommend devices failure!");
    }
  };

  function success(data) {
    return {
      type: actionTypes.GET_RECOMMEND_DEVICES_TOOL_CGNAT_SUCCESS,
      value: data
    };
  }
}

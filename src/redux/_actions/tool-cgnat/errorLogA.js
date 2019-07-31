import actionTypes from "../../_constants/actionTypes";
import axios from "../axios_base";
import { toast } from "react-toastify";
import * as api from "../../../utils/toolCgnatApi";
export { getErrorLog };

function getErrorLog() {

  return async dispatch => {
    try {
      const res = await api.getErrorLog();
      const resBody = res.data;
      if (res.status === 200 && res.data.status === 200) {
        toast.success("Get Tool Cgnat error log successfully!");
        dispatch(success(resBody.data));
      }
    } catch (e) {
      console.log(e);
      toast.error("Get Tool Cgnat error log failure!");
    }
  };

  function success(data) {
    return { type: actionTypes.GET_ERROR_LOG_TOOL_CGNAT_SUCCESS, value: data };
  }
}

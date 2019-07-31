import actionTypes from "../../_constants/actionTypes";
import axios from "../axios_base";
import { toast } from "react-toastify";
import { apiKey } from "../../../utils/config";
import * as api from "../../../utils/toolCgnatApi";
export { getHistory };

function getHistory() {

  return async dispatch => {
    try {
      const res = await api.getHistory();
      const resBody = res.data;
      if (res.status == 200 && resBody.status == 200) {
        toast.success("Get Tool Cgnat history successfully!");
        dispatch(success(resBody.data));
      } else {
        toast.error("Get Tool Cgnat history failure!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Get Tool Cgnat history failure!");
    }
  };

  function success(data) {
    return { type: actionTypes.GET_HISTORY_TOOL_CGNAT_SUCCESS, value: data };
  }
}

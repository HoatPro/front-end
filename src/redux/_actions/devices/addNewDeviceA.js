import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import {toast} from "react-toastify";
import {getNetAreas, getNetFunctions, getAddDeviceToOpsviewLogOnDate} from "../../../utils/api";

export function getLogData(logDate) {

    return async dispatch => {
        try {
            let logs = await getAddDeviceToOpsviewLogOnDate(logDate);

            let data = {
                logs,
                logDate
            };

            toast.success('Get logs success!');

            dispatch(success(data));
        }
        catch (e) {
            console.log(e);
            toast.error('Get data failure!');
        }

        function success(value) {
            return {type: actionTypes.GET_ADD_DEVICE_TO_OPSVIEW_LOGS_SUCCESS, value}
        }
    }
}
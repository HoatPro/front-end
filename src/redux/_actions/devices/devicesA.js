import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import * as api from '../../../utils/api';
import {alertA} from '../alertA';
import {toast} from "react-toastify";

export {
    getOnlineNetDevices,
    editNetDevice,
    deleteNetDevice,
};

function getOnlineNetDevices(params) {
    return async (dispatch) => {
        try {
            const devices = await api.getOnlineNetDevices();

            toast.success("Get NET devices successfully!");
            dispatch(success(devices));
        }
        catch (e) {
            console.log(e);
            toast.error('Get NET devices failure!');
        }
    };

    function success(data) {
        return {type: actionTypes.GET_ONLINE_NET_DEVICES_SUCCESS, value: data}
    }
}

function editNetDevice(device) {
    return async (dispatch) => {
        try {
            await api.editNetDevice(device);
            toast.success("Edit device successfully!");
            try {
                const devices = await api.getOnlineNetDevices();

                toast.success("Get NET devices successfully!");
                dispatch({type: actionTypes.GET_ONLINE_NET_DEVICES_SUCCESS, value: devices});
            }
            catch (e) {
                toast.error("Get NET devices failure!");
            }
        }
        catch (e) {
            console.log(e);
            toast.error('Edit device failure!');
        }
    };
}

function deleteNetDevice(device) {
    return async (dispatch) => {
        try {
            const resq = await api.deleteNetDevice(device);

            if (resq.status === 200) {
                if (resq.data.status === 200) {
                    toast.success("Delete device successfully!");
                    try {
                        const devices = await api.getOnlineNetDevices();
                        toast.success("Get NET devices successfully!");
                        dispatch({type: actionTypes.GET_ONLINE_NET_DEVICES_SUCCESS, value: devices});
                    }
                    catch (e) {
                        toast.error("Get NET devices failure!");
                    }
                }
                else {
                    toast.error("Delete device failure: " + (resq.data.msg ? resq.data.msg : ''));
                }
            }
            else {
                toast.error('Delete device failure!');
            }
        }
        catch (e) {
            console.log(e);
            toast.error('Delete device failure!');
        }
    };
}






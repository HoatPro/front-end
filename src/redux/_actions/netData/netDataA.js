import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import {toast} from "react-toastify";
import * as api from "../../../utils/api";

export function getNetDeviceFunctions() {

    return async dispatch => {
        try {
            let data = await api.getNetFunctions();

            dispatch(success(data));
        }
        catch (e) {
            console.log(e);
            toast.error('Get net device function list failure!');
        }

        function success(value) {
            return {type: actionTypes.GET_NET_DEVICE_FUNCTIONS_SUCCESS, value}
        }
    }
}

export function getNetAreas() {

    return async dispatch => {
        try {
            let data = await api.getNetAreas();

            dispatch(success(data));
        }
        catch (e) {
            console.log(e);
            toast.error('Get net area list failure!');
        }

        function success(value) {
            return {type: actionTypes.GET_NET_AREAS_SUCCESS, value}
        }
    }
}

export function getNetDeviceFunctionsAndAreas() {

    return async dispatch => {
        try {
            let [functions, areas] = await Promise.all([api.getNetFunctions(), api.getNetAreas()]);

            dispatch(success({functions, areas}));
        }
        catch (e) {
            console.log(e);
            toast.error('Get net device function list failure!');
        }

        function success(value) {
            return {type: actionTypes.GET_NET_DEVICE_FUNCTIONS_AND_AREAS_SUCCESS, value}
        }
    }
}
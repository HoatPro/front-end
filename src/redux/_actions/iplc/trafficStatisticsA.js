import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import {toast} from "react-toastify";
import * as api from "../../../utils/api";

export function getIplcTrafficOnTime(time) {

    return async dispatch => {
        try {
            let data = await api.getIplcTrafficOnTime(time);
            toast.success('Get Iplc traffic successfully!');

            dispatch(success({selectedTime: time, trafficData: data}));
        }
        catch (e) {
            toast.error('Get Iplc data failure!');
        }

        function success(value) {
            return {type: actionTypes.GET_IPLC_TRAFFIC_ON_TIME, value}
        }
    }
}

export function getIplcTrafficTimesOnDate(date) {

    return async dispatch => {
        try {
            let data = await api.getIplcTrafficTimesOnDate(date);
            toast.success('Get Iplc traffic times successfully!');

            dispatch(success({date, timeList: data.timeList, trafficData: data.trafficData, selectedTime: data.maxTrafficTime, maxTrafficTime: data.maxTrafficTime}));
        }
        catch (e) {
            toast.error('Get Iplc traffic times failure!');
            dispatch(error({date}));
        }

        function success(value) {
            return {type: actionTypes.GET_IPLC_TRAFFIC_TIME_ONDATE_SUCCESS, value}
        }

        function error(value) {
            return {type: actionTypes.GET_IPLC_TRAFFIC_TIME_ONDATE_FAILED, value}
        }
    }
}
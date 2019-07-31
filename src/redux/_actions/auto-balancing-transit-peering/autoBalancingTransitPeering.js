import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';
import {toast} from "react-toastify";

export const autoBalancingTransitPeering = {
    getAllTimeInDay,
    getDetailInfoIrbData,
    getLogSummaryIrbForGraphData,
    getLogDetailIrbForGraphData
};

function getAllTimeInDay(date, dateValue) {
    function getData(date) {
        return axios.async({
            url: '/netd-api/api/get-all-time-in-day',
            method: 'get',
            params: {date}
        });
    }

    return async dispatch => {
        try {
            let resp = await getData(date);
            if (resp.status === 200) {
                if (resp.data.status === 200) {
                    let data = resp.data.data;
                    toast.success('Get data successfully!');
                    dispatch(success({data, date: dateValue}));
                } else {
                    toast.error('Get data list failure!');
                }
            } else {
                toast.error('Get data failure!');
            }
        }
        catch (e) {
            toast.error('Get data failure!');
        }

        function success(value) {
            return {type: actionTypes.GET_ALL_TIME_IN_DAY, value}
        }
    }
}

function getDetailInfoIrbData(time){
    function getData(time) {
        return axios.async({
            url: '/netd-api/api/get-detail-info-irb',
            method: 'get',
            params: time
        });
    }

    return async dispatch => {
        try {
            let resp = await getData(time);
            if (resp.status === 200) {
                if (resp.data.status === 200) {
                    let data = {data: resp.data.data};

                    toast.success('Get data successfully!');
                    dispatch(success(data));
                } else {
                    toast.error('Get data list failure!');
                }
            } else {
                toast.error('Get data failure!');
            }
        }
        catch (e) {
            toast.error('Get data failure!');
        }

        function success(value) {
            return {type: actionTypes.GET_DETAIL_INFO_IRB_DATA, value}
        }
    }
}


function getLogSummaryIrbForGraphData(option){
    function getData(option) {
        console.log(option);
        return axios.async({
            url: '/netd-api/api/get-log-summary-irb-for-graph',
            method: 'get',
            params: {
                from: option.from,
                to: option.to,
                okSize: option.okSize,
                criticalSize: option.criticalSize
            }
        });
    }
    return async dispatch => {
        try {
            let res = await getData(option);
            console.log("resp ", res);
            console.log("resp ", res.status);
            if (res.status === 200){
                let data = res.data;
                toast.success('Get data successfully!');
                dispatch(success(data));

            }
            else {
                toast.error('Get data failure');
            }
        }
        catch (e) {

        }
    }

    function success(value){
        return { type: actionTypes.GET_LOG_SUMMARY_IRB_FOR_GRAPH_DATA, value }
    }

}



function getLogDetailIrbForGraphData(from, to){
    function getData(from, to) {
        return axios.async({
            url: '/netd-api/api/get-log-detail-irb-for-graph',
            method: 'get',
            params: {
                from: from,
                to: to
            }
        });
    }
    return async dispatch => {
        try {
            let res = await getData(from, to);
            console.log("resp ", res);
            console.log("resp ", res.status);
            if (res.status === 200){
                let data = res.data;
                toast.success('Get data successfully!');
                dispatch(success(data));

            }
            else {
                toast.error('Get data failure');
            }
        }
        catch (e) {

        }
    }

    function success(value){
        return { type: actionTypes.GET_LOG_DETAIL_IRB_FOR_GRAPH_DATA, value }
    }

}


import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';
import {toast} from "react-toastify";

export const autoBalancingIPLC = {
    getIpv6ToMpopData,
    getEqualReportData,
    getIplcReportData,
    getIplcMpopByGwDataIpv6,
    getEqualMpopByGwDataIpv6,
    getIplcMpopByGwDataIpv4,
    getEqualMpopByGwDataIpv4
};


function getIpv6ToMpopData(){
    function getData() {
        return axios.async({
            url: '/netd-api/api/get-ipv6-to-mpop-data',
            method: 'get'
        });
    }

    return async dispatch => {
        try {
            let resp = await getData();
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
            return {type: actionTypes.GET_IPV6_TO_MPOP_DATA, value}
        }
    }
}


function getEqualReportData(){
    function getData() {
        return axios.async({
            url: '/netd-api/api/get-equal-report-data',
            method: 'get'
        });
    }
    return async dispatch => {
        try {
            let resp = await getData();
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
            return {type: actionTypes.GET_EQUAL_REPORT_DATA, value}
        }
    }
}


function getIplcReportData(){
    function getData() {
        return axios.async({
            url: '/netd-api/api/get-iplc-report-data',
            method: 'get'
        });
    }
    return async dispatch => {
        try {
            let resp = await getData();
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
            return {type: actionTypes.GET_IPLC_REPORT_DATA, value}
        }
    }
}


function getIplcMpopByGwDataIpv6(){
    function getData() {
        return axios.async({
            url: '/netd-api/api/get-iplc-mpop-by-gw-data-ipv6',
            method: 'get'
        });
    }
    return async dispatch => {
        try {
            let resp = await getData();
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
            return {type: actionTypes.GET_IPLC_MPOP_BY_GW_IPV6, value}
        }
    }
}


function getEqualMpopByGwDataIpv6(){
    function getData() {
        return axios.async({
            url: '/netd-api/api/get-equal-mpop-by-gw-data-ipv6',
            method: 'get'
        });
    }
    return async dispatch => {
        try {
            let resp = await getData();
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
            return {type: actionTypes.GET_EQUAL_MPOP_BY_GW_IPV6, value}
        }
    }
}



function getIplcMpopByGwDataIpv4(){
    function getData() {
        return axios.async({
            url: '/netd-api/api/get-iplc-mpop-by-gw-data-ipv4',
            method: 'get'
        });
    }
    return async dispatch => {
        try {
            let resp = await getData();
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
            return {type: actionTypes.GET_IPLC_MPOP_BY_GW_IPV4, value}
        }
    }
}


function getEqualMpopByGwDataIpv4(){
    function getData() {
        return axios.async({
            url: '/netd-api/api/get-equal-mpop-by-gw-data-ipv4',
            method: 'get'
        });
    }
    return async dispatch => {
        try {
            let resp = await getData();
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
            return {type: actionTypes.GET_EQUAL_MPOP_BY_GW_IPV4, value}
        }
    }
}



import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';
import {toast} from "react-toastify";

export const cgnatSummaryA = {
    getCgnatSummaryData,
    savePlan
};

function getCgnatSummaryData(date, increasingPercent) {

    function getData() {
        return axios.async({
            url: '/netd-api/api/cgnat-traffic-statistics',
            method: 'get',
            params: {
                date, increasingPercent
            }
        });
    }

    return async dispatch => {
        try {
            let resp = await getData();
            if (resp.status === 200) {
                if (resp.data.status === 200) {
                    let data = {date, increasingPercent, data: resp.data.data};
                    toast.success('Get CGNAT Summary data successfully!');
                    dispatch(success(data));
                } else {
                    toast.error('Get CGNAT Summary data failure!');
                }
            } else {
                toast.error('Get CGNAT Summary data failure!');
            }
        }
        catch (e) {
            toast.error('Get CGNAT Summary data failure!');
        }

        function success(value) {
            return {type: actionTypes.GET_CGNAT_SUMMARY_SUCCESS, value}
        }
    }
}

function savePlan(date, list) {

    function postData(date, list) {
        return axios.async({
            url: '/netd-api/api/cgnat-plan',
            method: 'post',
            data: {
                date,
                list
            }
        });

        // return new Promise(function (resolve, reject) {
        //    resolve({
        //      status: 200,
        //      data : {
        //          status: 200
        //      }
        //    });
        // });
    }

    return async dispatch => {
        try {

            const planData = {};

            for (let item of list)
            {
                planData[item.name] = {
                    action: item.action,
                    deadline: item.deadline,
                    assignment: item.assignment
                }
            }

            let resp = await postData(date, planData);
            if (resp.status === 200) {
                if (resp.data.status === 200) {
                    let data = {data: resp.data.data};
                    toast.success('Save plan successfully!');
                    dispatch(success(list));
                } else {
                    toast.error('Save plan failure!');
                }
            } else {
                toast.error('Save plan failure!');
            }
        }
        catch (e) {
            console.log(e);
            toast.error('Save plan failure!');
        }

        function success(value) {
            return {type: actionTypes.SAVE_CGNAT_PLAN_SUCCESS, value}
        }
    }
}

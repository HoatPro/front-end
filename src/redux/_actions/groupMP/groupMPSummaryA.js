import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';
import {toast} from "react-toastify";

export const groupMPSummaryA = {
    getGroupMPSummaryContent,
    savePlan
};

function getGroupMPSummaryContent(date, increasingPercent) {

    function getAllDetailInfoGroupMp(date, increasingPercent) {
        return axios.async({
            method: 'get',
            url: `/api/get-all-detail-group-mp`,
            params: {date: date.toISOString(), increasingPercent}
        });
    }

    function getPlanContent(date) {
        return axios.async({
            method: 'get',
            url: `/api/plan-content`,
            params: {
                date: date.toISOString()
            }
        });
    }

    return async dispatch => {

        try {
            const [res1, res2] = await Promise.all([getAllDetailInfoGroupMp(date, increasingPercent), getPlanContent(date)]);

            if (res1.status === 200 && res1.data.status === 200  && res2.status === 200 && res2.data.status === 200)
            {
                toast.success('Get group MP data successfully!');
                dispatch(success({allGroupMpDetail: res1.data.data, planContent: res2.data.data, date, increasingPercent}));
            }
            else
            {
                toast.error('Sorry! There is an error during processing your request!');
            }
        }
        catch (e) {
            console.log(e);
            toast.error('Sorry! There is an error during processing your request!');
        }

        function success(value) {
            return {type: actionTypes.GET_GROUP_MP_SUMMARY_SUCCESS, value}
        }
    }
}

function savePlan(date, list) {

    function savePlanContent(date, list) {
        return axios.async({
            url: '/netd-api/api/plan-content',
            method: 'post',
            data: {
                date, list
            }
        });
    }

    return async (dispatch) => {
        try {
            const res = await savePlanContent(date, list);

            if (res.status == 200 && res.data.status ===200)
            {
                const resBody = res.data;
                toast.success("Save plan changes successfully!");
                dispatch(success(resBody.data));
            }
        }
        catch (e) {
            console.log(e);
            toast.error('Save plan changes failure!');
        }
    };

    function success(data) {
        return {type: actionTypes.SAVE_PLAN_SUCCESS, value : data}
    }
}

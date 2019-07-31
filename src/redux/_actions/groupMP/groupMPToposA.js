import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';
import {toast} from "react-toastify";

export const groupMPToposA = {
    getAllGroupMPNames,
    getDetailGroupMP
};

function getAllGroupMPNames(params) {

    return async dispatch => {

        try {
            let resp = await axios.async({
                url: '/netd-api/api/show-all-group-mp',
                method: 'get'
            });

            if (resp.status === 200 && resp.data.status === 200) {
                let data = {data: resp.data.data};
                toast.success('Get group MP topo list successfully!');
                dispatch(success(data));
            } else {
                toast.error('Get group MP topo list failure!');
            }
        }
        catch (e) {
            toast.error('Get group MP topo list failure!');
        }

        function success(value) {
            return {type: actionTypes.GET_ALL_GROUP_MP_NAMES_SUCCESS, value}
        }
    };
}

function getDetailGroupMP(name) {
    return async dispatch => {

        dispatch({type: actionTypes.GET_DETAIL_GROUP_MP_REQUEST});

        try {
            let resp = await axios.async({
                url: '/netd-api/api/get-detail-group-mp',
                method: 'get',
                params: {
                    groupMpName: name
                },
            });

            if (resp.status === 200) {
                const resData = resp.data;

                if (_.isArray(resData) && resData.length > 0) {
                    const value = {name, list: resData.map((e) => (e._source))};
                    toast.success('Get detail Group MP successfully!');
                    dispatch({type: actionTypes.GET_DETAIL_GROUP_MP_SUCCESS, value});
                }
                else {
                    toast.error('Get detail Group MP  failure!');
                }
            } else {
                toast.error('Get detail Group MP  failure!');
            }
        }
        catch (e) {
            console.log(e);
            toast.error('Get detail Group MP  failure!');
        }
    };
}




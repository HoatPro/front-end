import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';
import {toast} from "react-toastify";

export const groupMPListA = {
    getGroupMPList
};

function getGroupMPList(params) {

    function getData() {
        return axios.async({
            url: '/netd-api/api/get-all-detail-group-mp',
            method: 'get'
        });
    }

    return async dispatch => {

        try {
            let resp = await getData();
            if (resp.status === 200) {
                if (resp.data.status === 200) {
                    let data = {data: resp.data.data};

                    toast.success('Get group MP list successfully!');
                    dispatch(success(data));
                } else {
                    toast.error('Get group MP list failure!');
                }
            } else {
                toast.error('Get group MP list failure!');
            }
        }
        catch (e) {
            toast.error('Get group MP list failure!');
        }

        function success(value) {
            return {type: actionTypes.GET_GROUP_MP_LIST_SUCCESS, value}
        }
    }
}

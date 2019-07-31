import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';
import {toast} from "react-toastify";

export const groupMPPartsA = {
    getAllGroupMPParts,
};

function getAllGroupMPParts(params) {

    function getData() {
        return axios.async({
            url: '/netd-api/api/get-part-in-group-mp',
            method: 'get'
        });
    }

    return async dispatch => {

        try {
            const resp = await getData();

            if (resp.status === 200 && resp.data.status === 200) {
                toast.success('Get group MP parts successfully!');
                dispatch(success({data: resp.data.data}));
            } else {
                toast.error('Get group MP parts list failure!');
            }
        }
        catch (e) {
            toast.error('Get group MP parts list failure!');
        }
    };

    function success(value) {
        return {type: actionTypes.GET_ALL_GROUP_MP_PARTS_SUCCESS, value}
    }
}





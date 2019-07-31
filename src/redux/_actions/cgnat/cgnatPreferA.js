import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';
import {toast} from "react-toastify";

export const cgnatPreferA = {
    getCgnatPreferData
};

function getCgnatPreferData(params) {

    function getData() {
        return axios.async({
            url: '/netd-api/api/cgnat-prefer',
            method: 'get'
        });

        // return new Promise((resolve, reject) => {
        //     resolve({
        //         status: 200,
        //         data: {
        //             status: 200,
        //             data: [{
        //                 area: 7,
        //                 group: 'AGG-MP-01',
        //                 mpName: 'AGG-MP-01-01',
        //                 cgnat: 'HNI-CGNAT-01'
        //             }, {
        //                 area: 7,
        //                 group: 'AGG-MP-01',
        //                 mpName: 'AGG-MP-01-02',
        //                 cgnat: 'HNI-CGNAT-02'
        //             }]
        //         }
        //     });
        // });
    }

    return async dispatch => {
        try {
            let resp = await getData();
            if (resp.status === 200) {
                if (resp.data.status === 200) {
                    let data = {data: resp.data.data};
                    toast.success('Get CGNAT Prefer data successfully!');
                    dispatch(success(data));
                } else {
                    toast.error('Get CGNAT Prefer data failure!');
                }
            } else {
                toast.error('Get CGNAT Prefer data failure!');
            }
        }
        catch (e) {
            toast.error('Get CGNAT Prefer data failure!');
        }

        function success(value) {
            return {type: actionTypes.GET_CGNAT_FREFER_SUCCESS, value}
        }
    }
}

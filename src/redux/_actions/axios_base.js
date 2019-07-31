import axios from 'axios';
import config from  '../../utils/config';
const env = config.environment;

const origin = config[env].originBackend;

export default {
    post: (body, callback) => {
        const token = '';// localStorage.getItem('token');
        const header = body.headers ? { ...body.headers, 'x-access-token': token } : { 'x-access-token': token };
        axios.post(body.url, body.params, {
            headers: header
        }).then(resp => {
            callback(resp)
        }).catch(error => {
            callback({
                status: 500,
                data: [],
                message: error.message
            });
            console.error(error);
        });
    },
    get: (body, callback) => {
        const token = '';// localStorage.getItem('token');
        const header = body.headers ? { ...body.headers, 'x-access-token': token } : { 'x-access-token': token };
        axios({
            method: 'get',
            url: body.url,
            params: body.params || {},
            headers: header
        }).then(resp => {
            callback(resp)
        }).catch(error => {
            callback({
                status: 500,
                data: [],
                message: error.message
            });
            console.error(error);
        });
    },
    async: (params)=>{
        const token = '';// localStorage.getItem('token');
        const headers = params.headers ? { ...params.headers, 'x-access-token': token } : { 'x-access-token': token };

        let url = params.url;

        if (url[0] && url[0]==='/')
        {
            url = origin + url;
        }

        params.headers = headers;
        params.url = url;

        return axios(params);
    },
    put: (body, callback) => {
        const token = '';// localStorage.getItem('token');
        const header = body.headers ? { ...body.headers, 'x-access-token': token } : { 'x-access-token': token };
        axios.put(body.url, body.params, {
            headers: header
        }).then(resp => {
            callback(resp)
        }).catch(error => {
            callback({
                status: 500,
                data: [],
                message: error.message
            });
            console.error(error);
        });
    },
    delete: (body, callback) => {
        const token = '';// localStorage.getItem('token');
        const header = body.headers ? { ...body.headers, 'x-access-token': token } : { 'x-access-token': token };
        axios({
            method: 'delete',
            url: body.url,
            params: body.params,
            headers: header
        }).then(resp => {
            callback(resp)
        }).catch(error => {
            callback({
                status: 500,
                data: [],
                message: error.message
            });
            console.error(error);
        });
    },
}
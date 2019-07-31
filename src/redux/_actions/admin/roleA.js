import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';

export const roleA = {
    getRoles,
    insertRole,
    validate,
    updateCurrent,
    updateRole,
    deleteRole,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getRoleById,
    handleSearch,
    onPageChange,
    getOthers
};

function getRoles(params) {
    return dispatch => {
        axios.get({
            url: api.get_roles,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // dispatch(paginationActions.pagination(data.pagination));
                    dispatch(success(data));
                } else {
                    dispatch(dispatch(alertA.error(data.message)));
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });

        function success(value) { return {type: actionTypes.GET_ROLES_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.GET_ROLES_FAILURE, error} }
    }
}

function getOthers(params) {
    return dispatch => {
        let promises = [];
        const operations = new Promise(resolve => {
            axios.get({
                url: api.get_all_operation,
            }, resp => {
                let result = [];
                if(resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(operations);

        const routes = new Promise(resolve => {
            axios.get({
                url: api.get_all_route,
            }, resp => {
                let result = [];
                if(resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(routes);

        Promise.all(promises).then(resp => {
            const data = {
                operations: resp[0],
                routes: resp[1],
                expanded: ['all']
            };
            dispatch(success(data));
        }).catch(error => {
            dispatch(failure(error.toString()));
        });

    };

    function success(value) {return {type: actionTypes.GET_ROLE_OTHER_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.GET_ROLE_OTHER_FAILURE, error}}
}

function insertRole(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_role,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    dispatch(alertA.success(data.message));
                    dispatch(success(data));
                } else {
                    dispatch(dispatch(alertA.error(data.message)));
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });
    };
    function request() {return {type: actionTypes.INSERT_ROLE_REQUEST}}
    function success(value) {return {type: actionTypes.INSERT_ROLE_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.INSERT_ROLE_FAILURE, error}}
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_ROLE, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_ROLE, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_ROLE, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_ROLE, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_ROLE, value}
}

function deleteRole(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_role,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    dispatch(alertA.success(data.message));
                    dispatch(success(data));
                } else {
                    dispatch(dispatch(alertA.error(data.message)));
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });
        
    };
    function request() {return {type: actionTypes.DELETE_ROLE_REQUEST}}
    function success(value) {return {type: actionTypes.DELETE_ROLE_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.DELETE_ROLE_FAILURE, error}}
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_ROLE, value}
}

function getRoleById(params) {
    return dispatch => {
        axios.get({
            url: api.get_role_by_id,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // dispatch(paginationActions.pagination(data.pagination));
                    dispatch(success(data));
                } else {
                    dispatch(dispatch(alertA.error(data.message)));
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });

        function success(value) { return {type: actionTypes.GET_ROLES_BY_ID_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.GET_ROLES_BY_ID_FAILURE, error} }
    }
}

function updateRole(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_role,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    dispatch(alertA.success(data.message));
                    dispatch(success(data));
                } else {
                    dispatch(dispatch(alertA.error(data.message)));
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });
        function request() {return {type: actionTypes.UPDATE_ROLE_REQUEST}}
        function success(value) { return {type: actionTypes.UPDATE_ROLE_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.UPDATE_ROLE_FAILURE, error} }
    }
}

function handleSearch(value) {
    return  {type: actionTypes.SEARCH_ROLE, value};
}

function onPageChange(value) {
    return  {type: actionTypes.ON_PAGE_CHANGE_ROLES, value};
}
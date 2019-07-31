import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';

export const groupA = {
    getGroups,
    insertGroup,
    validate,
    updateCurrent,
    updateGroup,
    deleteGroup,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getGroupById,
    handleSearch,
    onPageChange,
    getOthers
};

function getGroups(params) {
    return dispatch => {
        axios.get({
            url: api.get_groups,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    // dispatch(paginationActions.pagination(data.pagination));
                    dispatch(success(data));
                } else {
                    dispatch(alertA.error(data.message));
                    // dispatch(alertActions.error(data.message));
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });

        function success(value) { return {type: actionTypes.GET_GROUPS_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.GET_GROUPS_FAILURE, error} }
    }
}

function getOthers(params) {
    return dispatch => {
        let promises = [];
        const roles = new Promise(resolve => {
            axios.get({
                url: api.get_all_role,
            }, resp => {
                let result = [];
                if(resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(roles);

        Promise.all(promises).then(resp => {
            const data = {
                roles: resp[0],
                expanded: ['all']
            };
            dispatch(success(data));
        }).catch(error => {
            dispatch(failure(error.toString()));
        });

    };

    function success(value) {return {type: actionTypes.GET_GROUP_OTHER_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.GET_GROUP_OTHER_FAILURE, error}}
}

function insertGroup(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_group,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    alertA.success(data.message);
                    dispatch(success(data));
                } else {
                    dispatch(alertA.error(data.message));
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });
    };
    function request() {return {type: actionTypes.INSERT_GROUP_REQUEST}}
    function success(value) {return {type: actionTypes.INSERT_GROUP_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.INSERT_GROUP_FAILURE, error}}
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_GROUP, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_GROUP, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_GROUP, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_GROUP, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_GROUP, value}
}

function deleteGroup(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_group,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    alertA.success(data.message);
                    dispatch(success(data));
                } else {
                    dispatch(alertA.error(data.message));
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });
        
    };
    function request() {return {type: actionTypes.DELETE_GROUP_REQUEST}}
    function success(value) {return {type: actionTypes.DELETE_GROUP_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.DELETE_GROUP_FAILURE, error}}
}

function initUpdate(value) {
    return {type: actionTypes.INIT_UPDATE_GROUP, value}
}

function getGroupById(params) {
    return dispatch => {
        axios.get({
            url: api.get_group_by_id,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    dispatch(success(data));
                } else {
                    dispatch(alertA.error(data.message));
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });

        function success(value) { return {type: actionTypes.GET_GROUPS_BY_ID_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.GET_GROUPS_BY_ID_FAILURE, error} }
    }
}

function updateGroup(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_group,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    alertA.success(data.message);
                    dispatch(success(data));
                } else {
                    dispatch(alertA.error(data.message));
                    dispatch(failure(data.message));
                }
            } else {
                dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });
        function request() {return {type: actionTypes.UPDATE_GROUP_REQUEST}}
        function success(value) { return {type: actionTypes.UPDATE_GROUP_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.UPDATE_GROUP_FAILURE, error} }
    }
}

function handleSearch(value) {
    return  {type: actionTypes.SEARCH_GROUP, value};
}

function onPageChange(value) {
    return  {type: actionTypes.ON_PAGE_CHANGE_GROUPS, value};
}
import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';

export const routeA = {
    getRoutes,
    getRouteParents,
    insertRoute,
    validate,
    updateCurrent,
    updateRoute,
    deleteRoute,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getRouteById,
    handleSearch,
    onPageChange
};

function getRoutes(params) {
    return dispatch => {
        axios.get({
            url: api.get_routes,
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

        function success(value) { return {type: actionTypes.GET_ROUTES_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.GET_ROUTES_FAILURE, error} }
    }
}

function getRouteParents(params) {
    return dispatch => {
        axios.get({
            url: api.get_route_parents,
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
        function success(value) { return {type: actionTypes.GET_ROUTE_PARENTS_SUCCESS, value}}
        function failure(error) { return {type: actionTypes.GET_ROUTE_PARENTS_FAILURE, error}}
    }
}

function insertRoute(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_route,
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
    function request() {return {type: actionTypes.INSERT_ROUTE_REQUEST}}
    function success(value) {return {type: actionTypes.INSERT_ROUTE_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.INSERT_ROUTE_FAILURE, error}}
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_ROUTE, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_ROUTE, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_ROUTE, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_ROUTE, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_ROUTE, value}
}

function deleteRoute(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_route,
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
    function request() {return {type: actionTypes.DELETE_ROUTE_REQUEST}}
    function success(value) {return {type: actionTypes.DELETE_ROUTE_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.DELETE_ROUTE_FAILURE, error}}
}

function initUpdate(value) {
    return  {type: actionTypes.INIT_UPDATE_ROUTE, value};
}

function getRouteById(params) {
    return dispatch => {
        axios.get({
            url: api.get_route_by_id,
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
                dispatch(failure(resp.message));
            }
        });

        function success(value) { return {type: actionTypes.GET_ROUTES_BY_ID_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.GET_ROUTES_BY_ID_FAILURE, error} }
    }
}

function updateRoute(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_route,
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
        function request() {return {type: actionTypes.UPDATE_ROUTE_REQUEST}}
        function success(value) { return {type: actionTypes.UPDATE_ROUTE_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.UPDATE_ROUTE_FAILURE, error} }
    }
}

function handleSearch(value) {
    return  {type: actionTypes.SEARCH_ROUTE, value};
}

function onPageChange(value) {
    return  {type: actionTypes.ON_PAGE_CHANGE_ROUTES, value};
}
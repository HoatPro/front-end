import actionTypes from '../_constants/actionTypes';
import axios from './axios_base';
import api from './api';
import {alertA} from './alertA';

export const layoutA = {
    getLayouts,
    insertRackLayout,
    validate,
    updateCurrent,
    updateRackLayout,
    deleteRackLayout,
    modal,
    handleDeleteRack,
    handleUpdateRow,
    initUpdate,
    getLayoutById,
    handleSearch,
    onPageChange,
    getOthers,
    onChangeLocation,
    onChangeDatCenter,
    onChangeRoom,
    getRackByZone,
};

function getLayouts(params) {
    return dispatch => {
        axios.get({
            url: api.get_layouts,
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

        function success(value) { return {type: actionTypes.GET_LAYOUTS_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.GET_LAYOUTS_FAILURE, error} }
    }
}

function insertRackLayout(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.insert_rack,
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
    function request() {return {type: actionTypes.INSERT_RACK_LAYOUT_REQUEST}}
    function success(value) {return {type: actionTypes.INSERT_RACK_LAYOUT_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.INSERT_RACK_LAYOUT_FAILURE, error}}
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_LAYOUT, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_LAYOUT, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_LAYOUT, value}
}

function handleDeleteRack(value) {
    return {type: actionTypes.HANDLE_DELETE_RACK_LAYOUT, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_LAYOUT, value}
}

function deleteRackLayout(params) {
    return dispatch => {
        dispatch(request({}));
        axios.delete({
            url: api.delete_rack,
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
    function request() {return {type: actionTypes.DELETE_RACK_LAYOUT_REQUEST}}
    function success(value) {return {type: actionTypes.DELETE_RACK_LAYOUT_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.DELETE_RACK_LAYOUT_FAILURE, error}}
}

function initUpdate(value) {
    return  {type: actionTypes.INIT_UPDATE_LAYOUT, value};
}

function getLayoutById(params) {
    return dispatch => {
        axios.get({
            url: api.get_layout_by_id,
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

        function success(value) { return {type: actionTypes.GET_LAYOUTS_BY_ID_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.GET_LAYOUTS_BY_ID_FAILURE, error} }
    }
}

function updateRackLayout(params) {
    return dispatch => {
        dispatch(request({}));
        axios.put({
            url: api.update_rack,
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
        function request() {return {type: actionTypes.UPDATE_RACK_LAYOUT_REQUEST}}
        function success(value) { return {type: actionTypes.UPDATE_RACK_LAYOUT_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.UPDATE_RACK_LAYOUT_FAILURE, error} }
    }
}

function handleSearch(value) {
    return  {type: actionTypes.SEARCH_LAYOUT, value};
}

function onPageChange(value) {
    return  {type: actionTypes.ON_PAGE_CHANGE_LAYOUTS, value};
}

function getOthers(params) {
    return dispatch => {
        let promises = [];
        const locations = new Promise(resolve => {
            axios.get({
                url: api.get_all_location,
            }, resp => {
                let result = [];
                if(resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(locations);

        const dataCenters = new Promise(resolve => {
            axios.get({
                url: api.get_all_datacenter,
            }, resp => {
                let result = [];
                if(resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(dataCenters);

        const rooms = new Promise(resolve => {
            axios.get({
                url: api.get_all_room,
            }, resp => {
                let result = [];
                if(resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(rooms);

        const zones = new Promise(resolve => {
            axios.get({
                url: api.get_all_zone,
            }, resp => {
                let result = [];
                if(resp.status === 200) {
                    const data = resp.data;
                    result = data.data;
                }
                resolve(result);
            });
        });
        promises.push(zones);

        Promise.all(promises).then(resp => {
            const data = {
                locations: resp[0],
                dataCenters: resp[1],
                rooms: resp[2],
                zones: resp[3]
            };
            dispatch(success(data));
        }).catch(error => {
            dispatch(failure(error.toString()));
        });

    };

    function success(value) {return {type: actionTypes.GET_LAYOUT_OTHER_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.GET_LAYOUT_OTHER_FAILURE, error}}
}

function onChangeLocation(value) {
    return {type: actionTypes.ONCHANGE_LOCATION_LAYOUT, value}
}

function onChangeDatCenter(value) {
    return {type: actionTypes.ONCHANGE_DATACENTER_LAYOUT, value}
}

function onChangeRoom(value) {
    return {type: actionTypes.ONCHANGE_ROOM_LAYOUT, value}
}

function getRackByZone(params) {
    return dispatch => {
        dispatch(request({}));
        axios.get({
            url: api.get_rack_by_zone,
            params: params,
        }, resp => {
            if (resp.status === 200) {
                const data = resp.data;
                if (data.status === 200) {
                    dispatch(success(data));
                } else {
                    // dispatch(dispatch(alertA.error(data.message)));
                    dispatch(failure(data.message));
                }
            } else {
                // dispatch(alertA.error(resp.message));
                dispatch(failure(resp.message));
            }
        });
        function request() {return {type: actionTypes.GET_RACKS_BY_ZONE_REQUEST}}
        function success(value) { return {type: actionTypes.GET_RACKS_BY_ZONE_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.GET_RACKS_BY_ZONE_FAILURE, error} }
    }
}
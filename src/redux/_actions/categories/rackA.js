import actionTypes from '../../_constants/actionTypes';
import axios from '../axios_base';
import api from '../api';
import {alertA} from '../alertA';

export const rackA = {
    getRacks,
    insertRack,
    validate,
    updateCurrent,
    updateRack,
    deleteRack,
    modal,
    handleDeleteRow,
    handleUpdateRow,
    initUpdate,
    getRackById,
    handleSearch,
    onPageChange,
    getOthers,
    onChangeLocation,
    onChangeDatCenter,
    onChangeRoom,
    onChangeZone,
    handleBookingU,
    bookingU,
};

function getRacks(params) {
    return dispatch => {
        axios.get({
            url: api.get_racks,
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

        function success(value) { return {type: actionTypes.GET_RACKS_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.GET_RACKS_FAILURE, error} }
    }
}

function insertRack(params) {
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
    function request() {return {type: actionTypes.INSERT_RACK_REQUEST}}
    function success(value) {return {type: actionTypes.INSERT_RACK_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.INSERT_RACK_FAILURE, error}}
}

function updateCurrent(name, value, error) {
    return {type: actionTypes.UPDATE_CURRENT_RACK, name, value, error}
}

function validate(value) {
    return {type: actionTypes.VALIDATE_RACK, value}
}

function modal(value) {
    return {type: actionTypes.MODAL_RACK, value}
}

function handleDeleteRow(value) {
    return {type: actionTypes.HANDLE_DELETE_RACK, value}
}

function handleUpdateRow(value) {
    return {type: actionTypes.HANDLE_UPDATE_RACK, value}
}

function deleteRack(params) {
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
    function request() {return {type: actionTypes.DELETE_RACK_REQUEST}}
    function success(value) {return {type: actionTypes.DELETE_RACK_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.DELETE_RACK_FAILURE, error}}
}

function initUpdate(value) {
    return  {type: actionTypes.INIT_UPDATE_RACK, value};
}

function getRackById(params) {
    return dispatch => {
        axios.get({
            url: api.get_rack_by_id,
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

        function success(value) { return {type: actionTypes.GET_RACK_BY_ID_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.GET_RACK_BY_ID_FAILURE, error} }
    }
}

function updateRack(params) {
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
        function request() {return {type: actionTypes.UPDATE_RACK_REQUEST}}
        function success(value) { return {type: actionTypes.UPDATE_RACK_SUCCESS, value} }
        function failure(error) { return {type: actionTypes.UPDATE_RACK_FAILURE, error} }
    }
}

function handleSearch(value) {
    return  {type: actionTypes.SEARCH_RACK, value};
}

function onPageChange(value) {
    return  {type: actionTypes.ON_PAGE_CHANGE_RACKS, value};
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

    function success(value) {return {type: actionTypes.GET_RACK_OTHER_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.GET_RACK_OTHER_FAILURE, error}}
}

function onChangeLocation(value) {
    return {type: actionTypes.ONCHANGE_LOCATION_RACK, value}
}

function onChangeDatCenter(value) {
    return {type: actionTypes.ONCHANGE_DATACENTER_RACK, value}
}

function onChangeRoom(value) {
    return {type: actionTypes.ONCHANGE_ROOM_RACK, value}
}

function onChangeZone(value) {
    return {type: actionTypes.ONCHANGE_ZONE_RACK, value}
}

function handleBookingU(value) {
    return {type: actionTypes.HANDLE_BOOKING_U_RACK, value}
}

function bookingU(params) {
    return dispatch => {
        dispatch(request({}));
        axios.post({
            url: api.booking_u,
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
    function request() {return {type: actionTypes.BOOKING_U_RACK_REQUEST}}
    function success(value) {return {type: actionTypes.BOOKING_U_RACK_SUCCESS, value}}
    function failure(error) {return {type: actionTypes.BOOKING_U_RACK_FAILURE, error}}
}

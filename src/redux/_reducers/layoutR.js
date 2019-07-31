import actionTypes from '../_constants/actionTypes';
import _ from "lodash";

export const layouts = (state = {}, action) => {
    let pagination, value, data, draw, shapes, parents, current, validate, error, image, racks, dataCenters, rooms, find;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_LAYOUT:
        value = action.value;
        return {
            ...state,
           ...value,
        };
        case actionTypes.GET_LAYOUTS_SUCCESS:
            value = action.value;
            pagination = value.pagination;
            data = value.data;
            return {
                ...state,
                pagination: pagination,
                list: data,
                current: {},
                loading: 0,
                action: '',
                open: false,
                searchLoading: false,
            };
        case actionTypes.GET_LAYOUTS_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
            };
        case actionTypes.GET_LAYOUT_PARENTS_SUCCESS:
            value = action.value || {};
            parents = value.data ||[];
            return {
                ...state,
                parents: parents
            };
        case actionTypes.GET_LAYOUT_PARENTS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_CURRENT_LAYOUT:
            current = state.current || {};
            validate = state.validate || {};
            name = action.name;
            error = action.error;
            if(['crop', 'current'].indexOf(name) > -1) {
                value = action.value;
                return {
                    ...state,
                    current: {
                        ...current,
                        ...value
                    },
                };
            } if(name === 'new') {
                value = action.value;
                return {
                    ...state,
                    current: value,
                };
            } else {
                value = action.value;
                return {
                    ...state,
                    current: {
                        ...current,
                        [name]: value
                    },
                    validate: {
                        ...validate,
                        [name]: error
                    }
                };
            }
        case actionTypes.VALIDATE_LAYOUT:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_RACK_LAYOUT_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_RACK_LAYOUT_SUCCESS:
            value = action.value;
            data = value.data;
            current = state.current || {};
            draw = current.draw || {};
            shapes = draw.shapes || [];
            racks = state.racks || [];
            find = _.findIndex(racks, {rackId: data.rackId});
            if(find === -1) racks.push(data);
            find = _.find(shapes, {name: data.name});
            if(find) find.id = data.rackId;
            return {
                ...state,
                current: {
                    ...current,
                    rackId: data.rackId
                },
                loading: 2
            };
        case actionTypes.INSERT_RACK_LAYOUT_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_LAYOUT:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_LAYOUT:
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    ...action.value,
                },
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_LAYOUT:
            return {
                ...state,
                current: action.value,
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_RACK_LAYOUT_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_RACK_LAYOUT_SUCCESS:
            value = action.value;
            current = state.current || {};
            draw = current.draw || {};
            racks = state.racks || [];
            shapes = draw.shapes || [];
            find = _.findIndex(shapes, {id: parseInt(value.data.rackId)});
            if(find > -1) {
                shapes.splice(find, 1);
            }
            find = _.findIndex(racks, {rackId: parseInt(value.data.rackId)});
            if(find > -1) {
                racks.splice(find, 1);
            }
            return {
                ...state,
                loading: 2
            };
        case actionTypes.DELETE_RACK_LAYOUT_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.GET_LAYOUTS_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            current = data[0] || {};
            return {
                ...state,
                current: current,
            };
        case actionTypes.GET_LAYOUTS_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_LAYOUT_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_LAYOUT_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    ...value.data
                },
                loading: 2
            };
        case actionTypes.UPDATE_LAYOUT_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_LAYOUT:
            return {
                ...state,
                search: {
                    str: action.value
                },
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_LAYOUTS:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        case actionTypes.GET_LAYOUT_OTHER_SUCCESS:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.GET_LAYOUT_OTHER_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        case actionTypes.ONCHANGE_LOCATION_LAYOUT:
            dataCenters = state.dataCenters || [];
            rooms = state.rooms || [];
            current = state.current || {};
            value = action.value;
            data = _.filter(dataCenters, item => {return (value === item.locationId)  })
            return {
                ...state,
                current: {
                    ...current,
                    dataCenterId: ''
                },
                _dataCenters: data
            }
        case actionTypes.ONCHANGE_DATACENTER_LAYOUT:
            rooms = state.rooms || [];
            current = state.current || {};
            value = action.value;
            data = _.filter(rooms, item => {return (value === item.roomId)  })
            return {
                ...state,
                current: {
                    ...current,
                    roomId: ''
                },
                _rooms: data
            }
        case actionTypes.ONCHANGE_ROOM_LAYOUT:
            rooms = state.rooms || [];
            current = state.current || {};
            value = action.value;
            data = null;
            image = '';
            data = _.find(rooms, {roomId: value});
            if(data) {
                image = data.image;
            }
            return {
                ...state,
                current: {
                    ...current,
                    image: image
                },
            }
        case actionTypes.GET_RACKS_BY_ZONE_REQUEST:
            return {
                ...state,
                loading: 1,
            };
        case actionTypes.GET_RACKS_BY_ZONE_SUCCESS:
            value = action.value;
            data = value.data;
            current = state.current || {};
            draw =current.draw || {};
            shapes = draw.shapes || [];
            racks = current.racks || [];
            let name = '';
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 5; i++)
            name += possible.charAt(Math.floor(Math.random() * possible.length));
            _.forEach(data, r => {
                shapes.push({
                    x: r.x,
                    y: r.y,
                    id: r.rackId,
                    width: r.width,
                    height: r.height,
                    draggable: true,
                    name: name
                });
            })
            // if(_.size(shapes) > 0) {
               
            // }
            return {
                ...state,
                current: {
                    ...current,
                    draw: {
                        ...draw,
                        shapes: shapes
                    }
                },
                racks: [
                    ...racks,
                    ...data
                ],
                loading: 2
            };
        case actionTypes.GET_RACKS_BY_ZONE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        default:
            return state;
    }
};

import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

export const routes = (state = {}, action) => {
    let pagination, value, data, name, parents, current, validate, error, list;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_ROUTE:
        value = action.value;
        return {
            ...state,
           ...value,
        };
        case actionTypes.GET_ROUTES_SUCCESS:
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
        case actionTypes.GET_ROUTES_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
            };
        case actionTypes.GET_ROUTE_PARENTS_SUCCESS:
            value = action.value || {};
            parents = value.data ||[];
            return {
                ...state,
                parents: parents
            };
        case actionTypes.GET_ROUTE_PARENTS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_CURRENT_ROUTE:
            current = state.current || {};
            validate = state.validate || {};
            name = action.name;
            value = action.value;
            error = action.error;
            
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
        case actionTypes.VALIDATE_ROUTE:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_ROUTE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_ROUTE_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    routeId: value.data.routeId
                },
                loading: 2
            };
        case actionTypes.INSERT_ROUTE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_ROUTE:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_ROUTE:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_ROUTE:
            return {
                ...state,
                current: action.value,
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_ROUTE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_ROUTE_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2
            };
        case actionTypes.DELETE_ROUTE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.GET_ROUTES_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            return {
                ...state,
                current: data[0] || [],
            };
        case actionTypes.GET_ROUTES_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_ROUTE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_ROUTE_SUCCESS:
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
        case actionTypes.UPDATE_ROUTE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_ROUTE:
            return {
                ...state,
                search: {
                    str: action.value
                },
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_ROUTES:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        default:
            return state;
    }
};

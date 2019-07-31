import actionTypes from '../../_constants/actionTypes';
import _ from "lodash";

export const roles = (state = {}, action) => {
    let pagination, value, data, name, current, validate, error, list, operations, temp;
    switch (action.type) {
        case actionTypes.INIT_UPDATE_ROLE:
        value = action.value;
        return {
            ...state,
            ...value,
        };
        case actionTypes.GET_ROLES_SUCCESS:
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
        case actionTypes.GET_ROLES_FAILURE:
            return {
                ...state,
                error: action.error,
                searchLoading: false,
                loading: 0,
                open: false,
            };
        case actionTypes.UPDATE_CURRENT_ROLE:
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
        case actionTypes.VALIDATE_ROLE:
            validate = state.validate || {};
            value = action.value;
            return {
                ...state,
                validate: value
            };
        case actionTypes.INSERT_ROLE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'insert'
            };
        case actionTypes.INSERT_ROLE_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    roleId: value.data.roleId
                },
                loading: 2
            };
        case actionTypes.INSERT_ROLE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.MODAL_ROLE:
            return {
                ...state,
                open: action.value,
            };
        case actionTypes.HANDLE_DELETE_ROLE:
            return {
                ...state,
                current: action.value,
                open: true,
                action: 'delete'
            };
        case actionTypes.HANDLE_UPDATE_ROLE:
            value = action.value;
            operations = value.operations || [];
            temp = _.map(operations, o => o.operationId);
            return {
                ...state,
                current: {
                    ...value,
                    permission: temp
                },
                open: false,
                action: 'update'
            };
        case actionTypes.DELETE_ROLE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'delete',
                open: false
            };
        case actionTypes.DELETE_ROLE_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {},
                loading: 2,
            };
        case actionTypes.DELETE_ROLE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0,
                
            };
        case actionTypes.GET_ROLES_BY_ID_SUCCESS:
            value = action.value;
            data = value.data;
            data = data[0] || {};
            operations = data.operations || [];
            temp = _.map(operations, o => o.operationId);
            return {
                ...state,
                current: {
                    ...data,
                    permission: temp
                },
            };
        case actionTypes.GET_ROLES_BY_ID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.UPDATE_ROLE_REQUEST:
            return {
                ...state,
                loading: 1,
                action: 'update'
            };
        case actionTypes.UPDATE_ROLE_SUCCESS:
            value = action.value;
            current = state.current || {};
            return {
                ...state,
                current: {
                    ...current,
                    ...value.data
                },
                loading: 2,
            };
        case actionTypes.UPDATE_ROLE_FAILURE:
            return {
                ...state,
                error: action.error,
                loading: 0
            };
        case actionTypes.SEARCH_ROLE:
            return {
                ...state,
                search: {
                    str: action.value
                },
                searchLoading: true
            };
        case actionTypes.ON_PAGE_CHANGE_ROLES:
            value = action.value;
            pagination = state.pagination || {};
            return {
                ...state,
                pagination: {
                    ...pagination,
                    currentPage: value
                }
            };
        case actionTypes.GET_ROLE_OTHER_SUCCESS:
            value = action.value;
            return {
                ...state,
                ...value
            };
        case actionTypes.GET_ROLE_OTHER_FAILURE:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};

import actionTypes from '../_constants/actionTypes';

export const sideMenuA = {
    toggleMenu,
    activeItem,
    sendIndex
};

function toggleMenu() {
    return ({ type: actionTypes.TOGGLE_MENU })
}

function activeItem(name) {
    return dispatch => {
        dispatch({ type: actionTypes.ACTIVE_ITEM, name: name })
    }
}

function sendIndex(index) {
    return dispatch => {
        dispatch({ type: actionTypes.ACTIVE_INDEX_SIDEBAR, index: index})
    }
}

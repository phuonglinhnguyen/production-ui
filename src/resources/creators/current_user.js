// import axios from "axios";
// import querystring from "querystring";
// import jwtDecode from "jwt-decode";
import {  removeToken } from '../../utils/auth';
// import { API_ENDPOINT, PATHNAME_HOME } from "../../constants";
import MySocket from '../../utils/my_socket';
import { SET_USER, LOGOUT } from '../actions/current_user'
export const setUser = (user, history) => dispatch => {
    MySocket.connect(user);
    user.username = user.username.toLowerCase();
    return dispatch({
        type: SET_USER,
        user
    });
}

export const logout = user => (dispatch, getState) => {
    MySocket.disconnect(getState().current_user.user);
    removeToken();
    return dispatch({
        type: LOGOUT
    });
};


export function handleLogout() {
    return dispatch => dispatch(logout());
}
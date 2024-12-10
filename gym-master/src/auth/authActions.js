import { LOGIN_SUCCESS, LOGOUT, LOGIN_FAILURE } from './actionTypes';
import axios from 'axios';

export const loginSuccess = (user, token) => ({
    type: LOGIN_SUCCESS,
    payload: { user, token },
});

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: { error },
});

export const logout = () => {
    localStorage.removeItem('token');
    return {
        type: LOGOUT,
    };
};


export const login = (username, password) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            username,
            password,
        });

        if (response.status === 200) {
            const { accessToken, ...user } = response.data;
            console.log(accessToken, user)
            dispatch(loginSuccess(user, accessToken));

            localStorage.setItem('token', accessToken);

            return { type: 'LOGIN_SUCCESS' };
        }
    } catch (error) {
        dispatch(loginFailure(error.response ? error.response.data : error.message));
        return { type: 'LOGIN_FAILURE' };
    }
};
export const staffLogin = (staffID, password) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/staffLogin', {
            staffID,
            password,
        });

        if (response.status === 200) {
            const { accessToken, ...user } = response.data;
            console.log(accessToken, user)
            dispatch(loginSuccess(user, accessToken));

            localStorage.setItem('token', accessToken);

            return { type: 'LOGIN_SUCCESS' };
        }
    } catch (error) {
        dispatch(loginFailure(error.response ? error.response.data : error.message));
        return { type: 'LOGIN_FAILURE' };
    }
};

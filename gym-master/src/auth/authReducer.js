import { LOGIN_SUCCESS, LOGOUT, LOGIN_FAILURE } from './actionTypes';

const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token') || null,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                error: action.payload.error,
            };
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                error: null,
            };
        default:
            return state;
    }
};

export default authReducer;

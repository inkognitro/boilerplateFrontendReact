import {AuthEvent, AuthEventTypes, AuthState} from "Common/Auth/Domain/Types";

const initialAuthState: AuthState = {
    isAuthenticationRunning: false,
    currentAuthUser: null,
};

export function auth (state: AuthState = initialAuthState, event?: AuthEvent): AuthState {
    if(!event) {
        return state;
    }

    if(event.type === AuthEventTypes.USER_LOGIN_WAS_STARTED) {
        return {...state, isAuthenticationRunning: true};
    }

    if(event.type === AuthEventTypes.USER_WAS_LOGGED_IN) {
        return {...state, currentAuthUser: event.payload.authUser, isAuthenticationRunning: false};
    }

    if(event.type === AuthEventTypes.USER_LOGIN_FAILED) {
        return {...state, currentAuthUser: null, isAuthenticationRunning: false};
    }

    if(event.type === AuthEventTypes.USER_AUTHENTICATION_REFRESH_WAS_STARTED) {
        return {...state, isAuthenticationRunning: true};
    }

    if(event.type === AuthEventTypes.USER_AUTHENTICATION_WAS_REFRESHED) {
        return {...state, currentAuthUser: event.payload.authUser, isAuthenticationRunning: false};
    }

    if(event.type === AuthEventTypes.USER_AUTHENTICATION_REFRESH_FAILED) {
        return {...state, currentAuthUser: null, isAuthenticationRunning: false};
    }

    if(event.type === AuthEventTypes.USER_WAS_LOGGED_OUT) {
        return {...state, currentAuthUser: null};
    }

    return state;
}
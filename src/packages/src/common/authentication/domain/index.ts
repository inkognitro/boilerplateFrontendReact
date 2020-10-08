import {
    AuthState as AuthStateType,
    AuthStateSelector as AuthStateSelectorType,
    LoginResult as LoginResultType,
    LogoutResult as LogoutResultType,
} from './types';

export type AuthStateSelector = AuthStateSelectorType;
export type AuthState = AuthStateType;
export type LoginResult = LoginResultType;
export type LogoutResult = LogoutResultType;

export { createAuthenticationSaga } from './saga/flow';
export { logout } from './saga/effect/logout';
export { login } from './saga/effect/login';
export { authenticationReducer, initialAuthState } from './reducer';
export { AuthCommandTypes, createLogin, createLogout } from "./command";
export { AuthEventTypes } from "./event";
export { getCurrentAuthUser, isCurrentUserInitializationRunning } from "./query";

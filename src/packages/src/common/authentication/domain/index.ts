import {
    AuthState as AuthStateType,
    AuthStateSelector as AuthStateSelectorType,
    LoginResult as LoginResultType,
} from './types';

export type AuthStateSelector = AuthStateSelectorType;
export type AuthState = AuthStateType;
export type LoginResult = LoginResultType;

export { createAuthenticationSaga } from './saga/flow';
export { logout, login } from './saga/effect';
export { authenticationReducer, initialAuthState } from './reducer';
export { getCurrentAuthUser, isCurrentUserInitializationRunning } from './query';

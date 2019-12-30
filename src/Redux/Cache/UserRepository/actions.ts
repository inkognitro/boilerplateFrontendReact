import {User, UserRepositoryActions, UserRepositoryActionTypes} from "./types";

export function receiveUserData(user: User): UserRepositoryActions {
    return {
        type: UserRepositoryActionTypes.RECEIVE_USER,
        payload: {
            user: user
        }
    }
}
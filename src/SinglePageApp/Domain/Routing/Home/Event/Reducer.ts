import {
    createTextFieldReducer,
    createTextFieldState,
} from "Common/Domain/FormElements/InputFieldHelper/Event/Reducer";
import { combineReducers, Reducer } from "redux";
import { HomeState } from "SinglePageApp/Domain/Routing/Home/Types";

export const homeReducer: Reducer<HomeState> = combineReducers({
    toastContentField: createTextFieldReducer(
        createTextFieldState({ value: "Hi there :)" }),
    ),
});

import { FormElementEvents, FormElementEventTypes, FormElementState } from "Common/Domain/FormElements/Types";

export function formElementReducer<SpecificFormElementState>(
    state: (SpecificFormElementState & FormElementState),
    event?: FormElementEvents,
): (SpecificFormElementState & FormElementState) {
    if (!event) {
        return state;
    }
    if (event.type === FormElementEventTypes.FORM_ELEMENT_STATE_WAS_CHANGED && state.id !== event.payload.formElementId) {
        return {
            ...state,
            ...event.payload.stateChanges,
        };
    }
    if (event.type === FormElementEventTypes.FORM_ELEMENT_STATES_WERE_CHANGED) {
        if (event.payload.multipleStateChanges.length === 0) {
            return state;
        }
        const initialStateChanges = {
            formElementId: state.id,
            stateChanges: {},
        };
        const mergedStateChanges = event.payload.multipleStateChanges.reduce(
            (mergedStateChanges, stateChanges) => {
                if (mergedStateChanges.formElementId !== state.id) {
                    return mergedStateChanges;
                }
                return {
                    ...mergedStateChanges,
                    ...stateChanges.stateChanges,
                };
            },
            initialStateChanges,
        );
        return {
            ...state,
            ...mergedStateChanges,
        };
    }
    return state;
}

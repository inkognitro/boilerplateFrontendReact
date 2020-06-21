import { Event } from "Packages/Entity/CommonTypes";
import { RouterEventTypes } from "./Types";

export function createCurrentUrlWasChanged(url: string): CurrentUrlWasChanged {
    return {
        type: RouterEventTypes.CURRENT_URL_WAS_CHANGED,
        payload: { url },
    };
}

export type CurrentUrlWasChanged = Event<RouterEventTypes.CURRENT_URL_WAS_CHANGED, {
    url: string;
}>;
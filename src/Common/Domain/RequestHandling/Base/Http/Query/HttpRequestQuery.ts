import {
    HttpRequest,
    HttpState,
} from "Common/Domain/RequestHandling/Base/Http/Types";

export function findRunningHttpRequestById(
    state: HttpState,
    requestId: string,
): null | HttpRequest {
    for (const index in state.runningHttpRequests) {
        const request = state.runningHttpRequests[index];
        if (request.id === requestId) {
            return request;
        }
    }
    return null;
}

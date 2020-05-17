import { ApiV1CommandTypes } from "Common/Domain/HttpApiV1/HttpApiV1";
import { Command } from "Common/Domain/Bus/Command";
import { Request } from "Common/Domain/HttpFoundation/Types";

export function createSendHttpRequest(request: Request): SendHttpRequest {
    return {
        type: ApiV1CommandTypes.SEND_HTTP_REQUEST,
        payload: { request },
    };
}

export type SendHttpRequest = Command<ApiV1CommandTypes.SEND_HTTP_REQUEST, {
    request: Request;
}>;

import { spawn } from "redux-saga/effects";
import { createHttpApiV1Saga } from "Packages/Common/HttpApiV1/Domain/HttpApiV1";
import { createHttpApiV1ToasterSaga } from "Packages/Common/HttpApiV1Toaster/Domain/HttpApiV1Toaster";
import { createHttpFoundationSaga } from "Packages/Common/HttpFoundation/Domain/HttpFoundation";
import { HttpFoundationStateSelector } from "Packages/Common/HttpFoundation/Domain/Types";
import { HttpRequestDispatcher } from "Packages/Common/HttpFoundation/Domain/HttpRequestDispatcher";
import { AuthStateSelector } from "Packages/Common/Authentication/Domain/Types";

export function createRequestHandlingSaga(
    httpStateSelector: HttpFoundationStateSelector,
    httpRequestDispatcher: HttpRequestDispatcher,
    authStateSelector: AuthStateSelector,
): () => Generator {
    return function* (): Generator {
        yield spawn(createHttpFoundationSaga(httpStateSelector, httpRequestDispatcher));
        yield spawn(createHttpApiV1Saga(authStateSelector));
        yield spawn(createHttpApiV1ToasterSaga());
    };
}

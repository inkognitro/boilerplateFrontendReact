import {
    applyMiddleware,
    combineReducers,
    createStore as createReduxStore,
    Reducer,
    Store,
} from "redux";
import { RouterState, RouterStateSelector } from "Packages/Common/Router/Domain/Types";
import createSagaMiddleware from "redux-saga";
import { spawn } from "redux-saga/effects";
import { createBrowserHistory, History } from "history";
import {
    ToasterState,
    ToasterStateSelector,
    toasterReducer,
    createToasterSaga,
} from "Packages/Common/Toaster";
import {
    TranslatorState,
    TranslatorStateSelector,
    createTranslatorSaga,
    translatorReducer,
} from "Packages/Common/Translator";
import {
    BrowserHistoryManager,
    routerReducer,
    createRouterSaga,
} from "Packages/Common/Router";
import { BrowserCookieStorage, createCookieSaga } from "Packages/Common/Cookie";
import {
    HttpFoundationState,
    HttpFoundationStateSelector,
    HttpRequestDispatcher,
    httpFoundationReducer,
    AxiosHttpRequestDispatcher,
    createHttpFoundationSaga,
    MockHttpRequestDispatcher,
} from "Packages/Common/HttpFoundation";
import {
    AuthState,
    AuthStateSelector,
    authenticationReducer,
    createAuthenticationSaga,
} from "Packages/Common/Authentication";
import { designReducer, DesignState } from "Packages/Common/Design";
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLoaderSaga, loaderReducer, LoaderState } from "Packages/Common/Loader";
import { createFormElementsFlow } from "Packages/Common/FormElement";
import { createFormSaga } from "Packages/Common/Form";
import {
    createRoutingSaga,
    routingReducer,
    RoutingState,
    RoutingStateSelector,
} from "Apps/WebSPA/Routing";
import { createHttpApiV1Saga } from "Packages/Common/HttpApiV1";
import { createHttpApiV1ToasterSaga } from "Packages/Common/HttpApiV1Toaster";
import { createFoundationSaga } from "Apps/WebSPA/Foundation/Domain/Saga/Flow";

type AppServices = {
    store: Store
    sagaTask: any
    history: History
    httpRequestDispatcher: HttpRequestDispatcher
};

function createRootReducer(): Reducer {
    return combineReducers({
        design: designReducer,
        translator: translatorReducer,
        toaster: toasterReducer,
        httpFoundation: httpFoundationReducer,
        router: routerReducer,
        routing: routingReducer,
        authentication: authenticationReducer,
        loader: loaderReducer,
    });
}

function createRootSaga(
    history: History,
    httpRequestDispatcher: HttpRequestDispatcher,
): () => Generator {
    const toasterStateSelector: ToasterStateSelector = (state: RootState) => state.toaster;
    const toasterSaga = createToasterSaga(toasterStateSelector);
    const translatorStateSelector: TranslatorStateSelector = (state: RootState) => state.translator;
    const translatorSaga = createTranslatorSaga(translatorStateSelector);
    const loaderSaga = createLoaderSaga();
    const historyManager = new BrowserHistoryManager(history);
    const routerStateSelector: RouterStateSelector = (state: RootState) => state.router;
    const routerSaga = createRouterSaga(routerStateSelector, historyManager);
    const cookieStorage = new BrowserCookieStorage();
    const cookieSaga = createCookieSaga(cookieStorage);
    const formElementsSaga = createFormElementsFlow();
    const formSaga = createFormSaga();
    const authStateSelector: AuthStateSelector = (state: RootState) => state.authentication;
    const authenticationSaga = createAuthenticationSaga(authStateSelector);
    const httpFoundationStateSelector: HttpFoundationStateSelector = (state: RootState) => state.httpFoundation;
    const httpFoundationSaga = createHttpFoundationSaga(httpFoundationStateSelector, httpRequestDispatcher);
    const httpApiV1Saga = createHttpApiV1Saga(authStateSelector);
    const httpApiV1ToasterSaga = createHttpApiV1ToasterSaga();
    const routingStateSelector: RoutingStateSelector = (state: RootState) => state.routing;
    const routingSaga = createRoutingSaga(routingStateSelector);
    const appFoundationSaga = createFoundationSaga();
    return function* rootSaga(): Generator {
        yield spawn(translatorSaga);
        yield spawn(loaderSaga);
        yield spawn(toasterSaga);
        yield spawn(cookieSaga);
        yield spawn(formElementsSaga);
        yield spawn(formSaga);
        yield spawn(authenticationSaga);
        yield spawn(httpFoundationSaga);
        yield spawn(httpApiV1Saga);
        yield spawn(httpApiV1ToasterSaga);
        yield spawn(routerSaga);
        yield spawn(routingSaga);
        yield spawn(appFoundationSaga);
    };
}

export function createDevAppServices(currentServices?: AppServices): AppServices {
    if (currentServices) {
        currentServices.sagaTask.cancel();
    }
    const httpRequestDispatcher: HttpRequestDispatcher = new MockHttpRequestDispatcher();
    const history: History = (currentServices ? currentServices.history : createBrowserHistory());
    const sagaMiddleware = createSagaMiddleware();
    const initialState = (currentServices ? currentServices.store.getState() : undefined);
    const store = createReduxStore(
        createRootReducer(),
        initialState,
        composeWithDevTools(applyMiddleware(sagaMiddleware)),
    );
    const rootSaga = createRootSaga(history, httpRequestDispatcher);
    const sagaTask = sagaMiddleware.run(rootSaga);
    return {
        store,
        sagaTask,
        history,
        httpRequestDispatcher,
    };
}

export function createProdAppServices(): AppServices {
    const httpRequestDispatcher = new AxiosHttpRequestDispatcher();
    const history: History = createBrowserHistory();
    const sagaMiddleware = createSagaMiddleware();
    const store = createReduxStore(createRootReducer(), applyMiddleware(sagaMiddleware));
    const rootSaga = createRootSaga(history, httpRequestDispatcher);
    const sagaTask = sagaMiddleware.run(rootSaga);
    return {
        store,
        sagaTask,
        history,
        httpRequestDispatcher,
    };
}

export type RootState = {
  design: DesignState
  translator: TranslatorState
  loader: LoaderState
  toaster: ToasterState
  httpFoundation: HttpFoundationState
  router: RouterState
  routing: RoutingState
  authentication: AuthState
};

// @ts-ignore
window.hotReloadedServices = (window.hotReloadedServices ? window.hotReloadedServices : null);
export function createHotReloadedDevAppServices(): AppServices {
    // @ts-ignore
    if (window.hotReloadedServices === null) {
        // @ts-ignore
        window.hotReloadedServices = createDevAppServices();
        // @ts-ignore
        return window.hotReloadedServices;
    }
    // @ts-ignore
    window.hotReloadedServices = createDevAppServices(window.hotReloadedServices);
    // @ts-ignore
    return window.hotReloadedServices;
}
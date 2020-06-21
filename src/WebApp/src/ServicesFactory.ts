import {
    applyMiddleware,
    combineReducers,
    createStore as createReduxStore,
    Reducer,
    Store,
} from "redux";
import {
    RouterState,
    RouterStateSelector,
    routerReducer,
    createRouterSaga,
} from "Packages/Common/Router/Domain";
import createSagaMiddleware from "redux-saga";
import { spawn } from "redux-saga/effects";
import { createBrowserHistory, History } from "history";
import {
    ToasterState,
    ToasterStateSelector,
    toasterReducer,
    createToasterSaga,
    ToasterSettings,
} from "Packages/Common/Toaster/Domain";
import {
    TranslatorState,
    TranslatorStateSelector,
    createTranslatorSaga,
    translatorReducer,
} from "Packages/Common/Translator/Domain";
import { BrowserHistoryManager } from "Packages/Common/Router/Infrastructure";
import { createCookieSaga } from "Packages/Common/Cookie/Domain";
import { BrowserCookieStorage } from "Packages/Common/Cookie/Infrastructure";
import {
    HttpFoundationState,
    HttpFoundationStateSelector,
    HttpRequestDispatcher,
    httpFoundationReducer,
    createHttpFoundationSaga,
} from "Packages/Common/HttpFoundation/Domain";
import {
    AxiosHttpRequestDispatcher,
    MockHttpRequestDispatcher,
} from "Packages/Common/HttpFoundation/Infrastructure";
import {
    AuthState,
    AuthStateSelector,
    authenticationReducer,
    createAuthenticationSaga,
} from "Packages/Common/Authentication/Domain";
import { designReducer, DesignState } from "Packages/Common/Design/Domain";
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLoaderSaga, loaderReducer, LoaderState } from "Packages/Common/Loader/Domain";
import { createFormElementsFlow } from "Packages/Common/FormElement/Domain";
import { createFormSaga } from "Packages/Common/Form/Domain";
import {
    createRoutingSaga,
    routingReducer,
    RoutingState,
    RoutingStateSelector,
} from "WebApp/Routing/Domain";
import { createHttpApiV1Saga } from "Packages/Common/HttpApiV1/Domain";
import { createHttpApiV1ToasterSaga } from "Packages/Common/HttpApiV1Toaster/Domain";
import { createFoundationSaga } from "WebApp/Foundation/Domain/Saga/Flow";

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
    const toasterSettings: ToasterSettings = {
        asyncToastWaitingTimeInMs: 200,
        toastIntroAnimationTimeInMs: 800,
        toastOutroAnimationTimeInMs: 800,
        toastMessageIntroAnimationTimeInMs: 800,
        toastMessageOutroAnimationTimeInMs: 550,
    };
    const toasterSaga = createToasterSaga(toasterSettings, toasterStateSelector);
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
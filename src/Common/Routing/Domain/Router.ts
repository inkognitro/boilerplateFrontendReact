import {Redirect, Route} from "Common/Routing/Domain/Types";
import {Reducer} from "redux";
import {HistoryManager} from "Common/Routing/Domain/HistoryManager";
import {EventBus} from "Common/AppBase/EventBus";
import {createCurrentUrlWasChanged} from "Common/Routing/Domain/Events/CurrentUrlWasChanged";
import {ByRedirectInfluencedUrlQuery} from "Common/Routing/Domain/Query/ByRedirectInfluencedUrlQuery";
import {createRedirectWasAdded} from "Common/Routing/Domain/Events/RedirectWasAdded";

export class Router {
    private readonly eventBus: EventBus;
    private readonly byRedirectInfluencedUrlQuery: ByRedirectInfluencedUrlQuery;
    private readonly historyManager: HistoryManager;

    constructor(
        eventBus: EventBus,
        byRedirectInfluencedUrlQuery: ByRedirectInfluencedUrlQuery,
        historyManager: HistoryManager
    ) {
        this.eventBus = eventBus;
        this.byRedirectInfluencedUrlQuery = byRedirectInfluencedUrlQuery;
        this.historyManager = historyManager;
        this.setOnChangeUrlCallback();
    }

    private setOnChangeUrlCallback(): void {
        const mustTriggerHistoryManager = false;
        const onChangeUrlCallback = (url: string) => this.openUrl({
            url: url,
            target: '_self',
            shouldReplaceCurrentUrl: false
        }, mustTriggerHistoryManager);
        this.historyManager.setOnChangeUrlCallback(onChangeUrlCallback);
    }

    public openUrl(settings: OpenUrlSettings, mustTriggerHistoryManager: boolean = true): void
    {
        const urlToUse = this.byRedirectInfluencedUrlQuery.get(settings.url);
        const target = (!settings.target ? '_self' : settings.target);
        if(mustTriggerHistoryManager && target === '_self') {
            this.historyManager.changeCurrentUrl(urlToUse, !!settings.shouldReplaceCurrentUrl);
        }
        if(mustTriggerHistoryManager && target !== '_self') {
            this.historyManager.openUrlInTarget(urlToUse, target);
        }
        if(target === '_self') {
            this.eventBus.handle(createCurrentUrlWasChanged(urlToUse));
        }
    }

    public addRedirect(redirect: Redirect): void
    {
        this.eventBus.handle(createRedirectWasAdded(redirect));
    }
}

export type AddRouteSettings = {
    route: Route,
    reducer: Reducer
};

export type OpenUrlSettings = {
    url: string,
    target?: string,
    shouldReplaceCurrentUrl?: boolean,
};
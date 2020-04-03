import {History, LocationState} from 'history';
import {HistoryManager} from "Common/Router/Domain/HistoryManager";

export class BrowserHistoryManager implements HistoryManager {
    private readonly history: History<LocationState>;

    constructor(history: History) {
        this.history = history;
    }

    openUrlInOtherTarget(url: string, target: string): void {
        window.open(url, target);
    }

    changeCurrentUrl(url: string, replaceCurrentUrl: boolean): void {
        if (replaceCurrentUrl) {
            this.history.replace(url);
            return;
        }
        this.history.push(url);
    }

    getCurrentUrl(): string {
        return this.history.location.pathname;
    }

    getOnChangeCurrentUrlPromise(): Promise<string> {
        return new Promise((resolve) => {
            this.history.listen((location) => resolve(location.pathname));
        });
    }
}
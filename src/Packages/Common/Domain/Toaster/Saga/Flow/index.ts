import { ToasterCommandTypes, ToasterStateSelector } from "Packages/Common/Domain/Toaster/Types";
import { spawn, takeEvery } from "@redux-saga/core/effects";
import { handleRemoveMessage } from "Packages/Common/Domain/Toaster/Saga/Flow/RemoveMessageHandling";
import { handleShowMessage } from "Packages/Common/Domain/Toaster/Saga/Flow/ShowMessageHandling";

function* watchShowMessageCommands(toasterStateSelector: ToasterStateSelector): Generator {
    yield takeEvery(ToasterCommandTypes.SHOW_MESSAGE, handleShowMessage, toasterStateSelector);
}

function* watchRemoveMessageCommands(toasterStateSelector: ToasterStateSelector): Generator {
    yield takeEvery(ToasterCommandTypes.REMOVE_MESSAGE, handleRemoveMessage, toasterStateSelector);
}

export function createToasterSaga(toasterStateSelector: ToasterStateSelector): () => Generator {
    return function* (): Generator {
        yield spawn(watchRemoveMessageCommands, toasterStateSelector);
        yield spawn(watchShowMessageCommands, toasterStateSelector);
    };
}

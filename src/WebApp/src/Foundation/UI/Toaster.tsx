import { connect } from "react-redux";
import {
    ToasterWC as RepresentationalToaster,
    ToasterWCCallbacks,
    ToasterWCState,
} from "Packages/Common/Toaster/Web";
import { Dispatch } from "redux";
import { RootState } from "WebApp/ServicesFactory";
import { createRemoveMessage, getAllToasts } from "Packages/Common/Toaster/Domain";

const mapStateToProps = (rootState: RootState): ToasterWCState => ({
    toasts: getAllToasts(rootState.toaster),
});

const mapDispatchToProps = (dispatch: Dispatch): ToasterWCCallbacks => ({
    onRemoveMessage: (messageId: string): void => {
        dispatch(createRemoveMessage(messageId));
    },
});

export const Toaster = connect(
    mapStateToProps,
    mapDispatchToProps,
)(RepresentationalToaster);
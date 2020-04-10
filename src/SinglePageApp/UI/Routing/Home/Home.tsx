import React, {Component} from 'react';
import {FunctionalLink, RouterLink} from 'Common/UI/Base/Link/Link';
import {ToastTypes} from "Common/Domain/Toaster/Types";
import {Dispatch} from "redux";
import {createShowMessage} from "Common/Domain/Toaster/Command/ShowMessage";
import {connect} from "react-redux";
import {RootState} from "../../../ServicesFactory";
import {HomeState} from "../../../Domain/Routing/Home/Types";
import {RouteComponent} from "Common/UI/Router/Router";
import {homeRoute} from "../../../Domain/Routing/Home/Home";
import {ContentPage} from "../../Base/PageTypes/ContentPage";
import {createLeakReduxState} from "../../../Domain/Routing/Home/Command/LeakReduxState";
import {FormGroup} from "Common/UI/Form/FormGroup";
import {Label} from "Common/UI/Form/Label";
import {createLogin} from "Common/Domain/Authentication/Command/Login";
import {TextField} from "Common/UI/Form/Element/TextField";

type HomeCallbacks = {
    onClickLogin: () => void,
    onAddToast: (type: ToastTypes, content: string) => void,
    onClickLeakReduxState: () => void,
};

type HomeProps = (HomeState & HomeCallbacks);
class Home extends Component<HomeProps> {
    render() {
        return (
            <ContentPage>
                <h1>Features</h1>

                <br />

                <br />
                <h3>Routing</h3>
                <div>
                    <RouterLink url="/some-page-which-does-not-exist">
                        go to non existing page
                    </RouterLink>
                </div>

                <br />
                <h3>Authentication</h3>
                <FunctionalLink onClick={this.props.onClickLogin}>
                    Login
                </FunctionalLink>
                <br />

                <br />
                <h3>Toasts</h3>
                <div><FunctionalLink onClick={() => this.props.onAddToast(ToastTypes.SUCCESS, this.props.toastContentTextField.value)}>add a success toast message</FunctionalLink> (is being closed after 3 seconds)</div>
                <div><FunctionalLink onClick={() => this.props.onAddToast(ToastTypes.INFO, this.props.toastContentTextField.value)}>add an info toast message</FunctionalLink></div>
                <div><FunctionalLink onClick={() => this.props.onAddToast(ToastTypes.WARNING, this.props.toastContentTextField.value)}>add a warning toast message</FunctionalLink></div>
                <div><FunctionalLink onClick={() => this.props.onAddToast(ToastTypes.ERROR, this.props.toastContentTextField.value)}>add an error toast message</FunctionalLink></div>

                <br />
                <FormGroup>
                    <Label title={'Toast content: ' + this.props.toastContentTextField.value} formElementId="toastContentTextField" />
                    <TextField data={this.props.toastContentTextField} />
                </FormGroup>

                <br />
                <h3>Redux</h3>
                <div><FunctionalLink onClick={this.props.onClickLeakReduxState}>leak redux state in console</FunctionalLink></div>
            </ContentPage>
        );
    }
}

const mapStateToProps = (state: RootState): HomeState => {
    return state.routing.home;
};

const mapDispatchToProps = (dispatch: Dispatch): HomeCallbacks => {
    return {
        onClickLogin: () => dispatch(createLogin({
            username: 'sonGoku',
            password: '1234',
            shouldRemember: false,
        })),
        onAddToast: (type: ToastTypes, content: string) => dispatch(createShowMessage({
            content: content,
            toastType: type,
        })),
        onClickLeakReduxState: () => dispatch(createLeakReduxState()),
    };
};

export const homeRouteComponent: RouteComponent = {
    route: homeRoute,
    component: connect(mapStateToProps, mapDispatchToProps)(Home),
};
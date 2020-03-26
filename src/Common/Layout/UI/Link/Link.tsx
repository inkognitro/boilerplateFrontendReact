import React, { FunctionComponent } from 'react';
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {createOpenUrl} from "Common/Routing/Domain/Commands/OpenUrl";
import './Link.scss';

type FunctionalLinkProps = {
    url?: string,
    onClick: () => void,
};

export const FunctionalLink: FunctionComponent<FunctionalLinkProps> = (props) => {
    return (
        <a
            className="app-link"
            href={(props.url ? props.url : '#')}
            onClick={(event) => {
                event.preventDefault();
                props.onClick();
            }}
        >
            {props.children}
        </a>
    );
};

export enum Targets {
    SELF = '_self',
    BLANK = '_blank',
}

export type LinkProps = {
    url: string,
    target?: (string | Targets),
    children: any
};

export const Link: FunctionComponent<LinkProps> = (props) => {
    return (
        <FunctionalLink
            url={props.url}
            onClick={() => window.open(props.url, (props.target ? props.target : '_self'))}
        >
            {props.children}
        </FunctionalLink>
    );
};

const mapStateToProps = () => {};

const mapDispatchToProps = (dispatch: Dispatch, props: LinkProps) => {
    return {
        url: props.url,
        onClick: () => dispatch(
            createOpenUrl({
                url: props.url,
                target: props.target,
            })
        ),
    };
};

export const RouterLink = connect(mapStateToProps, mapDispatchToProps)(FunctionalLink);
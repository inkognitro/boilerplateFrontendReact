import React, { FC, Fragment } from "react";
import { findTranslatedText, TranslatorState } from "Packages/Common/Translator";
import { Translation } from "Packages/Common/CommonTypes";
import { TranslationTextConsumer } from './TranslatorContext';

type InternalTranslatedTextWCProps = {
    translatorState: TranslatorState
    translation: Translation
}

const InternalTranslatedTextWC: FC<InternalTranslatedTextWCProps> = (props) => {
    const translatedText = findTranslatedText(props.translatorState, props.translation);
    if (translatedText !== null) {
        return (<Fragment>{translatedText}</Fragment>);
    }
    if (props.translation.fallback) {
        return (<Fragment>{props.translation.fallback}</Fragment>);
    }
    return (<Fragment>{props.translation.translationId}</Fragment>);
};

export type TranslatedTextWCProps = {
    translation: Translation
}

export const TranslatedTextWC: FC<TranslatedTextWCProps> = (props) => (
    <TranslationTextConsumer>
        {(translatorState: TranslatorState) => (
            <InternalTranslatedTextWC
                translatorState={translatorState}
                translation={props.translation}
            />
        )}
    </TranslationTextConsumer>
);

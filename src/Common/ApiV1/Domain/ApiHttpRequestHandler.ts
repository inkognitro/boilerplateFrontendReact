import {
    createDeleteRequest as generalCreateDeleteRequest,
    createGetRequest as generalCreateGetRequest,
    createPatchRequest as generalCreatePatchRequest,
    createPostRequest as generalCreatePostRequest,
    createPutRequest as generalCreatePutRequest,
    createWithHeaderEnhancedHttpRequest
} from "Common/RequestHandling/Domain/Command/RequestCreation";
import {
    HttpRequestHandler,
    RequestExecutionSettings as GeneralRequestExecutionSettings
} from "Common/RequestHandling/Domain/HttpRequestHandler";
import {
    HttpRequest,
    HttpRequestResponse as GeneralHttpRequestResponse,
    SuccessHttpRequestResponse as GeneralSuccessHttpRequestResponse
} from "Common/RequestHandling/Domain/Types";
import {BasicResponseBody, MessageTypes} from "Common/ApiV1/Domain/Types";
import {COULD_NOT_CONNECT_TO_SERVER_TRANSLATION_ID} from "Common/Translator/Domain/Translation/en";
import {createAddToastMessage} from "Common/Toaster/Domain/Command/AddToastMessage";
import {ToastTypes} from "Common/Toaster/Domain/Types";
import {CommandBus} from "Common/AppBase/CommandBus";
import {TranslatedTextReader} from "Common/Translator/Domain/Query/TranslatedTextQuery";
import {CurrentAuthUserReader} from "Common/Auth/Domain/Query/CurrentAuthUserQuery";

export const createGetRequest = generalCreateGetRequest;
export const createPatchRequest = generalCreatePatchRequest;
export const createPutRequest = generalCreatePutRequest;
export const createPostRequest = generalCreatePostRequest;
export const createDeleteRequest = generalCreateDeleteRequest;

export type SuccessHttpRequestResponse<ResponseBody = BasicResponseBody> = GeneralSuccessHttpRequestResponse<ResponseBody>;
export type HttpRequestResponse = GeneralHttpRequestResponse<BasicResponseBody>;
export type RequestExecutionSettings = GeneralRequestExecutionSettings;

export const apiV1BaseUrl = '//localhost:9000';

export class ApiHttpRequestHandler {
    private commandBus: CommandBus;
    private httpRequestHandler: HttpRequestHandler;
    private currentAuthUserReader: CurrentAuthUserReader;
    private translatedTextReader: TranslatedTextReader;

    constructor(
        commandBus: CommandBus,
        httpRequestHandler: HttpRequestHandler,
        currentAuthUserReader: CurrentAuthUserReader,
        translatedTextReader: TranslatedTextReader
    ) {
        this.commandBus = commandBus;
        this.httpRequestHandler = httpRequestHandler;
        this.currentAuthUserReader = currentAuthUserReader;
        this.translatedTextReader = translatedTextReader;
    }

    public executeRequest(settings: RequestExecutionSettings): void {
        this.httpRequestHandler.executeRequest(this.createGeneralRequestExecutionSettings(settings));
    }

    private createGeneralRequestExecutionSettings(settings: RequestExecutionSettings): GeneralRequestExecutionSettings
    {
        return {
            request: this.getWithAuthTokenEnhancedRequest(settings.request),
            onSuccess:  (requestResponse): void => {
                this.showRequestResponseMessages(requestResponse);
                if (settings.onSuccess) {
                    settings.onSuccess(requestResponse);
                }
            },
            onError: (requestResponse): void => {
                this.showRequestResponseMessages(requestResponse);
                if (settings.onError) {
                    settings.onError(requestResponse);
                }
            },
        };
    }

    private showRequestResponseMessages(requestResponse: HttpRequestResponse): void {
        if (!requestResponse.response) {
            const foundTranslatedText = this.translatedTextReader.find({
                translationId: COULD_NOT_CONNECT_TO_SERVER_TRANSLATION_ID
            });
            const content = (foundTranslatedText ? foundTranslatedText : 'Could not connect to server.');
            const command = createAddToastMessage({
                type: ToastTypes.ERROR,
                content: content
            });
            this.commandBus.handle(command);
            return;
        }
        const generalMessages = requestResponse.response.body.generalMessages;
        if(!generalMessages) {
            return;
        }
        generalMessages.forEach((message) => {
            const toastType = getToastTypeByMessageType(message.type);
            const foundTranslatedText = this.translatedTextReader.find({
                translationId: message.translationId
            });
            const content = (foundTranslatedText ? foundTranslatedText : message.defaultText);
            const command = createAddToastMessage({
                type: toastType,
                content: content
            });
            this.commandBus.handle(command);
        });
    }

    private getWithAuthTokenEnhancedRequest(request: HttpRequest): HttpRequest
    {
        const authUser = this.currentAuthUserReader.find();
        if(!authUser) {
            return request;
        }
        const headerProperty = 'X-API-TOKEN';
        return createWithHeaderEnhancedHttpRequest(request, headerProperty, authUser.token);
    }
}

export function getToastTypeByMessageType(messageType: MessageTypes) {
    if (messageType === MessageTypes.ERROR) {
        return ToastTypes.ERROR
    }
    if (messageType === MessageTypes.SUCCESS) {
        return ToastTypes.SUCCESS
    }
    if (messageType === MessageTypes.WARNING) {
        return ToastTypes.WARNING
    }
    return ToastTypes.INFO;
}
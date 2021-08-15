import { AxiosResponse } from 'axios';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from 'semantic-ui-react';

interface IProps {
    response: AxiosResponse,
    title?: string,
    text?: string
}

const ErrorMessage: React.FC<IProps> = ({ response, title, text }) => {
    const { t, i18n } = useTranslation();
    const message = response.data?.message;
    const errors = response.data?.errors;

    //console.log(response.statusText, response.data.error, response.data.errors);

    return (
        <Message error>
            {title && <Message.Header content={title} />}
            {text && <Message.Content content={text} />}
            {message && (
                i18n.exists('api.' + message) ?
                    <Message.Content content={t('api.' + message)} /> :
                    <Message.Content content={message} />
            )}
            {errors && Object.keys(errors).length > 0 && (
                Object.values(errors).flat().map((error: any, i) => (
                    <Message.Content key={i}>{error && (
                        i18n.exists('api.' + error) ?
                            <Message.Content content={t('api.' + error)} /> :
                            <Message.Content content={error} />
                    )}</Message.Content>
                ))
            )}
        </Message>
    )
}

export default ErrorMessage
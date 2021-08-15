import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header } from 'semantic-ui-react';
import ErrorMessage from '../../../app/common/form/ErrorMessage';
import TextInput from '../../../app/common/form/TextInput';
import { IUserForgotPassFormValues } from '../../../app/models/user';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { generatePath } from "react-router";

const ForgotPassForm = () => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { forgotPassword } = rootStore.userStore;
    const { closeModal } = rootStore.modalStore;
    const resetPasswordUrl = `${window.location.origin.toString()}${generatePath("/resetpass/")}`;

    const validate = combineValidators({
        email: isRequired({ message: t('form.emailrequired') })
    })

    return (
        <React.Fragment>
            <FinalForm
                initialValues={{ resetPasswordUrl }}
                onSubmit={(values: IUserForgotPassFormValues) => forgotPassword(values).then(closeModal).catch(error => ({
                    [FORM_ERROR]: error
                }))}
                validate={validate}
                render={({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
                    <Form error>
                        <Header
                            as='h2'
                            content={t('user.forgotpassform.header')}
                            color='teal'
                            textAlign='center' />
                        <Field
                            name='email'
                            component={TextInput}
                            placeholder={t('common.email')}
                            autoFocus={true}
                        />
                        {submitError && !dirtySinceLastSubmit && (
                            <ErrorMessage response={submitError} text={t('user.resetpassform.emailinvalid')} />
                        )}

                        <Button
                            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                            loading={submitting}
                            positive
                            content={t('common.send')}
                            onClick={handleSubmit}
                            fluid
                            color='teal'
                            type='submit'
                        />
                        
                    </Form>
                )}
            />
        </React.Fragment>
    )
}

export default ForgotPassForm
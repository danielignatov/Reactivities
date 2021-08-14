import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Container, Form, Header } from 'semantic-ui-react';
import ErrorMessage from '../../../app/common/form/ErrorMessage';
import TextInput from '../../../app/common/form/TextInput';
import { IUserFormValues } from '../../../app/models/user';
import { RootStoreContext } from '../../../app/stores/rootStore';

const RegisterForm = () => {
    const { t, i18n } = useTranslation();
    const { language } = i18n;
    const rootStore = useContext(RootStoreContext);
    const { register } = rootStore.userStore;
    const { closeModal } = rootStore.modalStore;

    const validate = combineValidators({
        username: isRequired({ message: `${t('user.registerform.username')} ${t('form.isrequiredfield')}` }),
        displayName: isRequired({ message: `${t('user.registerform.displayname')} ${t('form.isrequiredfield')}` }),
        email: isRequired({ message: `${t('common.email')} ${t('form.isrequiredfield')}` }),
        password: isRequired({ message: `${t('common.password')} ${t('form.isrequiredfield')}` })
    })

    return (
        <Container>
            <FinalForm
                onSubmit={(values: IUserFormValues) => register(values).then(closeModal).catch(error => ({
                    [FORM_ERROR]: error
                }))}
                initialValues={{ locale: language }}
                validate={validate}
                render={({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
                    <Form error>
                        <Header
                            as='h2'
                            content={t('user.registerform.signuptositename')}
                            color='teal'
                            textAlign='center' />
                        <Field
                            name='username'
                            component={TextInput}
                            placeholder={t('user.registerform.username')}
                        />
                        <Field
                            name='displayName'
                            component={TextInput}
                            placeholder={t('user.registerform.displayname')}
                        />
                        <Field
                            name='email'
                            component={TextInput}
                            placeholder={t('common.email')}
                        />
                        <Field
                            name='password'
                            component={TextInput}
                            placeholder={t('common.password')}
                            type='password'
                        />
                        {submitError && !dirtySinceLastSubmit && (
                            <ErrorMessage response={submitError} />
                        )}

                        <Button
                            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                            loading={submitting}
                            positive
                            content={t('user.registerform.register')}
                            onClick={handleSubmit}
                            fluid
                            color='teal'
                        />
                        {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
                    </Form>
                )}
            />
        </Container>
    )
}

export default RegisterForm
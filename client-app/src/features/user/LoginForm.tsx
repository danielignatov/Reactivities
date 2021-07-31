import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header } from 'semantic-ui-react';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
})

const LoginForm = () => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { login } = rootStore.userStore;
    const { closeModal } = rootStore.modalStore;

    return (
        <FinalForm 
            onSubmit={(values: IUserFormValues) => login(values).then(closeModal).catch(error => ({
                [FORM_ERROR]: error
            }))}
            validate={validate}
            render={({ handleSubmit, submitting, form, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
                <Form error>
                    <Header 
                        as='h2' 
                        content={t('user.loginform.logintositename')} 
                        color='teal'
                        textAlign='center' />
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
                        <ErrorMessage error={submitError} text={t('user.loginform.submiterror')} />
                    )}
                    
                    <Button
                        disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                        loading={submitting}
                        positive
                        content={t('user.loginform.login')}
                        onClick={handleSubmit}
                        fluid
                        color='teal'
                    />
                    {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
                </Form>
            )}
        />
    )
}

export default LoginForm
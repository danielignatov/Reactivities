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
    username: isRequired('username'),
    displayName: isRequired('displayName'),
    email: isRequired('email'),
    password: isRequired('password')
})

const RegisterForm = () => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { register } = rootStore.userStore;
    const { closeModal } = rootStore.modalStore;

    return (
        <FinalForm 
            onSubmit={(values: IUserFormValues) => register(values).then(closeModal).catch(error => ({
                [FORM_ERROR]: error
            }))}
            validate={validate}
            render={({ handleSubmit, submitting, form, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
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
                        <ErrorMessage error={submitError} />
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
    )
}

export default RegisterForm
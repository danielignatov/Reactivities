import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
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
                        content='Login to Reactivities' 
                        color='teal'
                        textAlign='center' />
                    <Field
                        name='email' 
                        component={TextInput} 
                        placeholder='Email'
                    />
                    <Field
                        name='password' 
                        component={TextInput} 
                        placeholder='Password'
                        type='password'
                    />
                    {submitError && !dirtySinceLastSubmit && (
                        <ErrorMessage error={submitError} text='Invalid email or password' />
                    )}
                    
                    <Button
                        disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                        loading={submitting}
                        positive
                        content='Login'
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
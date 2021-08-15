import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Container, Form, Header } from 'semantic-ui-react';
import ErrorMessage from '../../../app/common/form/ErrorMessage';
import TextInput from '../../../app/common/form/TextInput';
import { IUserFormValues } from '../../../app/models/user';
import { RootStoreContext } from '../../../app/stores/rootStore';

const LoginForm = () => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { login } = rootStore.userStore;
    const { closeModal } = rootStore.modalStore;

    const validate = combineValidators({
        email: isRequired({ message: `${t('common.email')} ${t('form.isrequiredfield')}` }),
        password: isRequired({ message: `${t('common.password')} ${t('form.isrequiredfield')}` })
    })

    return (
        <React.Fragment>
            <FinalForm
                onSubmit={(values: IUserFormValues) => login(values).then(closeModal).catch(error => ({
                    [FORM_ERROR]: error
                }))}
                validate={validate}
                render={({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
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
                            type='email'
                            autoFocus={true}
                        />
                        <Field
                            name='password'
                            component={TextInput}
                            placeholder={t('common.password')}
                            type='password'
                        />
                        {submitError && !dirtySinceLastSubmit && (
                            <ErrorMessage response={submitError} text={t('user.loginform.error')} />
                        )}

                        <Button
                            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                            loading={submitting}
                            positive
                            content={t('user.loginform.login')}
                            onClick={handleSubmit}
                            fluid
                            color='teal'
                            type='submit'
                        />
                    </Form>
                )}
            />
            <Container
                textAlign='center'
                className='no-acc-text' >
                {t('user.loginform.noaccount')}
                {' '}
                <NavLink onClick={closeModal} to='/register' className='no-acc-reg-link'>
                    {t('user.registerform.register')}
                </NavLink>
            </Container>
            <Container
                textAlign='center'
                className='no-acc-text' >
                <NavLink onClick={closeModal} to='/forgotpass' className='no-acc-reg-link'>
                    {t('user.loginform.forgotpass')}
                </NavLink>
            </Container>
        </React.Fragment>
    )
}

export default LoginForm
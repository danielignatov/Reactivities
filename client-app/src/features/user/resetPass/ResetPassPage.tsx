import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Grid, GridColumn, Header } from 'semantic-ui-react';
import ErrorMessage from '../../../app/common/form/ErrorMessage';
import TextInput from '../../../app/common/form/TextInput';
import { IUserResetPassFormValues } from '../../../app/models/user';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface ResetPassParams {
    resetToken: string;
}

const ResetPassPage: React.FC<RouteComponentProps<ResetPassParams>> = ({ match }) => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { resetPassword } = rootStore.userStore;
    const { closeModal } = rootStore.modalStore;

    const validate = combineValidators({
        password: isRequired({ message: t('form.passrequired') })
    })

    return (
        <React.Fragment>
            <Grid>
                <GridColumn computer={4} only='computer' />
                <GridColumn computer={8} tablet={16} mobile={16}>
                    <FinalForm
                        initialValues={{ resetToken: match.params.resetToken }}
                        onSubmit={(values: IUserResetPassFormValues) => resetPassword(values).then(closeModal).catch(error => ({
                            [FORM_ERROR]: error
                        }))}
                        validate={validate}
                        render={({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
                            <Form error>
                                <Header
                                    as='h2'
                                    content={t('user.resetpassform.header')}
                                    color='teal'
                                    textAlign='center' />
                                <Field
                                    name='password'
                                    component={TextInput}
                                    placeholder={t('user.resetpassform.newpassword')}
                                    type='password'
                                    autoFocus={true}
                                />
                                {submitError && !dirtySinceLastSubmit && (
                                    <ErrorMessage response={submitError} text={t('user.resetpassform.emailinvalid')} />
                                )}

                                <Button
                                    disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                                    loading={submitting}
                                    positive
                                    content={t('common.save')}
                                    onClick={handleSubmit}
                                    fluid
                                    color='teal'
                                    type='submit'
                                />

                            </Form>
                        )}
                    />
                </GridColumn>
            </Grid>
        </React.Fragment>
    )
}

export default ResetPassPage
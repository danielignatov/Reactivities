import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header } from 'semantic-ui-react';
import ErrorMessage from '../../../app/common/form/ErrorMessage';
import SelectInput from '../../../app/common/form/SelectInput';
import { locales } from '../../../app/common/options/localeOptions';
import { IUserSettingsFormValues } from '../../../app/models/user';
import { RootStoreContext } from '../../../app/stores/rootStore';

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
})

const SettingsForm = () => {
    const { t, i18n } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { settings, user } = rootStore.userStore;
    const { closeModal } = rootStore.modalStore;
    const { language } = i18n;

    return (
        <React.Fragment>
            <FinalForm
                initialValues={settings}
                onSubmit={(values: IUserSettingsFormValues) => settings(values).then(closeModal).catch(error => ({
                    [FORM_ERROR]: error
                }))}
                validate={validate}
                render={({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
                    <Form error>
                        <Header
                            as='h2'
                            content={t('user.settingsform.usersettings')}
                            color='teal'
                            textAlign='center' />
                        <Field
                            name='locale'
                            placeholder={t('user.settingsform.localeplaceholder')}
                            fluid
                            component={SelectInput}
                            options={locales}
                            initialValue={user?.locale ?? language}
                        />
                        {submitError && !dirtySinceLastSubmit && (
                            <ErrorMessage response={submitError} text={t('user.loginform.submiterror')} />
                        )}

                        <Button
                            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                            loading={submitting}
                            positive
                            content={t('common.save')}
                            onClick={handleSubmit}
                            fluid
                            color='teal'
                        />
                    </Form>
                )}
            />
        </React.Fragment>
    )
}

export default SettingsForm
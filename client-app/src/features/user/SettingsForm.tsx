import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react';
import { Form as FinalForm } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header, Select } from 'semantic-ui-react';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import { IUserSettingsFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
})

const SettingsForm = () => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { settings } = rootStore.userStore;
    const { closeModal } = rootStore.modalStore;
    //const { language } = i18n;

    const locales = [
        { key: 'bg', value: 'bg', text: 'Bulgarian' },
        { key: 'en', value: 'en', text: 'English' },
    ];

    return (
        <React.Fragment>
            <FinalForm
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
                        <Select
                            name='locale'
                            options={locales}
                            //labeled={true}
                            fluid
                        />
                        {submitError && !dirtySinceLastSubmit && (
                            <ErrorMessage error={submitError} text={t('user.loginform.submiterror')} />
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
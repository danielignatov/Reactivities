import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { Button, Form, Header, Label } from 'semantic-ui-react';
import ErrorMessage from '../../../app/common/form/ErrorMessage';
import SelectInput from '../../../app/common/form/SelectInput';
import { locales } from '../../../app/common/options/localeOptions';
import { IUserSettingsFormValues } from '../../../app/models/user';
import { RootStoreContext } from '../../../app/stores/rootStore';

const SettingsForm = () => {
    const { t, i18n } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { editSettings, user } = rootStore.userStore;
    const { closeModal } = rootStore.modalStore;
    const { language } = i18n;

    return (
        <React.Fragment>
            <FinalForm
                onSubmit={(values: IUserSettingsFormValues) => editSettings(values).then(() => i18n.changeLanguage(values.locale)).then(closeModal).catch(error => ({
                    [FORM_ERROR]: error
                }))}
                render={({ handleSubmit, submitting, submitError }) => (
                    <Form error>
                        <Header
                            as='h2'
                            content={t('user.settingsform.usersettings')}
                            color='teal'
                            textAlign='center' />
                        <Label pointing='below'>{t('user.settingsform.localelabel')}</Label>
                        <Field
                            name='locale'
                            placeholder={t('user.settingsform.localeplaceholder')}
                            fluid
                            component={SelectInput}
                            options={locales}
                            initialValue={user?.locale ?? language}
                        />
                        {submitError && (
                            <ErrorMessage response={submitError} />
                        )}

                        <Button
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
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { IProfile } from '../../../app/models/profile';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { combineValidators, composeValidators, hasLengthLessThan, isRequired } from 'revalidate';
import { useTranslation } from 'react-i18next';

const validate = combineValidators({
    displayName: isRequired({ message: 'The display name is required' }),
    bio: composeValidators(
        hasLengthLessThan(2000)({ message: 'Bio has to be 2000 or less characters' })
    )(),
})

interface IProps {
    profile: IProfile,
    editProfile: (editedProfile: Partial<IProfile>) => void;
}

const ProfileAboutForm: React.FC<IProps> = ({ profile, editProfile }) => {
    const { t } = useTranslation();
    
    return (
        <Grid>
            <Grid.Column width={16}>
                <Segment clearing>
                    <FinalForm
                        validate={validate}
                        initialValues={profile!}
                        onSubmit={editProfile}
                        render={({ handleSubmit, invalid, pristine, submitting }) => (
                            <Form onSubmit={handleSubmit} loading={submitting} error >
                                <Field
                                    component={TextInput}
                                    name='displayName'
                                    placeholder={t('profiles.form.profileaboutform.displayname')}
                                    value={profile!.displayName} />
                                <Field
                                    component={TextAreaInput}
                                    name='bio'
                                    rows={3}
                                    placeholder={t('profiles.form.profileaboutform.bio')}
                                    value={profile!.bio} />

                                <Button
                                    disabled={submitting || invalid || pristine}
                                    loading={submitting}
                                    floated='right'
                                    positive type='submit'
                                    content={t('profiles.form.profileaboutform.submit')} />
                            </Form>
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>

    )
}

export default observer(ProfileAboutForm)
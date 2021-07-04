import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { IProfile } from '../../../app/models/profile';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { combineValidators, composeValidators, hasLengthLessThan, isRequired } from 'revalidate';

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
                                    placeholder='Display name'
                                    value={profile!.displayName} />
                                <Field
                                    component={TextAreaInput}
                                    name='bio'
                                    rows={3}
                                    placeholder='Bio'
                                    value={profile!.bio} />

                                <Button
                                    disabled={submitting || invalid || pristine}
                                    loading={submitting}
                                    floated='right'
                                    positive type='submit'
                                    content='Submit' />
                            </Form>
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>

    )
}

export default observer(ProfileAboutForm)
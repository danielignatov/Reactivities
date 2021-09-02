import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, Tab, Button, Grid, Container } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileAboutForm from './form/ProfileAboutForm';

const ProfileAbout = () => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { editProfile, profile, isCurrentUser } = rootStore.profileStore;
    const [ editProfileMode, setEditProfileMode ] = useState(false);

    const onProfileEdit = (values: any) => {
        editProfile(values).then(() => setEditProfileMode(false));
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{ paddingBottom: 0 }} >
                    <Header
                        floated='left'
                        icon='address card'
                        content={`${t('profiles.profileabout.about')} ${profile!.username}`} />
                    { isCurrentUser &&
                        <Button floated='right' basic content={ editProfileMode ? t('common.cancel') : t('common.edit') } onClick={() => setEditProfileMode(!editProfileMode)} />
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    { editProfileMode ? (
                        <ProfileAboutForm editProfile={onProfileEdit} profile={profile!} />
                    ) : (
                        <Container text>
                            {profile?.bio ? profile.bio : t('profiles.profileabout.nobio')}
                        </Container>
                    )}

                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfileAbout)
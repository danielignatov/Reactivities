import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Header, Tab, Button, Grid, Container } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileAboutForm from './form/ProfileAboutForm';

const ProfileAbout = () => {
    const rootStore = useContext(RootStoreContext);
    const { editProfile, profile, isCurrentUser } = rootStore.profileStore;
    const [editProfileMode, setEditProfileMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{ paddingBottom: 0 }} >
                    <Header 
                    floated='left' 
                    icon='address card' 
                    content={`About ${profile!.username}`} />
                    {isCurrentUser &&
                        <Button floated='right' basic content={editProfileMode ? 'Cancel' : 'Edit'} onClick={() => setEditProfileMode(!editProfileMode)} />
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {editProfileMode ? (
                        <ProfileAboutForm editProfile={editProfile} profile={profile!} />
                    ) : (
                        <Container text>
                            {profile?.bio ? profile.bio : 'Apparently, this user prefers to keep an air of mystery about them.' }
                        </Container>
                    )}

                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfileAbout)
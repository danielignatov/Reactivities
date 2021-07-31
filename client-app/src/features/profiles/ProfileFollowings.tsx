import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
//import { useEffect } from 'react';
import { Tab, Grid, Header, Card, Container } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileCard from './ProfileCard';

const ProfileFollowings = () => {
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { profile, followings, loading, activeTab } = rootStore.profileStore;

  //useEffect(() => {
  //  loadFollowings('followers');
  //}, [loadFollowings])

  return (
    <Tab.Pane loading={loading}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            content={
              activeTab === 3
                ? `${t('profiles.profilefollowings.peoplefollowing')} ${profile!.displayName}`
                : `${t('profiles.profilefollowings.people')} ${profile!.displayName} ${t('profiles.profilefollowings.isfollowing')}`
            }
          />
        </Grid.Column>
        <Grid.Column width={16}>
          {followings.length ?
            <Card.Group itemsPerRow={5}>
              {followings.map((profile) => (
                <ProfileCard
                  key={profile.username}
                  profile={profile}
                />
              ))}
            </Card.Group>
            :
            <Container text>
              { activeTab === 3 
              ? `${t('profiles.profilefollowings.nobodyisfollowing')} ${profile?.displayName}. ${t('profiles.profilefollowings.bethefirst')}.`
              : `${profile?.displayName} ${t('profiles.profilefollowings.doesnotfollowanybody')}.`
              }
            </Container>
          }
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileFollowings);

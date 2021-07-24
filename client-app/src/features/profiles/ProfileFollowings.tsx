import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
//import { useEffect } from 'react';
import { Tab, Grid, Header, Card, Container } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileCard from './ProfileCard';

const ProfileFollowings = () => {
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
                ? `People following ${profile!.displayName}`
                : `People ${profile!.displayName} is following`
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
              ? `Nobody is following ${profile?.displayName}. Be the first.`
              : `${profile?.displayName} does not follow anybody.`
              }
            </Container>
          }
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileFollowings);

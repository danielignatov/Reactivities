import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Segment, Item, Header, Button, Grid, Statistic, Divider, Reveal } from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';

interface IProps {
  profile: IProfile,
  isCurrentUser: boolean,
  loading: boolean,
  follow: (username: string) => void;
  unfollow: (username: string) => void;
}

const ProfileHeader: React.FC<IProps> = ({ profile, isCurrentUser, loading, follow, unfollow }) => {
  const { t } = useTranslation();
  
  return (
    <Segment>
      <Grid stackable={true}>
        <Grid.Column width={11}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size='small'
                src={profile?.image || '/assets/user.png'}
              />
              <Item.Content verticalAlign='middle'>
                <Header as='h1'>{profile.displayName}</Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={5}>
          <Statistic.Group widths={2}>
            <Statistic label={t('profiles.profileheader.followers')} value={profile.followersCount} />
            <Statistic label={t('profiles.profileheader.following')} value={profile.followingCount} />
          </Statistic.Group>
          <Divider />
          {!isCurrentUser &&
            <Reveal animated='move'>
              <Reveal.Content visible style={{ width: '100%' }}>
                <Button
                  fluid
                  color='teal'
                  content={profile.following ? t('profiles.profileheader.following') : t('profiles.profileheader.notfollowing')}
                />
              </Reveal.Content>
              <Reveal.Content hidden>
                <Button
                  loading={loading}
                  fluid
                  basic
                  color={profile.following ? 'red' : 'green'}
                  content={profile.following ? t('profiles.profileheader.unfollow') : t('profiles.profileheader.follow')}
                  onClick={profile.following ? () => unfollow(profile.username) : () => follow(profile.username)}
                />
              </Reveal.Content>
            </Reveal>
          }

        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader);

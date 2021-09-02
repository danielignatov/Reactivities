import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Tab, Grid, Header, Card, Image, TabProps } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IUserActivity } from '../../app/models/profile';
import { RootStoreContext } from '../../app/stores/rootStore';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

const ProfileEvents = () => {
  const { t } = useTranslation();

  const panes = [
    { menuItem: t('profiles.profileactivities.futureevents'), pane: { key: 'futureEvents' } },
    { menuItem: t('profiles.profileactivities.pastevents'), pane: { key: 'pastEvents' } },
    { menuItem: t('profiles.profileactivities.hosting'), pane: { key: 'hosted' } }
  ];
  
  const rootStore = useContext(RootStoreContext);
  const {
    loadUserActivities,
    profile,
    loadingActivities,
    userActivities
  } = rootStore.profileStore!;

  useEffect(() => {
    loadUserActivities(profile!.username);
  }, [loadUserActivities, profile]);

  const handleTabChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: TabProps
  ) => {
    let predicate;
    switch (data.activeIndex) {
      case 1:
        predicate = 'past';
        break;
      case 2:
        predicate = 'hosting';
        break;
      default:
        predicate = 'future';
        break;
    }
    loadUserActivities(profile!.username, predicate);
  };

  return (
    <Tab.Pane loading={loadingActivities}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='calendar' content={'Activities'} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {userActivities.map((activity: IUserActivity) => (
              <Card
                as={Link}
                to={`/activity/${activity.id}`}
                key={activity.id}
              >
                <Image
                  src={`/assets/categoryImages/${activity.category.toLowerCase()}.jpg`}
                  style={{ minHeight: 100, objectFit: 'cover' }}
                />
                <Card.Content>
                  <Card.Header textAlign='center'>{activity.title}</Card.Header>
                  <Card.Meta textAlign='center'>
                    <div>{t('profiles.profileactivities.date', { date: new Date(activity.date) })}</div>
                    <div>{t('profiles.profileactivities.time', { date: new Date(activity.date) })}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileEvents);

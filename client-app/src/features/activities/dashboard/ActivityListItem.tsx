import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Item, Button, Segment, Icon, Label } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { format } from 'date-fns';
import ActivityListItemAttendees from './ActivityListItemAttendees';
import { useTranslation } from 'react-i18next';
//import ActivityStore from '../../../app/stores/activityStore'

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
    const { t } = useTranslation();
    const host = activity.attendees.filter(x => x.isHost)[0];

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src={host.image || '/assets/user.png'} style={{marginBottom: 5}} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                            <Item.Description>
                            {t('activities.dashboard.activitylistitem.hostedby')} <Link to={`/profile/${host.username}`}> {host.displayName}</Link>
                            </Item.Description>
                            {activity.isHost && 
                            <Item.Description>
                                <Label basic color='orange' content={t('activities.dashboard.activitylistitem.hostedbyyou')} />
                            </Item.Description>
                            }
                            {activity.isGoing && !activity.isHost &&
                            <Item.Description>
                                <Label basic color='green' content={t('activities.dashboard.activitylistitem.youaregoing')} />
                            </Item.Description>
                            }
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendees attendees={activity.attendees} />
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link} to={`/activities/${activity.id}`}
                    floated='right'
                    content={t('common.view')}
                    color='blue' />
            </Segment>
        </Segment.Group>

    )
}

export default observer(ActivityListItem)
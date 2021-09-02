import { observer } from 'mobx-react-lite';
import React from 'react';
import { Segment, Grid, Icon } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { useTranslation } from 'react-i18next';

const ActivityDetailedInfo: React.FC<{ activity: IActivity }> = ({ activity }) => {
    const { t } = useTranslation();

    return (
        <Segment.Group>
            <Segment attached='top'>
                <Grid>
                    <Grid.Column width={2} textAlign='center'>
                        <Icon size='large' color='teal' name='info' />
                    </Grid.Column>
                    <Grid.Column width={14}>
                        <p>{activity.description}</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={2} textAlign='center'>
                        <Icon name='calendar' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={14}>
                        <span>
                            {t('activities.details.activitydetailedinfo.date', { date: activity.date })}
                        </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={2} textAlign='center'>
                        <Icon name='marker' size='large' color='teal'  />
                    </Grid.Column>
                    <Grid.Column width={14}>
                        <span>{activity.venue}, {activity.city}</span>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    )
}

export default observer(ActivityDetailedInfo)
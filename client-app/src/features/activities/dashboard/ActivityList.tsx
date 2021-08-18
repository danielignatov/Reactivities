import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import ActivityListItem from './ActivityListItem';
import { useTranslation } from 'react-i18next';

const ActivityList: React.FC = () => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { activitiesByDate } = rootStore.activityStore;
    return (
        <Fragment>
            {activitiesByDate.map(([group, activities]) => (
                <Fragment key={group}>
                    <Label size='large' color='blue'>
                        {t('activities.dashboard.activitylist.date', {date: new Date(group)})}
                    </Label>

                    <Item.Group divided>
                        {activities.map(activity => (
                            <ActivityListItem key={activity.id} activity={activity}></ ActivityListItem>
                        ))}
                    </Item.Group>
                </Fragment>
            ))}
        </Fragment>
    )
}

export default observer(ActivityList)
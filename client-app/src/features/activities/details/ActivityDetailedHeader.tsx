import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { useTranslation } from 'react-i18next';
import LoginForm from '../../user/login/LoginForm';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

const ActivityDetailedHeader: React.FC<{ activity: IActivity }> = ({ activity }) => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { attendActivity, cancelAttendance, loading } = rootStore.activityStore;
    const { isLoggedIn } = rootStore.userStore;
    const { openModal } = rootStore.modalStore;
    const host = activity.attendees.filter(x => x.isHost)[0];
    
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <Image src={`/assets/categoryImages/${activity.category.toLowerCase()}.jpg`} fluid style={activityImageStyle} />
                <Segment basic style={activityImageTextStyle} >
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{t('activities.details.activitydetailedheader.date', {date: new Date(activity.date)})}</p>
                                <p>
                                    {t('activities.details.activitydetailedheader.hostedby')} <Link to={`/profile/${host.username}`}><strong>{host.displayName}</strong></Link>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity.isHost && isLoggedIn ? (
                    <Button as={Link} to={`/manage/${activity.id}`} color='orange' floated='right'>
                        {t('activities.details.activitydetailedheader.manageevent')}
                    </Button>
                ) : activity.isGoing ? (
                    <Button loading={loading} onClick={cancelAttendance}>{t('activities.details.activitydetailedheader.cancelattendance')}</Button>
                ) : isLoggedIn ? (
                    <Button loading={loading} onClick={attendActivity} color='teal'>{t('activities.details.activitydetailedheader.joinactivity')}</Button>
                ) : (
                    <Button onClick={() => openModal(<LoginForm />)} to='/login' color='teal'>{t('activities.details.activitydetailedheader.joinactivity')}</Button>
                )}
            </Segment>
        </Segment.Group>
    )
}

export default observer(ActivityDetailedHeader)
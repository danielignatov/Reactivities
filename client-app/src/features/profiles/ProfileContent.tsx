import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import ProfileAbout from './ProfileAbout';
import ProfileActivities from './ProfileActivities';
import ProfileFollowings from './ProfileFollowings';
import ProfilePhotos from './ProfilePhotos';
import { useTranslation } from 'react-i18next';

interface IProps {
    setActiveTab: (activeIndex: any) => void;
}

const ProfileContent: React.FC<IProps> = ({setActiveTab}) => {
    const { t } = useTranslation();

    const panes = [
        {menuItem: t('profiles.profilecontent.about'), render: () => <ProfileAbout /> },
        {menuItem: t('profiles.profilecontent.photos'), render: () => <ProfilePhotos /> },
        {menuItem: t('profiles.profilecontent.activities'), render: () => <ProfileActivities />},
        {menuItem: t('profiles.profilecontent.followers'), render: () => <ProfileFollowings />},
        {menuItem: t('profiles.profilecontent.following'), render: () => <ProfileFollowings />}
    ];

    return (
        <Tab 
            menu={{fluid: true, vertical: true }} 
            menuPosition='right'
            panes={panes}
            //activeIndex={1}
            onTabChange={(e, data) => setActiveTab(data.activeIndex)}
        />
    )
}

export default observer(ProfileContent)
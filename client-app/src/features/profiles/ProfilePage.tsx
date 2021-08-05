import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { RootStoreContext } from '../../app/stores/rootStore'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'

interface RouteParams {
    username: string
}

interface IProps extends RouteComponentProps<RouteParams> { }

const ProfilePage: React.FC<IProps> = ({ match }) => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { loadingProfile, profile, loadProfile, follow, unfollow, isCurrentUser, loading, setActiveTab } = rootStore.profileStore;

    useEffect(() => {
        loadProfile(match.params.username)
    }, [loadProfile, match])

    if (loadingProfile) return <LoadingComponent content={t('profiles.profilepage.loadingprofile')} />

    if (!profile)
        return <h2><Trans i18nKey='profiles.profilepage.profilenotfound' /></h2>

    return (
        <React.Fragment>
            <Grid className='profile-page'>
                <Grid.Column width={16}>
                    <ProfileHeader 
                    profile={profile!} 
                    follow={follow} 
                    unfollow={unfollow} 
                    isCurrentUser={isCurrentUser} 
                    loading={loading} />
                </Grid.Column>
                <Grid.Column width={16} only='computer tablet' >
                    <ProfileContent setActiveTab={setActiveTab} />
                </Grid.Column>
            </Grid>
        </React.Fragment>
    )
}

export default observer(ProfilePage)
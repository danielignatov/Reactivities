import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilters';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';
import { useTranslation } from 'react-i18next';

const ActivityDashboard: React.FC = () => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { loadActivities, loadingInitial, setPage, page, totalPages } = rootStore.activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    const handleGetNext = () => {
        setLoadingNext(true);
        setPage(page + 1);
        loadActivities().then(() => setLoadingNext(false))
    };

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    return (
        <React.Fragment>
            <Grid stackable={true} reversed='mobile'>
                <Grid.Column width={10}>
                    {loadingInitial && page === 0 ?
                        <ActivityListItemPlaceholder /> :
                        (
                            <InfiniteScroll
                                pageStart={0}
                                loadMore={handleGetNext}
                                hasMore={!loadingNext && ((page + 1) < totalPages)}
                                initialLoad={false}
                            >
                                <ActivityList />
                            </InfiniteScroll>
                        )
                    }


                </Grid.Column>
                <Grid.Column width={6} style={{ marginTop: '1.5em' }}>
                    <ActivityFilters />
                </Grid.Column>

            </Grid>
            <Grid>
                <Grid.Column width={10}>
                    <Loader active={loadingNext} />

                    <Button
                        floated='right'
                        content={t('activities.dashboard.activitydashboard.more')}
                        positive
                        disabled={totalPages === (page + 1)}
                        onClick={handleGetNext}
                        loading={loadingNext}
                    />
                </Grid.Column>
            </Grid>
        </React.Fragment>
    )
}

export default observer(ActivityDashboard)
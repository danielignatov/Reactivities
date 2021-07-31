import { Fragment } from 'react';
import { Menu, Header } from 'semantic-ui-react';
import { Calendar } from 'react-widgets';
import { useContext } from 'react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

const ActivityFilters = () => {
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate } = rootStore.activityStore;

  return (
    <Fragment>
      <Menu vertical size={'large'} style={{ width: '100%', marginTop: 30 }}>
        <Header icon={'filter'} attached color={'teal'} content={t('activities.dashboard.activityfilters.filters')} />
        <Menu.Item
          active={predicate.size === 0}
          onClick={() => setPredicate('all', 'true')}
          color={'blue'}
          name={'all'}
          content={t('activities.dashboard.activityfilters.all')} />
        <Menu.Item
          active={predicate.has('isGoing')}
          onClick={() => setPredicate('isGoing', 'true')}
          color={'blue'}
          name={'username'}
          content={t('activities.dashboard.activityfilters.imgoing')} />
        <Menu.Item
          active={predicate.has('isHost')}
          onClick={() => setPredicate('isHost', 'true')}
          color={'blue'}
          name={'host'}
          content={t('activities.dashboard.activityfilters.imhosting')} />
      </Menu>
      <Header icon={'calendar'} attached color={'teal'} content={t('activities.dashboard.activityfilters.selectdate')} />
      <Calendar
        onChange={(date) => setPredicate('startDate', date!)}
        value={predicate.get('startDate') || new Date()} />
    </Fragment>
  );
}

export default observer(ActivityFilters);
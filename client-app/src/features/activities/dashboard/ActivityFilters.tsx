import { Fragment } from 'react';
import { Menu, Header } from 'semantic-ui-react';
import Calendar from 'react-calendar';
import { useContext } from 'react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import LoginForm from '../../user/login/LoginForm';

const ActivityFilters = () => {
  const { t, i18n } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate } = rootStore.activityStore;
  const { isLoggedIn } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;

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
          onClick={() => (
            isLoggedIn ?
            setPredicate('isGoing', 'true') :
            openModal(<LoginForm />)
            )}
          color={'blue'}
          name={'username'}
          content={t('activities.dashboard.activityfilters.imgoing')} />
        <Menu.Item
          active={predicate.has('isHost')}
          onClick={() => (
            isLoggedIn ?
            setPredicate('isHost', 'true') :
            openModal(<LoginForm />)
            )}
          color={'blue'}
          name={'host'}
          content={t('activities.dashboard.activityfilters.imhosting')} />
      </Menu>
      <Header icon={'calendar'} attached color={'teal'} content={t('activities.dashboard.activityfilters.selectdate')} />
      <Calendar
        locale={i18n.language}
        onChange={(date: any) => setPredicate('startDate', date!)}
        value={predicate.get('startDate') || new Date()} 
        />
    </Fragment>
  );
}

export default observer(ActivityFilters);
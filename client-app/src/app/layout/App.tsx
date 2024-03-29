import React, { Fragment, useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';
import { useTranslation } from 'react-i18next';
import LoginPage from '../../features/user/login/LoginPage';
import RegisterPage from '../../features/user/register/RegisterPage';
import ForgotPassPage from '../../features/user/forgotPass/ForgotPassPage';
import ResetPassPage from '../../features/user/resetPass/ResetPassPage';
import SettingsPage from '../../features/user/settings/SettingsPage';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { appLoaded, setAppLoaded, token } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token])

  if (!appLoaded) {
    return <LoadingComponent content={t('loading.app')} />
  }

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right' />
      <Route exact path='/' render={() => (
        <Fragment>
          <NavBar />
          <Container>
            <ActivityDashboard />
          </Container>
        </Fragment>
      )} />
      <Route path={'/(.+)'} render={() => (
        <Fragment>
          <NavBar />
          <Container>
            <Switch>
              <Route path='/activities' component={ActivityDashboard} />
              <Route path='/activity/:id' component={ActivityDetails} />
              <PrivateRoute
                key={location.key}
                path={['/createActivity', '/manage/:id']}
                component={ActivityForm}
              />
              <Route path='/profile/:username' component={ProfilePage} />
              <Route exact path='/login' component={LoginPage} />
              <Route exact path='/register' component={RegisterPage} />
              <Route exact path='/forgotpass' component={ForgotPassPage} />
              <Route path='/resetpass/:resetToken' component={ResetPassPage} />
              <PrivateRoute exact path='/settings' component={SettingsPage} />
              <Route component={NotFound} />
            </Switch>
          </Container>
        </Fragment>
      )} />
    </Fragment>
  );
}

export default withRouter(observer(App));
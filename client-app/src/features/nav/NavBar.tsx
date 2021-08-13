import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container, Dropdown, Menu, Image } from "semantic-ui-react";
import { RootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import RegisterForm from '../user/RegisterForm';
import SettingsForm from '../user/SettingsForm';

const NavBar: React.FC = () => {
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { logout, isLoggedIn, user } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;

  return (
    <React.Fragment>
      <Container className='navbar-spacer' />
      <Menu fixed='top' inverted={true} >
        <Container>
          <Menu.Item
            header
            as={Link}
            to='/'>
            <img src="/assets/logo.png" alt="logo" style={{ marginRight: '10px' }} />
            {t('common.sitename')}
          </Menu.Item>
          { isLoggedIn && user ? (
            <Menu.Item position='right'>
              <Image avatar spaced='right' src={`${user.image || '/assets/user.png'}`} />
              <Dropdown pointing='top left' text={user.displayName} >
                <Dropdown.Menu direction='left' >
                  <Dropdown.Item
                    as={Link}
                    to={`/profile/${user.username}`}
                    text={t('nav.navbar.myprofilebtn')}
                    icon='user' />
                  <Dropdown.Item
                    as={Link}
                    to='/createActivity'
                    text={t('nav.navbar.createactivitybtn')}
                    icon='plus' />
                  <Dropdown.Item
                    as={Link}
                    onClick={() => openModal(<SettingsForm />)}
                    to='/settings'
                    text={t('nav.navbar.settingsbtn')}
                    icon='cog' />
                  <Dropdown.Item
                    onClick={logout}
                    text={t('nav.navbar.logoutbtn')}
                    icon='power' />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          ) : (
            <Menu.Item position='right'>
              <Image avatar spaced='right' src={`${'/assets/user.png'}`} />
              <Dropdown pointing='top left' text={t('nav.navbar.guest')} >
                <Dropdown.Menu direction='left' >
                  <Dropdown.Item
                    as={Link}
                    onClick={() => openModal(<LoginForm />)}
                    to='/login'
                    text={t('nav.navbar.login')}
                    icon='sign-in' />
                  <Dropdown.Item
                    onClick={() => openModal(<RegisterForm />)}
                    to='/register'
                    text={t('nav.navbar.register')}
                    icon='plus' />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}
        </Container>
      </Menu>
    </React.Fragment>
  )
}

export default observer(NavBar)
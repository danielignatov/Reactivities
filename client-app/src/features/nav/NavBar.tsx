import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Menu, Image } from "semantic-ui-react";
import { RootStoreContext } from '../../app/stores/rootStore';

const NavBar: React.FC = () => {
  const { t } = useTranslation();
  const rootStore = useContext(RootStoreContext);
  const { logout, user } = rootStore.userStore;
  
  return (
    <Menu attached stackable={true} inverted >
      <Container>
        <Menu.Item header as={NavLink} exact to='/'>
          <img src="/assets/logo.png" alt="logo" style={{ marginRight: '10px' }} />
          {t('common.sitename')}
        </Menu.Item>
        <Menu.Item as={NavLink} exact to='/activities'
          name={t('common.activities')}
        />
        <Menu.Item>
          <Button as={NavLink} to='/createActivity' positive content={t('nav.navbar.createactivitybtn')} />
        </Menu.Item>
        {user && (
          <Menu.Item position='right'>
            <Image avatar spaced='right' src={`${user.image || '/assets/user.png'}`} />
            <Dropdown pointing='top left' text={user.displayName} >
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profile/${user.username}`} text={t('nav.navbar.myprofilebtn')} icon='user' />
                <Dropdown.Item onClick={logout} text={t('nav.navbar.logoutbtn')} icon='power' />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  )
}

export default observer(NavBar)
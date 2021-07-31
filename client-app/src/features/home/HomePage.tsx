import React, { Fragment, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Container, Header, Segment, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import RegisterForm from '../user/RegisterForm';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { t } = useTranslation();
    const token = window.localStorage.getItem('jwt');
    const rootStore = useContext(RootStoreContext);
    const { isLoggedIn, user } = rootStore.userStore;
    const { openModal } = rootStore.modalStore;

    return (
        <Segment inverted textAlign='center' vertical className='masthead' >
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
                        {t('common.sitename')}
                    </Header>
                {isLoggedIn && user && token ? (
                    <Fragment>
                        <Header as='h2' inverted content={`${t('home.homepage.welcomeback')} ${user.displayName}`} />
                        <Button as={Link} to='/activities' size='huge' inverted>
                            {t('home.homepage.gotoactivities')}
                        </Button>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Header as='h2' inverted content={`${t('home.homepage.welcometo')} ${t('common.sitename')}`} />
                        <Button onClick={() => openModal(<LoginForm />)} to='/login' size='huge' inverted>
                            {t('home.homepage.login')}
                        </Button>
                        <Button onClick={() => openModal(<RegisterForm />)} to='/register' size='huge' inverted>
                            {t('home.homepage.register')}
                        </Button>
                    </Fragment>
                )}
            </Container>
        </Segment>
    );
};

export default observer(HomePage)
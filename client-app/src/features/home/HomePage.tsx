import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <Container style={{ marginTop: '7em' }}>
            <h1>Home page</h1>
            <h3>Go to <Link to='/activities'>Activities</Link></h3>
        </Container>
    );
};

export default observer(HomePage)
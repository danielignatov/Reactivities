import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import LoginForm from './LoginForm';

const LoginPage = () => {
    return (
        <React.Fragment>
            <Grid>
                <GridColumn computer={4} only='computer' />
                <GridColumn computer={8} tablet={16} mobile={16}>
                    <LoginForm />
                </GridColumn>
            </Grid>
        </React.Fragment>
    )
}

export default LoginPage
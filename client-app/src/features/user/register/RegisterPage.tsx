import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import RegisterForm from './RegisterForm';

const RegisterPage = () => {
    return (
        <React.Fragment>
            <Grid>
                <GridColumn computer={4} only='computer' />
                <GridColumn computer={8} tablet={16} mobile={16}>
                    <RegisterForm />
                </GridColumn>
            </Grid>
        </React.Fragment>
    )
}

export default RegisterPage
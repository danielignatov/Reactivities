import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import ForgotPassForm from './ForgotPassForm';

const ForgotPassPage = () => {
    return (
        <React.Fragment>
            <Grid>
                <GridColumn computer={4} only='computer' />
                <GridColumn computer={8} tablet={16} mobile={16}>
                    <ForgotPassForm />
                </GridColumn>
            </Grid>
        </React.Fragment>
    )
}

export default ForgotPassPage
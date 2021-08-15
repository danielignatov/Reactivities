import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import SettingsForm from './SettingsForm';

const SettingsPage = () => {
    return (
        <React.Fragment>
            <Grid>
                <GridColumn computer={4} only='computer' />
                <GridColumn computer={8} tablet={16} mobile={16}>
                    <SettingsForm />
                </GridColumn>
            </Grid>
        </React.Fragment>
    )
}

export default SettingsPage
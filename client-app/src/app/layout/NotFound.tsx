import React from 'react';
import { Segment, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
    const { t } = useTranslation();

    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                {t('error.notfound')}
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities' primary>
                {t('button.back.toallactivities')}
                </Button>
            </Segment.Inline>
        </Segment>
    );
};

export default NotFound;